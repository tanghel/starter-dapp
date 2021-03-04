import * as React from 'react';
import { decimals, denomination } from 'config';
import { useContext } from 'context';
import denominate from 'components/Denominate/formatters';
import StatCard from 'components/StatCard';
import { Address, NetworkStake } from '@elrondnetwork/erdjs/out';
import { useState } from 'react';

import SetPercentageFeeAction from './SetPercentageFeeAction';
import UpdateDelegationCapAction from './UpdateDelegationCapAction';
import AutomaticActivationAction from './AutomaticActivationAction';

const Views = () => {
  const {
    dapp,
    egldLabel,
    totalActiveStake,
    numberOfActiveNodes,
    address,
    contractOverview,
    aprPercentage,
    totalBoardMembers,
    totalProposers,
    quorumSize,
    userRole
  } = useContext();
  const [networkStake, setNetworkStake] = useState(new NetworkStake());

  const getPercentage = (amountOutOfTotal: string, total: string) => {
    let percentage =
      (parseInt(amountOutOfTotal.replace(/,/g, '')) / parseInt(total.replace(/,/g, ''))) * 100;
    if (percentage < 1) {
      return '<1';
    }
    return percentage ? percentage.toFixed(2) : '...';
  };

  const isAdmin = () => {
    let loginAddress = new Address(address).hex();
    return loginAddress.localeCompare(contractOverview.ownerAddress) === 0;
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

  const getNetworkStake = () => {
    dapp.apiProvider
      .getNetworkStake()
      .then(value => {
        setNetworkStake(value);
      })
      .catch(e => {
        console.error('getTotalStake error ', e);
      });
  };

  React.useEffect(() => {
    getNetworkStake();
  }, []);

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
