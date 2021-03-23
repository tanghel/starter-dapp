import { object, string, boolean, InferType } from 'yup';
import { ContractType } from './helpers/types';

export const decimals: number = 2;
export const denomination: number = 18;

export const networks: NetworkType[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.elrond.com/dapp/init',
    apiAddress: 'https://api.elrond.com',
    gatewayAddress: 'https://gateway.elrond.com',
    explorerAddress: 'http://explorer.elrond.com/',
    multisigContract: 'erd1qqqqqqqqqqqqqpgq8sxvjujwsa9865sw94tltgzvjpkyw7averms6qkjj7',
    multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqgjkfhle2387cehy3hwan3hwx5pvs2kywerms9tpuhp',
  },
];

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
  multisigManagerContract: string(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networks.forEach(network => {
  networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});