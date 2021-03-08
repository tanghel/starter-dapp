import { Address, ContractFunction, Argument } from '@elrondnetwork/erdjs/out';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { auctionContract } from 'config';
import { DappState } from '../context/state';



enum MultisigActionType {
  Nothing = 0,
  AddBoardMember = 1,
  AddProposer = 2,
  RemoveUser = 3,
  ChangeQuorum = 4,
  SendEgld = 5,
  SCDeploy = 6,
  SCCall = 7
}

class MultisigActionContainer {
  actionId: number = 0;
  signers: Address[] = [];
}

class MultisigAddBoardMember extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }
}

class MultisigAddProposer extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }
}

class MultisigRemoveUser extends MultisigActionContainer {
  address: Address;

  constructor(address: Address) {
      super();
      this.address = address;
  }
}

class MultisigChangeQuorum extends MultisigActionContainer {
  newSize: number;

  constructor(newSize: number) {
      super();
      this.newSize = newSize;
  }
}

export const contractViews = {
  getAllActions: async (dapp: DappState, address: string) => {
    let result = await contractViews.getPendingActionFullInfo(dapp, address);

    let actions = [];
    for (let returnData of result.returnData) {
        let buffer = returnData.asBuffer;
        
        actions.push(contractViews.parseActionFullDetails(buffer));
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
  getNumUsers: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getNumUsers'),
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
  getMetaData: (dapp: DappState, delegationContract?: string) => {
    const query = new Query({
      address: new Address(delegationContract),
      func: new ContractFunction('getMetaData'),
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
