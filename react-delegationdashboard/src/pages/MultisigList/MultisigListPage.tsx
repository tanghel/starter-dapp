import { Redirect } from 'react-router-dom';
import { Address, Transaction, TransactionHash } from '@elrondnetwork/erdjs/out';
import React, { useState } from 'react';
import { useContext } from 'context';
import MultisigListItem from 'pages/MultisigList/MultisigListItem';
import useDeployContract from 'helpers/useDeployContract';
import useManagerContract from 'helpers/useManagerContract';
import { MultisigContractInfo } from 'types/MultisigContractInfo';
import AddMultisigModal from './AddMultisigModal';
import DeployMultisigModal from './DeployMultisigModal';

const MultisigListPage = () => {
  const { loggedIn, allMultisigContracts, address, dapp, multisigDeployerContract, multisigManagerContract } = useContext();
  const { deployContract } = useDeployContract();
  const { managerContract } = useManagerContract();
  const [showAddMultisigModal, setShowAddMultisigModal] = React.useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = React.useState(false);

  const initialMultisigContracts: MultisigContractInfo[] = [];
  const [multisigContracts, setMultisigContracts] = useState(initialMultisigContracts);

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
    localStorage.setItem('deployedMultisigName', name);

    await deployContract.mutateDeploy(1, [ new Address(address) ]);
  };

  const readMultisigContracts = async () => {
    let contracts = await managerContract.queryContracts();

    console.log({contracts});

    setMultisigContracts(contracts);
  };

  const tryParseUrlParams = async () => {
    let searchParams = new URLSearchParams(window.location.search);
    let txHash = searchParams.get('txHash');
    if (txHash && txHash !== '') {
      console.log({txHash});

      let result = await fetch(`${dapp.apiUrl}/transactions/${txHash}`);
      let json = await result.json();
      console.log({json});

      let inputData = json.data;
      let inputDecoded = atob(inputData);
      let inputParams = inputDecoded.split('@');

      let scResults = json.scResults;
      if (scResults.length > 0) {
        if (json.receiver === multisigDeployerContract) {
          let outputData = scResults[0].data;
          let outputDecoded = atob(outputData);

          let resultParams = outputDecoded.split('@').slice(1);
          console.log({resultParams});
          if (resultParams.length === 2 && resultParams[0] === '6f6b') {
            let multisigAddress = new Address(resultParams[1]);
            console.log({multisigAddress});

            localStorage.setItem('multisigAddressHex', resultParams[1]);

            setTimeout(() => {
              managerContract.mutateRegisterMultisigContract(multisigAddress);
            }, 1000);
          }
        } else if (json.receiver === multisigManagerContract) {
          let data = scResults[0].data;
          let decoded = atob(data);

          let functionName = inputParams[0];

          let resultParams = decoded.split('@').slice(1);
          if (resultParams.length === 1 && resultParams[0] === '6f6b') {
            if (functionName === 'registerMultisigContract') {
              console.log({resultParams});

              let multisigAddressHex = localStorage.getItem('multisigAddressHex');
              let deployedMultisigName = localStorage.getItem('deployedMultisigName') ?? '';

              if (multisigAddressHex && deployedMultisigName) {
                let multisigAddress = new Address(multisigAddressHex);

                setTimeout(() => managerContract.mutateRegisterMultisigContractName(multisigAddress, deployedMultisigName), 1000);
              }
            }
          }
        }
      }
    }
  };

  React.useEffect(() => {
    tryParseUrlParams();

    if (address !== '') {
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
