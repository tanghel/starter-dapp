import { Address, ContractFunction, Argument } from '@elrondnetwork/erdjs/out';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { auctionContract } from 'config';
import { DappState, MultisigActionContainer, MultisigActionType, MultisigAddBoardMember, MultisigAddProposer, MultisigChangeQuorum, MultisigRemoveUser } from '../context/state';

export const contractViews = {
  getAllActions: async (dapp: DappState, address: string) => {
    let result = await contractViews.getPendingActionFullInfo(dapp, address);

    let actions = [];
    for (let returnData of result.returnData) {
        let buffer = returnData.asBuffer;
        
        let action = contractViews.parseActionFullDetails(buffer);
        if (action !== null) {
          actions.push(action);
        }
    }

    return actions;
  },

  parseActionFullDetails: (buffer: Buffer) => {
    let actionId = contractViews.getIntValueFromBytes(buffer.slice(0, 4));
    let actionTypeByte = buffer.slice(4, 5)[0];

    let action: MultisigActionContainer;
    let remainingBytes = buffer.slice(5);

    switch (actionTypeByte) {
      case MultisigActionType.AddBoardMember:
          action = new MultisigAddBoardMember(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.AddProposer:
          action = new MultisigAddProposer(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.RemoveUser:
          action = new MultisigRemoveUser(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.ChangeQuorum:
          action = new MultisigChangeQuorum(contractViews.getIntValueFromBytes(remainingBytes.slice(0, 4)));
          remainingBytes = remainingBytes.slice(4);
          break;
      default:
          return null;
    }

    let signerCount = contractViews.getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);
    
    let signers = [];
    for (let i = 0; i < signerCount; i++) {
        let addressBytes = remainingBytes.slice(0, 32);
        let address = new Address(addressBytes);
        remainingBytes = remainingBytes.slice(32);

        signers.push(address);
    }

    action.actionId = actionId;
    action.signers = signers;

    return action;
  },

  getIntValueFromBytes: (buffer: Buffer) => {
    return ((buffer[buffer.length - 1]) | 
    (buffer[buffer.length - 2] << 8) | 
    (buffer[buffer.length - 3] << 16) | 
    (buffer[buffer.length - 4] << 24));
  },

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
};
