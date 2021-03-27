import { object, string, boolean, InferType } from 'yup';

export const decimals: number = 2;
export const denomination: number = 18;

export const network: NetworkType = {
  id: 'testnet',
  name: 'Testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://testnet-wallet.elrond.com/dapp/init',
  apiAddress: 'https://testnet-api.elrond.com',
  gatewayAddress: 'https://testnet-gateway.elrond.com',
  explorerAddress: 'http://testnet-explorer.elrond.com/',
  multisigContract: '',
  multisigDeployerContract: 'erd1qqqqqqqqqqqqqpgqexj86qkaey54p768xxktxjhf4v7g5svherms3jq45t',
  multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqy6uk930uursyuxkrt8pzrmeqaf60ttjuermsyjskp9',
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
  multisigContract: string(),
  multisigDeployerContract: string(),
  multisigManagerContract: string(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});