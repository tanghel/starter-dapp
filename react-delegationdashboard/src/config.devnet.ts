import { object, string, boolean, InferType } from 'yup';

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
  multisigContract: 'erd1qqqqqqqqqqqqqpgq8sxvjujwsa9865sw94tltgzvjpkyw7averms6qkjj7',
  multisigDeployerContract: 'erd1qqqqqqqqqqqqqpgqrav7nqfuk4hcw7qgaxeatw7nv935wxtdermsx3q26z',
  multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqed8p7ywpv2x4jng7x9cux764gdrgqlfkermsug8u27',
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