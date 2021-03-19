import { IDappProvider, ProxyProvider, ApiProvider, WalletProvider, Address } from '@elrondnetwork/erdjs';
import { ContractOverview } from 'helpers/contractDataDefinitions';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
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
  multisigContract?: string;
  contractOverview: ContractOverview;
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  userRole: number;
  allActions: MultisigActionDetailed[];
}
export const emptyAccount: AccountType = {
  balance: '...',
  nonce: 0,
};

export const emptyContractOverview: ContractOverview = {
  ownerAddress: ''
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
    multisigContract: sessionNetwork.multisigContract,
    contractOverview: emptyContractOverview,
    totalBoardMembers: 0,
    totalProposers: 0,
    quorumSize: 0,
    userRole: 0,
    allActions: [], 
  };
};

export interface AccountType {
  balance: string;
  nonce: number;
}
