import React from 'react';
import { useContext, useDispatch } from 'context';
import { Link, Redirect, useParams } from 'react-router-dom';
import StatCard from 'components/StatCard';
import State from 'components/State';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import ProposeAction from './Propose/ProposeAction';
import MultisigProposalCard from 'pages/MultisigDetails/MultisigProposalCard';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { useMultisigContract } from 'contracts/MultisigContract';
import { useLoading } from 'helpers/loading';

interface MultisigDetailsPageParams {
  multisigAddressParam: string
}

const MultisigDetailsPage = () => {
  const { address, totalBoardMembers, totalProposers, quorumSize, userRole, loading, allActions, currentMultisigAddress } = useContext();
  const { multisigContract } = useMultisigContract();
  const dispatch = useDispatch();
  const loadingIndicator = useLoading();
  let { multisigAddressParam } = useParams<MultisigDetailsPageParams>();

  const parseMultisigAddress = (): Address | undefined => {
    try {
      return new Address(multisigAddressParam);
    } catch {
      return undefined;
    }
  };

  if (!parseMultisigAddress()) {
    return <Redirect to="/multisig" />;
  }

  const getDashboardInfo = async () => {
    loadingIndicator.show();
    try {
      const [
        totalBoardMembers,
        totalProposers,
        quorumSize,
        userRole,
        allActions,
      ] = await Promise.all([
        multisigContract.queryBoardMembersCount(),
        multisigContract.queryProposersCount(),
        multisigContract.queryQuorumCount(),
        multisigContract.queryUserRole(new Address(address).hex()),
        multisigContract.queryAllActions(),
      ]);

      dispatch({
        type: 'setTotalBoardMembers',
        totalBoardMembers: totalBoardMembers
      });
  
      dispatch({
        type: 'setTotalProposers',
        totalProposers: totalProposers
      });
  
      dispatch({
        type: 'setQuorumSize',
        quorumSize: quorumSize
      }); 
  
      dispatch({
        type: 'setUserRole',
        userRole: userRole
      });
  
      dispatch({
        type: 'setAllActions',
        allActions: allActions
      });
    } finally {
      loadingIndicator.hide();
    }
  };

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

  React.useEffect(() => {
    let multisigAddressParam = parseMultisigAddress();

    let isCurrentMultisigAddressNotSet = !currentMultisigAddress;
    let isCurrentMultisigAddressDiferentThanParam = currentMultisigAddress && multisigAddressParam && 
      currentMultisigAddress.hex() !== multisigAddressParam.hex();

    if (isCurrentMultisigAddressNotSet || isCurrentMultisigAddressDiferentThanParam) {
      dispatch({ type: 'setCurrentMultisigAddress', currentMultisigAddress: multisigAddressParam });
    } else {
      getDashboardInfo();
    }
  }, [ currentMultisigAddress ]);

  return (
    <div className="dashboard w-100">
      <div className="card border-0">
        <div className="header card-header d-flex align-items-center border-0 justify-content-between px-spacer">
          <div className="py-spacer text-truncate">
            <p className="opacity-6 mb-0">Multisig Address</p>
            <span className="text-truncate">{currentMultisigAddress?.bech32()}</span>
          </div>
          <div className="d-flex justify-content-center align-items-center justify-content-between">
            <Link to="/multisig" className="btn btn-primary btn-sm">
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
