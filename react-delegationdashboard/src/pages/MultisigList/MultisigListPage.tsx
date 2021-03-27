import { Redirect } from 'react-router-dom';
import { Address, Transaction, TransactionHash } from '@elrondnetwork/erdjs/out';
import React, { useState } from 'react';
import { useContext } from 'context';
import MultisigListItem from 'pages/MultisigList/MultisigListItem';
import { MultisigContractInfo } from 'types/MultisigContractInfo';
import AddMultisigModal from './AddMultisigModal';
import DeployMultisigModal from './DeployMultisigModal';
import { useDeployContract } from 'contracts/DeployContract';
import { ManagerContract, useManagerContract } from 'contracts/ManagerContract';
import { hexToAddress, hexToString } from 'helpers/converters';
import TransactionParameter from 'types/TransactionParameter';
import { tryParseTransactionParameter } from 'helpers/urlparameters';

const MultisigListPage = () => {
  const { loggedIn, address, dapp, multisigDeployerContract, multisigManagerContract } = useContext();
  const { deployContract } = useDeployContract();
  const { managerContract } = useManagerContract();
  const [showAddMultisigModal, setShowAddMultisigModal] = React.useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = React.useState(false);

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

    await deployContract.mutateDeploy(1, [ new Address(address) ]);
  };

  const readMultisigContracts = async () => {
    let contracts = await managerContract.queryContracts();

    setMultisigContracts(contracts);
  };

  const tryParseUrlParams = async () => {
    let parameters = await tryParseTransactionParameter(dapp.apiUrl);
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

  const onDeployContract = (multisigAddress: Address) => {
    sessionStorage.setItem('multisigAddressHex', multisigAddress.hex());
    let deployedMultisigName = sessionStorage.getItem('deployedMultisigName') ?? '';
    if (!deployedMultisigName) {
      return;
    }

    setTimeout(() => managerContract.mutateRegisterMultisigContractName(multisigAddress, deployedMultisigName), 1000);
  };

  const onRegisterMultisigName = () => {
    let multisigAddressHex = sessionStorage.getItem('multisigAddressHex');
    if (!multisigAddressHex) {
      return;
    }

    let multisigAddress = new Address(multisigAddressHex);

    setTimeout(() => managerContract.mutateRegisterMultisigContract(multisigAddress), 1000);
  };

  const onRegisterMultisigContract = () => {
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
        <div className="card border-0">
          <div className="card-body pt-0 px-spacer pb-spacer">

          <div className="p-spacer">
            <button 
              onClick={onDeployClicked}
              className="btn btn-primary mb-3"
            >
              Deploy
            </button>

            <button 
              onClick={onAddMultisigClicked}
              className="btn btn-primary mb-3"
            >
              Add Multisig
            </button>
          </div>
          </div>

          {
            multisigContracts.map(contract => 
              <MultisigListItem 
                key={contract.address.hex()}
                address={contract.address}
                name={contract.name}
              />
            )
          }
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
