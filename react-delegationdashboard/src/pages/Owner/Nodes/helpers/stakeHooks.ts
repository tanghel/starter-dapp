import { DappState } from 'context/state';
import { Delegation } from 'contracts';
import numberToRequestData from 'helpers/converters';

export const nodeTransactions = {
  sign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'sign', numberToRequestData(actionId));
  },
  unsign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'unsign', numberToRequestData(actionId));
  },
  performAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'performAction', numberToRequestData(actionId));
  },
  discardAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'discardAction', numberToRequestData(actionId));
  },
  proposeChangeQuorum: (quorumSize: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'proposeChangeQuorum', numberToRequestData(quorumSize));
  }
};
