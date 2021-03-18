import { Address, ContractFunction, Argument } from '@elrondnetwork/erdjs/out';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { parseActionFullDetails } from '../helpers/converters';
import { DappState } from '../context/state';

export const contractViews = {
  getAllActions: async (dapp: DappState, address: string) => {
    let result = await contractViews.getPendingActionData(dapp, address);

    let actions = [];
    for (let returnData of result.returnData) {
        let buffer = returnData.asBuffer;
        
        let action = parseActionFullDetails(buffer);
        if (action !== null) {
          actions.push(action);
        }
    }

    return actions;
  },

  getBoardMembersCount: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getNumBoardMembers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getProposersCount: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getNumProposers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getQuorumCount: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getQuorum'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionLastId: (dapp: DappState, address: string) => {
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
  getPendingActionData: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getPendingActionFullInfo'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getUserRole: (userAddress: string, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('userRole'),
      args: [Argument.fromHex(userAddress)],
    });
    return dapp.proxy.queryContract(query);
  },
  getBoardMemberAddresses: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getAllBoardMembers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getProposerAddresses: (dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('getAllProposers'),
      args: [],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionSignerAddresses: (actionId: number, dapp: DappState, address: string) => {
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
  getActionIsQuorumReached: (actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('quorumReached'),
      args: [Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
  getActionIsSignedByAddress: (userAddress: string, actionId: number, dapp: DappState, address: string) => {
    const query = new Query({
      address: new Address(address),
      func: new ContractFunction('signed'),
      args: [Argument.fromHex(userAddress), Argument.fromNumber(actionId)],
    });
    return dapp.proxy.queryContract(query);
  },
};
