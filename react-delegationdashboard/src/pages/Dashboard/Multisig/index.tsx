import * as React from 'react';
import { useContext, useDispatch } from 'context';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import State from 'components/State';
import ProposeAction from '../Actions/ProposeAction/ProposeAction';
import ProposalCard from 'components/ProposalCard';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';


const MyMultisig = () => {
  const { address, quorumSize, loading, allActions, userRole } = useContext();

  const alreadySigned = (action: MultisigActionDetailed) => {
    let typedAddress = new Address(address);
    for (let signerAddress of action.signers) {
      if (signerAddress.hex() === typedAddress.hex()) {
        return true;
      }
    }

    return false;
  };

  const isProposer = () => {
    return userRole !== 0;
  };

  const isBoardMember = () => {
    return userRole === 2;
  };

  const canSign = (action: MultisigActionDetailed) => {
    return isBoardMember() && !alreadySigned(action);
  };

  const canUnsign = (action: MultisigActionDetailed) => {
    return isBoardMember() && alreadySigned(action);
  };

  const canPerformAction = (action: MultisigActionDetailed) => {
    return isBoardMember() && alreadySigned(action) && action.signers.length >= quorumSize;
  };

  const canDiscardAction = (action: MultisigActionDetailed) => {
    return isBoardMember() && action.signers.length === 0;
  };

  return (
    <>
      {loading ? (
        <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
      ) : (
        <div className="card mt-spacer">
          <div className="card-body p-spacer">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <p className="h6 mb-3">Proposals</p>
              <div className="d-flex flex-wrap">
                { isProposer() ? 
                  <ProposeAction /> : null
              }
              </div>
            </div>

            {
              allActions.map(action => 
                <ProposalCard 
                  key={action.actionId} 
                  actionId={action.actionId}
                  title={action.title()} 
                  value={action.description()} 
                  canSign={canSign(action)} 
                  canUnsign={canUnsign(action)}
                  canPerformAction={canPerformAction(action)}
                  canDiscardAction={canDiscardAction(action)}
                  signers={action.signers}
                />
              )
            }
            
          </div>
        </div>
      )}
    </>
  );
};

export default MyMultisig;
