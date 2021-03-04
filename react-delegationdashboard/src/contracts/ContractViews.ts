import { Address, ContractFunction, Argument } from '@elrondnetwork/erdjs/out';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { auctionContract } from 'config';
import { DappState } from '../context/state';

export const contractViews = {
  getNumBoardMembers: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getNumBoardMembers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getNumProposers: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getNumProposers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getQuorum: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getQuorum'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionLastIndex: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getActionLastIndex'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionData: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getActionData'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  getPendingActionFullInfo: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getPendingActionFullInfo'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  userRole: (userAddress: string, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('userRole'),
      args: [Argument.fromHex(userAddress)],
    });
    return dapp.proxy.queryContract(query);
  },
  getAllBoardMembers: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getAllBoardMembers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getAllProposers: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getAllProposers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionSigners: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getActionSigners'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionSignerCount: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getActionSignerCount'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionValidSignerCount: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getActionValidSignerCount'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  quorumReached: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('quorumReached'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  signed: (userAddress: string, actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('signed'),
      args: [Argument.fromHex(userAddress), Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  getUserActiveStake: (dapp: DappState, address: string, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getUserActiveStake'),
      args: [Argument.fromPubkey(new Address(address))],
    });
    return dapp.proxy.queryContract(query);
  },
  getUserUnDelegatedList: (dapp: DappState, address: string, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getUserUnDelegatedList'),
      args: [Argument.fromPubkey(new Address(address))],
    });
    return dapp.proxy.queryContract(query);
  },
  getClaimableRewards: (dapp: DappState, address: string, delegationContract?: string) => {
    const query = new Query({
      address: new Address('erd1qqqqqqqqqqqqqpgqlh3gnnxcjvr6kecgedcrkc8380ct0vr2erms83ch0v'),
      func: new ContractFunction('getActionData'),
      args: [Argument.fromNumber(1)],
    });
    return dapp.proxy.queryContract(query);
  },
  getTotalActiveStake: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getTotalActiveStake'),
    });
    return dapp.proxy.queryContract(query);
  }, 
  getNumNodes: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getNumNodes'),
    });
    return dapp.proxy.queryContract(query);
  },
  getContractConfig: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getContractConfig'),
    });
    return dapp.proxy.queryContract(query);
  },
  getBlsKeys: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(auctionContract),
      func: new ContractFunction('getBlsKeysStatus'),
      args: [Argument.fromPubkey(new Address(delegationContract))],
    });
    return dapp.proxy.queryContract(query);
  },
};
