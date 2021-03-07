import { IDappProvider, ProxyProvider, ApiProvider, WalletProvider } from '@elrondnetwork/erdjs';
import { AgencyMetadata, ContractOverview } from 'helpers/contractDataDefinitions';
import { denomination, decimals, network, NetworkType } from '../config';
import { getItem } from '../storage/session';

export const defaultNetwork: NetworkType = {
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  egldLabel: '',
  walletAddress: '',
  apiAddress: '',
  gatewayAddress: '',
  explorerAddress: '',
  delegationContract: '',
  multisigContract: '',
};

export interface DappState {
  provider: IDappProvider;
  proxy: ProxyProvider;
  apiProvider: ApiProvider;
}

export interface StateType {
  dapp: DappState;
  loading: boolean;
  error: string;
  loggedIn: boolean;
  address: string;
  egldLabel: string;
  denomination: number;
  decimals: number;
  account: AccountType;
  explorerAddress: string;
  delegationContract?: string;
  multisigContract?: string;
  totalActiveStake: string;
  numberOfActiveNodes: string;
  numUsers: number;
  aprPercentage: string;
  contractOverview: ContractOverview;
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  userRole: number;
  agencyMetaData: AgencyMetadata;
}
export const emptyAccount: AccountType = {
  balance: '...',
  nonce: 0,
};

export const emptyAgencyMetaData: AgencyMetadata = {
  name: '',
  website: '',
  keybase: '',
};

export const emptyContractOverview: ContractOverview = {
  ownerAddress: '',
  serviceFee: '',
  maxDelegationCap: '',
  initialOwnerFunds: '',
  automaticActivation: 'false',
  withDelegationCap: false,
  changeableServiceFee: false,
  reDelegationCap: 'false',
  createdNounce: false,
  unBondPeriod: 0,
};

export const initialState = () => {
  const sessionNetwork = network || defaultNetwork;
  return {
    denomination: denomination,
    decimals: decimals,
    dapp: {
      provider: new WalletProvider(sessionNetwork.walletAddress),
      proxy: new ProxyProvider(
        sessionNetwork.gatewayAddress !== undefined
          ? sessionNetwork?.gatewayAddress
          : 'https://gateway.elrond.com/',
        4000
      ),
      apiProvider: new ApiProvider(
        sessionNetwork.apiAddress !== undefined
          ? sessionNetwork?.apiAddress
          : 'https://api.elrond.com/',
        4000
      ),
    },
    loading: false,
    error: '',
    loggedIn: !!getItem('logged_in'),
    address: getItem('address'),
    account: emptyAccount,
    egldLabel: sessionNetwork?.egldLabel,
    explorerAddress: sessionNetwork.explorerAddress || 'https://explorer.elrond.com',
    delegationContract: sessionNetwork.delegationContract,
    multisigContract: sessionNetwork.multisigContract,
    contractOverview: emptyContractOverview,
    agencyMetaData: emptyAgencyMetaData,
    numberOfActiveNodes: '...',
    numUsers: 0,
    totalActiveStake: '...',
    aprPercentage: '...',
    totalBoardMembers: 0,
    totalProposers: 0,
    quorumSize: 0,
    userRole: 0,
  };
};

export interface AccountType {
  balance: string;
  nonce: number;
}
