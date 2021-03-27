import React from 'react';
import { useMultisig } from 'helpers';
import { useContext, useDispatch } from 'context';
import { Address } from '@elrondnetwork/erdjs/out';
import { useHistory } from 'react-router-dom';
import useSmartContractManager from 'helpers/useSmartContractManager';

export interface MultisigCardType {
  address: Address;
  name: string;
}

const MultisigCard = ({
  address = Address.Zero(),
  name = ''
}: MultisigCardType) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { scManager } = useSmartContractManager();

  const onEnterClicked = () => {
    dispatch({
      type: 'setCurrentMultisigAddress',
      currentMultisigAddress: address
    });

    history.push('/dashboard');
  };

  const onUnregisterClicked = async () => {
    await scManager.mutateUnregisterMultisigContract(address);
  };

  return (
    <div className="statcard card-bg-red text-white py-3 px-4 mb-spacer ml-spacer rounded">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-white">
          
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
          <div>
            <span className="opacity-6">{address.hex()}</span>
            <p className="h5 mb-0">
                {name}
            </p>
          </div>
          <div>
            <button onClick={onEnterClicked} className="btn btn-primary mb-3 mr-2">Enter</button>
            <button onClick={onUnregisterClicked} className="btn btn-primary mb-3 mr-2">Unregister</button>
          </div>
      </div>
    </div>
  );
};

export default MultisigCard;
