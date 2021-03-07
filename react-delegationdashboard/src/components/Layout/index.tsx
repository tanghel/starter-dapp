import { Address } from '@elrondnetwork/erdjs/out';
import { QueryResponse } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import denominate from 'components/Denominate/formatters';
import { denomination, decimals } from 'config';
import { useContext, useDispatch } from 'context';
import { contractViews } from 'contracts/ContractViews';
import { ContractOverview, NetworkConfig, NetworkStake, Stats } from 'helpers/types';
import React from 'react';
import { calculateAPR } from './APRCalculation';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children, page }: { children: React.ReactNode; page: string }) => {
  const dispatch = useDispatch();
  const { dapp, address, multisigContract } = useContext();
  const { getNumBoardMembers, getNumProposers, getQuorum, userRole } = contractViews;

  const getContractOverviewType = (value: QueryResponse) => {
    let delegationCap = denominate({
      decimals,
      denomination,
      input: value.returnData[2].asBigInt.toString(),
      showLastNonZeroDecimal: false,
    });
    let initialOwnerFunds = denominate({
      decimals,
      denomination,
      input: value.returnData[3].asBigInt.toString(),
      showLastNonZeroDecimal: false,
    });
    return new ContractOverview(
      value.returnData[0].asHex.toString(),
      (value.returnData[1].asNumber / 100).toString(),
      delegationCap,
      initialOwnerFunds,
      value.returnData[4]?.asString,
      value.returnData[5].asBool,
      value.returnData[6].asBool,
      value.returnData[7].asBool,
      value.returnData[8]?.asNumber * 6
    );
  };

  React.useEffect(() => {


    console.log({address: address});

    Promise.all([
      getNumBoardMembers(dapp, multisigContract ?? ''),
      getNumProposers(dapp, multisigContract ?? ''),
      getQuorum(dapp, multisigContract ?? ''),
      // userRole(new Address(address).hex(), dapp, multisigContract ?? ''),
      dapp.apiProvider.getNetworkStats(),
      dapp.apiProvider.getNetworkStake(),
      dapp.proxy.getNetworkConfig(),
    ])
      .then(
        ([
          numBoardMembers,
          numProposers,
          quorum,
          // userRole,
          networkStats,
          networkStake,
          networkConfig,
        ]) => {
          console.log({setTotalBoardMembers: numBoardMembers});
          dispatch({
            type: 'setTotalBoardMembers',
            totalBoardMembers: numBoardMembers.returnData[0].asNumber
          });
          dispatch({
            type: 'setTotalProposers',
            totalProposers: numProposers.returnData[0].asNumber
          });
          dispatch({
            type: 'setQuorumSize',
            quorumSize: quorum.returnData[0].asNumber
          });
          // dispatch({
          //   type: 'setUserRole',
          //   userRole: userRole.returnData[0].asNumber
          // });
          dispatch({
            type: 'setAprPercentage',
            aprPercentage: calculateAPR({
              stats: new Stats(networkStats.Epoch),
              networkConfig: new NetworkConfig(
                networkConfig.TopUpFactor,
                networkConfig.TopUpRewardsGradientPoint
              ),
              networkStake: new NetworkStake(
                networkStake.TotalValidators,
                networkStake.ActiveValidators,
                networkStake.QueueSize,
                networkStake.TotalStaked
              ),
              blsKeys: [],
              totalActiveStake: '',
            }),
          });
        }
      )
      .catch(e => {
        console.log('To do ', e);
      });
  }, []);

  return (
    <div className={`layout d-flex flex-column min-vh-100 ${page}`}>
      {page !== 'home' && <Navbar />}
      <main className="container flex-grow-1 d-flex p-3 p-sm-spacer">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
