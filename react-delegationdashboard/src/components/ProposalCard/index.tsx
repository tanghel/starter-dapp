import { ProposalCardType, StatCardType } from 'helpers/types';
import React from 'react';
import { nodeTransactions } from '../../pages/Owner/Nodes/helpers/stakeHooks';
import { useContext, useDispatch } from 'context';

const ProposalCard = ({
  actionId = 0,
  title = '',
  value = '0',
  canSign = false,
  canUnsign = false,
  canPerformAction = false,
  canDiscardAction = false
}: ProposalCardType) => {
  const { dapp, multisigContract } = useContext();

  let sign = () => {
    nodeTransactions.sign(actionId, dapp, multisigContract);
  };

  let unsign = () => {
    nodeTransactions.unsign(actionId, dapp, multisigContract);
  };

  let performAction = () => {
    nodeTransactions.performAction(actionId, dapp, multisigContract);
  };

  let discardAction = () => {
    nodeTransactions.discardAction(actionId, dapp, multisigContract);
  };

  return (
    <div className="statcard card-bg-red text-white py-3 px-4 mb-spacer ml-spacer rounded">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-white">
          
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between">
          <div>
            <span className="opacity-6">{title}</span>
            <p className="h5 mb-0">
                {value}
            </p>
          </div>
          <div>
            { canSign &&
                <button onClick={sign} className="btn btn-primary mb-3">Sign</button>
            }

            { canUnsign &&
                <button onClick={unsign} className="btn btn-primary mb-3">Unsign</button>
            }  

            { canPerformAction &&
                <button onClick={performAction} className="btn btn-primary mb-3">Perform action</button>
            }  

            { canDiscardAction &&
                <button onClick={discardAction} className="btn btn-primary mb-3">Discard action</button>
            }  
          </div>
      </div>
    </div>
  );
};

export default ProposalCard;
