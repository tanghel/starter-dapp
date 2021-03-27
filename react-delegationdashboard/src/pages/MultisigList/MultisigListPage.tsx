import { Redirect } from 'react-router-dom';
import { Address, Transaction, TransactionHash } from '@elrondnetwork/erdjs/out';
import React, { useState } from 'react';
import { useContext } from 'context';
import MultisigListItem from 'pages/MultisigList/MultisigListItem';
import { MultisigContractInfo } from 'types/MultisigContractInfo';
import AddMultisigModal from './AddMultisigModal';
import DeployMultisigModal from './DeployMultisigModal';
import { useDeployContract } from 'contracts/DeployContract';
import { useManagerContract } from 'contracts/ManagerContract';
import { hexToAddress, hexToString } from 'helpers/converters';
import { tryParseTransactionParameter } from 'helpers/urlparameters';
import { useConfirmModal } from 'components/ConfirmModal/ConfirmModalPayload';

const MultisigListPage = () => {
  const { loggedIn, address, dapp, multisigDeployerContract, multisigManagerContract } = useContext();
  const { deployContract } = useDeployContract();
  const { managerContract } = useManagerContract();
  const [showAddMultisigModal, setShowAddMultisigModal] = React.useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = React.useState(false);

  const confirmModal = useConfirmModal();

  const [multisigContracts, setMultisigContracts] = useState<MultisigContractInfo[]>([]);

  const onDeployClicked = async () => {
    setShowDeployMultisigModal(true);
  };

  const onAddMultisigClicked = async () => {
    setShowAddMultisigModal(true);
  };

  const onAddMultisigFinished = async (address: Address) => {
    await managerContract.mutateRegisterMultisigContract(address);

    setShowAddMultisigModal(false);
  };

  const onDeployMultisigFinished = async (name: string) => {
    sessionStorage.setItem('deployedMultisigName', name);

    await deployContract.mutateDeploy(1, [new Address(address)]);
  };

  const readMultisigContracts = async () => {
    let contracts = await managerContract.queryContracts();

    setMultisigContracts(contracts);
  };

  const tryParseUrlParams = async () => {
    let parameters = await tryParseTransactionParameter(dapp);
    if (parameters === null) {
      return;
    }

    if (parameters.receiver.bech32() === multisigDeployerContract) {
      if (parameters.functionName === 'deployContract') {
        if (parameters.outputParameters.length === 2 && hexToString(parameters.outputParameters[0]) === 'ok') {
          let multisigAddress = hexToAddress(parameters.outputParameters[1]);
          if (multisigAddress !== null) {
            onDeployContract(multisigAddress);
          }
        }
      }
    } else if (parameters.receiver.bech32() === multisigManagerContract) {
      if (parameters.functionName === 'registerMultisigName') {
        if (parameters.outputParameters.length === 1 && hexToString(parameters.outputParameters[0]) === 'ok') {
          onRegisterMultisigName();
        }
      } else if (parameters.functionName === 'registerMultisigContract') {
        if (parameters.outputParameters.length === 1 && hexToString(parameters.outputParameters[0]) === 'ok') {
          onRegisterMultisigContract();
        }
      }
    }
  };

  const onDeployContract = async (multisigAddress: Address) => {
    sessionStorage.setItem('multisigAddressHex', multisigAddress.hex());
    let deployedMultisigName = sessionStorage.getItem('deployedMultisigName') ?? '';
    if (!deployedMultisigName) {
      return;
    }

    await confirmModal.show('Step 2: Registering multisig name', 'Sign transaction');

    managerContract.mutateRegisterMultisigContractName(multisigAddress, deployedMultisigName);
  };

  const onRegisterMultisigName = async () => {
    let multisigAddressHex = sessionStorage.getItem('multisigAddressHex');
    if (!multisigAddressHex) {
      return;
    }

    let multisigAddress = new Address(multisigAddressHex);
    await confirmModal.show('Step 3: Attaching multisig to your account', 'Sign transaction');

    managerContract.mutateRegisterMultisigContract(multisigAddress);
  };

  const onRegisterMultisigContract = async () => {
    sessionStorage.removeItem('multisigAddressHex');
    sessionStorage.removeItem('deployedMultisigName');
  };

  React.useEffect(() => {
    tryParseUrlParams();

    if (address && address !== '') {
      readMultisigContracts();
    }
  }, []);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="owner w-100">
        <div className="card">
          <div className="card-body">

            <div className="p-spacer">
              <button
                onClick={onDeployClicked}
                className="btn btn-primary mb-3 mr-2"
              >
                Deploy Multisig
              </button>

              <button
                onClick={onAddMultisigClicked}
                className="btn btn-primary mb-3"
              >
                Add Existing Multisig
              </button>
            </div>

            <div className="card border-0">
              <div className="card-body pt-0 px-spacer pb-spacer">
                <h2 className="text-center my-5">Your Multisig wallets</h2>
              </div>

              {multisigContracts.length > 0 ?
                multisigContracts.map(contract =>
                  <MultisigListItem
                    key={contract.address.hex()}
                    address={contract.address}
                    name={contract.name}
                  />
                ) :
                <div className="m-auto text-center py-spacer">
                  <div className="state m-auto p-spacer text-center">
                    <p className="h4 mt-2 mb-1">No Multisig Wallet Yet</p>
                    <div className="mb-3">Welcome to our platform!</div>
                    <div>
                      <button
                        onClick={onDeployClicked}
                        className="btn btn-primary mb-3 mr-2"
                      >
                        Deploy Multisig
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <AddMultisigModal
          show={showAddMultisigModal}
          handleClose={() => {
            setShowAddMultisigModal(false);
          }}
          handleAdd={onAddMultisigFinished}
        />

        <DeployMultisigModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          handleDeploy={onDeployMultisigFinished}
        />
      </div>
    </>
  );
};

export default MultisigListPage;
