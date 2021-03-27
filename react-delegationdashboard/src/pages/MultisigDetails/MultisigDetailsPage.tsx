import React from 'react';
import { useContext } from 'context';
import { Link, Redirect } from 'react-router-dom';
import StatCard from 'components/StatCard';
import State from 'components/State';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import ProposeAction from './Propose/ProposeAction';
import MultisigProposalCard from 'pages/MultisigDetails/MultisigProposalCard';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';

const MultisigDetailsPage = () => {
  const { address, currentMultisigAddress, totalBoardMembers, totalProposers, quorumSize, userRole, loading, allActions } = useContext();

  if (!currentMultisigAddress) {
    return <Redirect to="/owner" />;
  }

  const userRoleAsString = () => {
    switch (userRole) {
      case 0:
        return 'No rights';
      case 1:
        return 'Proposer';
      case 2:
        return 'Proposer/Signer';
      default:
        return 'Unknown';
    }
  };

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
    <div className="dashboard w-100">
      <div className="card border-0">
        <div className="header card-header d-flex align-items-center border-0 justify-content-between px-spacer">
          <div className="py-spacer text-truncate">
            <p className="opacity-6 mb-0">Multisig Address</p>
            <span className="text-truncate">{currentMultisigAddress?.bech32()}</span>
          </div>
          <div className="d-flex justify-content-center align-items-center justify-content-between">
            <Link to="/owner" className="btn btn-primary btn-sm">
              Manage multisigs
            </Link>
          </div>
        </div>
        

        <div className="cards d-flex flex-wrap mr-spacer">
          <StatCard
            title="Board Members"
            value={totalBoardMembers.toString()}
            color="orange"
            svg="contract.svg"
          />
          <StatCard
            title="Proposers"
            value={totalProposers.toString()}
            valueUnit=""
            color="purple"
            svg="nodes.svg"
          />
          <StatCard
            title="Quorum size"
            value={quorumSize.toString()}
            valueUnit=""
            color="orange"
            svg="leaf-solid.svg"
          />
          <StatCard
            title="User role"
            value={userRoleAsString()}
            valueUnit=""
            color="orange"
            svg="leaf-solid.svg"
          />
        </div>

        <div className="card-body pt-0 px-spacer pb-spacer">
          
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
                    <MultisigProposalCard 
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
        </div>
      </div>
    </div>
  );
};

export default MultisigDetailsPage;