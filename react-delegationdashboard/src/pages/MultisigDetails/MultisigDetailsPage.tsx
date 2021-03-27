import React from 'react';
import { useContext } from 'context';
import Multisig from './Multisig';
import { Link, Redirect } from 'react-router-dom';
import StatCard from 'components/StatCard';

const MultisigDetailsPage = () => {
  const { currentMultisigAddress, totalBoardMembers, totalProposers, quorumSize, userRole } = useContext();

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
          <Multisig />
        </div>
      </div>
    </div>
  );
};

export default MultisigDetailsPage;
