import { IDappProvider, ProxyProvider, ApiProvider, WalletProvider, Address } from '@elrondnetwork/erdjs';
import { ContractOverview } from 'helpers/contractDataDefinitions';
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

export abstract class MultisigAction {
  type: MultisigActionType = MultisigActionType.Nothing;

  constructor(type: MultisigActionType) {
    this.type = type;
  }

  abstract title(): string;
  abstract description(): string;
}

export class MultisigActionDetailed {
  actionId: number;
  signers: Address[];
  action: MultisigAction;

  constructor(action: MultisigAction, actionId: number, signers: Address[]) {
    this.action = action;
    this.actionId = actionId;
    this.signers = signers;
  }

  title(): string {
    return this.action.title();
  }

  description(): string {
    return this.action.description();
  }
}

export class MultisigAddBoardMember extends MultisigAction {
  address: Address;

  constructor(type: MultisigActionType, address: Address) {
      super(type);
      this.address = address;
  }

  title() {
    return 'Add board member';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigAddProposerDetailed extends MultisigAction {
  address: Address;

  constructor(type: MultisigActionType, address: Address) {
      super(type);
      this.address = address;
  }

  title() {
    return 'Add proposer';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigRemoveUserDetailed extends MultisigAction {
  address: Address;

  constructor(type: MultisigActionType, address: Address) {
      super(type);
      this.address = address;
  }

  title() {
    return 'Remove user';
  }

  description() {
    return this.address.bech32();
  }
}

export class MultisigChangeQuorumDetailed extends MultisigAction {
  newSize: number;

  constructor(type: MultisigActionType, newSize: number) { 
      super(type);
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
