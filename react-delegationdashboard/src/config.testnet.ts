import { object, string, boolean, InferType } from 'yup';
import { ContractType } from './helpers/types';

export const decimals: number = 2;
export const denomination: number = 18;

export const network: NetworkType = {
  id: 'testnet',
  name: 'Testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.elrond.com/dapp/init',
  apiAddress: 'https://devnet-api.elrond.com',
  gatewayAddress: 'https://devnet-gateway.elrond.com',
  explorerAddress: 'http://devnet-explorer.elrond.com/',
  multisigContract: 'erd1qqqqqqqqqqqqqpgqx9hnhtv6393ypkdrkk0k0dpu6d4m9x3ferms8lmk3p'
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

export const contractData: ContractType[] = [
  {
    name: 'proposeAddBoardMember',
    gasLimit: 120000000,
    data: 'proposeAddBoardMember@',
  },
  {
    name: 'proposeAddProposer',
    gasLimit: 120000000,
    data: 'proposeAddProposer@',
  },
  {
    name: 'proposeRemoveUser',
    gasLimit: 120000000,
    data: 'proposeRemoveUser@',
  },
  {
    name: 'proposeChangeQuorum',
    gasLimit: 120000000,
    data: 'proposeChangeQuorum@',
  },
  {
    name: 'proposeSendEgld',
    gasLimit: 120000000,
    data: 'proposeSendEgld@',
  },
  {
    name: 'proposeSCDeploy',
    gasLimit: 120000000,
    data: 'proposeSCDeploy@',
  },
  {
    name: 'proposeSCCall',
    gasLimit: 120000000,
    data: 'proposeSCCall@',
  },
  {
    name: 'sign',
    gasLimit: 120000000,
    data: 'sign@',
  },
  {
    name: 'unsign',
    gasLimit: 120000000,
    data: 'unsign@',
  },
  {
    name: 'performAction',
    gasLimit: 120000000,
    data: 'performAction@',
  },
  {
    name: 'discardAction',
    gasLimit: 120000000,
    data: 'discardAction@',
  },
];
