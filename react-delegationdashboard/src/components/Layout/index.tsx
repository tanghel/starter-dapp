import { Address } from '@elrondnetwork/erdjs/out';
import { QueryResponse } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import denominate from 'components/Denominate/formatters';
import { denomination, decimals } from 'config';
import { useContext, useDispatch } from 'context';
import { emptyAgencyMetaData } from 'context/state';
import { contractViews } from 'contracts/ContractViews';
import {
  AgencyMetadata,
  ContractOverview,
  NetworkConfig,
  NetworkStake,
  Stats,
} from 'helpers/contractDataDefinitions';
import React from 'react';
import { calculateAPR } from './APRCalculation';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children, page }: { children: React.ReactNode; page: string }) => {
  const dispatch = useDispatch();
  const { dapp, address, multisigContract } = useContext();
  const {
    getNumBoardMembers, getNumProposers, getQuorum, userRole,
    getContractConfig,
    getTotalActiveStake,
    getBlsKeys,
    getNumUsers,
    getMetaData,
  } = contractViews;

  const getContractOverviewType = (value: QueryResponse) => {
    let initialOwnerFunds = denominate({
      decimals,
      denomination,
      input: value.returnData[3].asBigInt.toString(),
      showLastNonZeroDecimal: false,
    });
    return new ContractOverview(
      value.returnData[0].asHex.toString(),
      (value.returnData[1].asNumber / 100).toString(),
      value.returnData[2].asBigInt.toString(),
      initialOwnerFunds,
      value.returnData[4]?.asString,
      value.returnData[5].asBool,
      value.returnData[6].asBool,
      value.returnData[7]?.asString,
      value.returnData[8].asBool,
      value.returnData[9]?.asNumber * 6
    );
  };

  const getAgencyMetaDataType = (value: QueryResponse) => {
    if (value && value.returnData && value.returnData.length === 0) {
      return emptyAgencyMetaData;
    }
    return new AgencyMetadata(
      value.returnData[0]?.asString,
      value.returnData[1]?.asString,
      value.returnData[2]?.asString
    );
  };
  React.useEffect(() => {


    console.log({address: address});

    Promise.all([
      getNumBoardMembers(dapp, multisigContract ?? ''),
      getNumProposers(dapp, multisigContract ?? ''),
      getQuorum(dapp, multisigContract ?? ''),
      // userRole(new Address(address).hex(), dapp, multisigContract ?? ''),
      getMetaData(dapp, delegationContract),
      getNumUsers(dapp, delegationContract),
      getContractConfig(dapp, delegationContract),
      getTotalActiveStake(dapp, delegationContract),
      getBlsKeys(dapp, delegationContract),
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
          metaData,
          numUsers,
          contractOverview,
          {
            returnData: [activeStake],
          },
          { returnData: blsKeys },
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
          dispatch({
            type: 'setNumUsers',
            numUsers: numUsers.returnData[0].asNumber,
          });
          dispatch({
            type: 'setContractOverview',
            contractOverview: getContractOverviewType(contractOverview),
          });
          dispatch({
            type: 'setAgencyMetaData',
            agencyMetaData: getAgencyMetaDataType(metaData),
          });
          dispatch({
            type: 'setTotalActiveStake',
            totalActiveStake: activeStake.asBigInt.toString(),
          });
          dispatch({
            type: 'setNumberOfActiveNodes',
            numberOfActiveNodes: blsKeys.filter(key => key.asString === 'staked').length.toString(),
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
