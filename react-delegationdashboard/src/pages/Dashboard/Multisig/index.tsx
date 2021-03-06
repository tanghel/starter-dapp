import * as React from 'react';
import { useContext, useDispatch } from 'context';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import State from 'components/State';
import ProposeAction from '../Actions/ProposeAction/ProposeAction';
import ProposalCard from 'components/ProposalCard';
import { MultisigActionContainer, MultisigActionType } from 'context/state';
import { Address } from '@elrondnetwork/erdjs/out';


const MyMultisig = () => {
  const { address, quorumSize, loading, allActions } = useContext();

  const alreadySigned = (action: MultisigActionContainer) => {
    let typedAddress = new Address(address);
    for (let signerAddress of action.signers) {
      if (signerAddress.hex() === typedAddress.hex()) {
        return true;
      }
    }

    return false;
  };

  const canSign = (action: MultisigActionContainer) => {
    return !alreadySigned(action);
  };

  const canUnsign = (action: MultisigActionContainer) => {
    return alreadySigned(action);
  };

  const canPerformAction = (action: MultisigActionContainer) => {
    return alreadySigned(action) && action.signers.length >= quorumSize;
  };

  const canDiscardAction = (action: MultisigActionContainer) => {
    return action.signers.length === 0;
  };

  return (
    <>
      {loading ? (
        <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
      ) : (
        <div className="card mt-spacer">
          <div className="card-body p-spacer">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <p className="h6 mb-3">My proposals</p>
              <div className="d-flex flex-wrap">
                <ProposeAction />
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
