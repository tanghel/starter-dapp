import * as React from 'react';
import { useContext } from 'context';
import StatCard from 'components/StatCard';

const Views = () => {
  const {
    totalBoardMembers,
    totalProposers,
    quorumSize,
    userRole,
  } = useContext();

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
  );
};

export default Views;
