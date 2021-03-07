import { object, string, boolean, InferType } from 'yup';
import { DelegationContractType } from './helpers/types';

export const decimals: number = 2;
export const denomination: number = 18;
export const genesisTokenSuply: number = 20000000;
export const yearSettings = [
  { year: 1, maximumInflation: 0.1084513 },
  { year: 2, maximumInflation: 0.09703538 },
  { year: 3, maximumInflation: 0.08561945 },
  { year: 4, maximumInflation: 0.07420352 },
  { year: 5, maximumInflation: 0.0627876 },
  { year: 6, maximumInflation: 0.05137167 },
  { year: 7, maximumInflation: 0.03995574 },
  { year: 8, maximumInflation: 0.02853982 },
  { year: 9, maximumInflation: 0.01712389 },
  { year: 10, maximumInflation: 0.00570796 },
  { year: 11, maximumInflation: 0.0 },
];
export const auctionContract: string =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l';
export const stakingContract: string =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllls0lczs7';

export const network: NetworkType = {
  id: 'testnet',
  name: 'Testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.elrond.com/dapp/init',
  apiAddress: 'https://devnet-api.elrond.com',
  gatewayAddress: 'https://devnet-gateway.elrond.com',
  explorerAddress: 'http://devnet-explorer.elrond.com/',
  delegationContract: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq98lllls54qqg7',
  multisigContract: 'erd1qqqqqqqqqqqqqpgqlh3gnnxcjvr6kecgedcrkc8380ct0vr2erms83ch0v'
};

const networkSchema = object({
  id: string()
    .defined()
    .required(),
  egldLabel: string()
    .defined()
    .required(),
  name: string()
    .defined()
    .required(),
  delegationContract: string(),
  walletAddress: string(),
  apiAddress: string(),
  gatewayAddress: string(),
  explorerAddress: string(),
  multisigContract: string()
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});

export const delegationContractData: DelegationContractType[] = [
  {
    name: 'createNewDelegationContract',
    gasLimit: 6000000,
    data: 'createNewDelegationContract@',
  },
  {
    name: 'setAutomaticActivation',
    gasLimit: 6000000,
    data: 'setAutomaticActivation@',
  },
  {
    name: 'setMetaData',
    gasLimit: 6000000,
    data: 'setMetaData@',
  },
  {
    name: 'setReDelegateCapActivation',
    gasLimit: 6000000,
    data: 'setCheckCapOnReDelegateRewards@',
  },
  {
    name: 'changeServiceFee',
    gasLimit: 6000000,
    data: 'changeServiceFee@',
  },
  {
    name: 'modifyTotalDelegationCap',
    gasLimit: 6000000,
    data: 'modifyTotalDelegationCap@',
  },
  {
    name: 'addNodes',
    gasLimit: 12000000,
    data: 'addNodes',
  },
  {
    name: 'removeNodes',
    gasLimit: 12000000,
    data: 'removeNodes@',
  },
  {
    name: 'stakeNodes',
    gasLimit: 12000000,
    data: 'stakeNodes@',
  },
  {
    name: 'reStakeUnStakedNodes',
    gasLimit: 120000000,
    data: 'reStakeUnStakedNodes@',
  },
  {
    name: 'unStakeNodes',
    gasLimit: 12000000,
    data: 'unStakeNodes@',
  },
  {
    name: 'unBondNodes',
    gasLimit: 12000000,
    data: 'unBondNodes@',
  },
  {
    name: 'unJailNodes',
    gasLimit: 12000000,
    data: 'unJailNodes@',
  },
  {
    name: 'delegate',
    gasLimit: 12000000,
    data: 'delegate',
  },
  {
    name: 'unDelegate',
    gasLimit: 12000000,
    data: 'unDelegate@',
  },
  {
    name: 'withdraw',
    gasLimit: 12000000,
    data: 'withdraw',
  },
  {
    name: 'claimRewards',
    gasLimit: 6000000,
    data: 'claimRewards',
  },
  {
    name: 'reDelegateRewards',
    gasLimit: 12000000,
    data: 'reDelegateRewards',
  },
  {
    name: 'proposeAddBoardMember',
    gasLimit: 12000000,
    data: 'proposeAddBoardMember@',
  },
  {
    name: 'proposeAddProposer',
    gasLimit: 12000000,
    data: 'proposeAddProposer@',
  },
  {
    name: 'proposeRemoveUser',
    gasLimit: 12000000,
    data: 'proposeRemoveUser@',
  },
  {
    name: 'proposeChangeQuorum',
    gasLimit: 12000000,
    data: 'proposeChangeQuorum@',
  },
  {
    name: 'proposeSendEgld',
    gasLimit: 12000000,
    data: 'proposeSendEgld@',
  },
  {
    name: 'proposeSCDeploy',
    gasLimit: 12000000,
    data: 'proposeSCDeploy@',
  },
  {
    name: 'proposeSCCall',
    gasLimit: 12000000,
    data: 'proposeSCCall@',
  },
  {
    name: 'sign',
    gasLimit: 12000000,
    data: 'sign@',
  },
  {
    name: 'unsign',
    gasLimit: 12000000,
    data: 'unsign@',
  },
  {
    name: 'performAction',
    gasLimit: 12000000,
    data: 'performAction@',
  },
  {
    name: 'discardAction',
    gasLimit: 12000000,
    data: 'discardAction@',
  },
];
