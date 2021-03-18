import { IDappProvider, ProxyProvider, ApiProvider, WalletProvider, Address } from '@elrondnetwork/erdjs';
import { AgencyMetadata, ContractOverview } from 'helpers/contractDataDefinitions';
import { denomination, decimals, network, NetworkType } from '../config';
import { getItem } from '../storage/session';

export enum MultisigActionType {
  Nothing = 0,
  AddBoardMember = 1,
  AddProposer = 2,
  RemoveUser = 3,
  ChangeQuorum = 4,
  SendEgld = 5,
  SCDeploy = 6,
  SCCall = 7
}

export abstract class MultisigActionContainer {
  actionId: number = 0;
  signers: Address[] = [];

  abstract title(): string;
  abstract description(): string;
}

export class MultisigAddBoardMember extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }

  title() {
    return 'Add board member';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigAddProposer extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }

  title() {
    return 'Add proposer';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigRemoveUser extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }

  title() {
    return 'Remove user';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigChangeQuorum extends MultisigActionContainer {
  newSize: number;

  constructor(newSize: number) { 
      super();
      this.newSize = newSize;
  }

  title() {
    return 'Change quorum';
  }

  description() {
    return this.newSize.toString();
  }
}

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
  allActions: MultisigActionContainer[];
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
    agencyMetadata: emptyAgencyMetaData,
    allActions: [], 
  };
};

export interface AccountType {
  balance: string;
  nonce: number;
}
