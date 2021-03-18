import { DappState } from 'context/state';
import { Multisig } from 'contracts';
import numberToRequestData from 'helpers/converters';

export const nodeTransactions = {
  sign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    return multisig.sendTransaction('0', 'sign', numberToRequestData(actionId));
  },
  unsign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    return multisig.sendTransaction('0', 'unsign', numberToRequestData(actionId));
  },
  performAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    return multisig.sendTransaction('0', 'performAction', numberToRequestData(actionId));
  },
  discardAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    return multisig.sendTransaction('0', 'discardAction', numberToRequestData(actionId));
  },
  proposeChangeQuorum: (quorumSize: number, dapp: DappState, multisigContract?: string) => {
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    return multisig.sendTransaction('0', 'proposeChangeQuorum', numberToRequestData(quorumSize));
  }
};
