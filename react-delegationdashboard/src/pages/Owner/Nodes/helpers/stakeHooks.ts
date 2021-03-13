import { DappState } from 'context/state';
import { Delegation } from 'contracts';

export const nodeTransactions = {
  unStake: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('0', 'unStakeNodes', blsKey);
  },
  reStake: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('0', 'reStakeUnStakedNodes', blsKey);
  },
  unJail: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('2.5', 'unJailNodes', blsKey);
  },
  unBond: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('0', 'unBondNodes', blsKey);
  },
  stake: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('0', 'stakeNodes', `${blsKey}`);
  },
  remove: (blsKey: string, dapp: DappState, delegationContract?: string) => {
    const delegation = new Delegation(dapp.proxy, delegationContract, dapp.provider);
    return delegation.sendTransaction('0', 'removeNodes', `${blsKey}`);
  },
  sign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'sign', `0${actionId}`);
  },
  unsign: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'unsign', `0${actionId}`);
  },
  performAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'performAction', `0${actionId}`);
  },
  discardAction: (actionId: number, dapp: DappState, multisigContract?: string) => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    return delegation.sendTransaction('0', 'discardAction', `0${actionId}`);
  },
};
