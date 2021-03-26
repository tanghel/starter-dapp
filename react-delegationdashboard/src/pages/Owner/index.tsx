import { Redirect } from 'react-router-dom';
import { Address, Transaction, TransactionHash } from '@elrondnetwork/erdjs/out';
import React, { useState } from 'react';
import { useContext } from 'context';
import Overview from 'components/Overview';
import MultisigCard from 'components/MultisigCard';
import useSmartContractDeploy from 'helpers/useSmartContractDeploy';
import useSmartContractManager from 'helpers/useSmartContractManager';
import { MultisigContractInfo } from 'types/MultisigContractInfo';

const Owner = () => {
  const { loggedIn, allMultisigContracts, address, dapp } = useContext();
  const { scDeploy } = useSmartContractDeploy();
  const { scManager } = useSmartContractManager();

  const initialMultisigContracts: MultisigContractInfo[] = [];
  const [multisigContracts, setMultisigContracts] = useState(initialMultisigContracts);

  const onDeployClicked = async () => {
    await scDeploy.mutateDeploy(1, [ new Address(address) ]);
  };

  const readMultisigContracts = async () => {
    let contracts = await scManager.queryContracts();

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
      
      let scResults = json.scResults;
      if (scResults.length > 0) {
        let data = scResults[0].data;
        let decoded = atob(data);

        let resultParams = decoded.split('@').slice(1);
        console.log({resultParams});
        if (resultParams.length === 2 && resultParams[0] === '6f6b') {
          console.log({address: new Address(resultParams[1]).bech32()});
        }
      }
    }
  };

  React.useEffect(() => {
    tryParseUrlParams();
    readMultisigContracts();
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
          </div>
          </div>

          {
            multisigContracts.map(contract => 
              <MultisigCard 
                key={contract.address.hex()}
                address={contract.address}
                name={contract.name}
              />
            )
          }
        </div>
      </div>
    </>
  );
};

export default Owner;
