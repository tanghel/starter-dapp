import React from 'react';
import { useContext } from 'context';
import { Address } from '@elrondnetwork/erdjs/out';
import useMultisigContract from 'helpers/useMultisigContract';

export interface MultisigProposalCardType {
  actionId?: number;
  title?: string;
  value?: string;
  canSign?: boolean;
  canUnsign?: boolean;
  canPerformAction?: boolean;
  canDiscardAction?: boolean;
  signers: Address[];
}

const MultisigProposalCard = ({
  actionId = 0,
  title = '',
  value = '0',
  canSign = false,
  canUnsign = false,
  canPerformAction = false,
  canDiscardAction = false,
  signers = []
}: MultisigProposalCardType) => {
  const { multisigContract } = useMultisigContract();
  const { quorumSize } = useContext();

  let sign = () => {
    multisigContract.mutateSign(actionId);
  };

  let unsign = () => {
    multisigContract.mutateUnsign(actionId);
  };

  let performAction = () => {
    multisigContract.mutatePerformAction(actionId);
  };

  let discardAction = () => {
    multisigContract.mutateDiscardAction(actionId);
  };

  return (
    <div className="statcard card-bg-red text-white py-3 px-4 mb-spacer ml-spacer rounded">
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 fill-white">
          
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between">
          <div>
            <span className="opacity-6">{title} ({signers.length} / {quorumSize})</span>
            <p className="h5 mb-0">
                {value}
            </p>
          </div>
          <div>
            { canSign &&
                <button onClick={sign} className="btn btn-primary mb-3 mr-2">Sign</button>
            }

            { canUnsign &&
                <button onClick={unsign} className="btn btn-primary mb-3 mr-2">Unsign</button>
            }  

            { canPerformAction &&
                <button onClick={performAction} className="btn btn-primary mb-3 mr-2">Perform action</button>
            }  

            { canDiscardAction &&
                <button onClick={discardAction} className="btn btn-primary mb-3 mr-2">Discard action</button>
            }  
          </div>
      </div>
    </div>
  );
};

export default MultisigProposalCard;
