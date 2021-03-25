import { object, string, boolean, InferType } from 'yup';
import { ContractType } from './helpers/types';

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
  multisigContract: 'erd1qqqqqqqqqqqqqpgq8sxvjujwsa9865sw94tltgzvjpkyw7averms6qkjj7',
  multisigDeployerContract: 'erd1qqqqqqqqqqqqqpgqh7hl7t5cy0g4td0mv8hp950qtumnagamermsx0aep5',
  multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqh7hl7t5cy0g4td0mv8hp950qtumnagamermsx0aep5',
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