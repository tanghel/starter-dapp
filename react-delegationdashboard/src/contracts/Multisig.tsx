import {
  ProxyProvider,
  ContractFunction,
  Transaction,
  TransactionPayload,
  Balance,
  GasLimit,
  IDappProvider,
  WalletProvider,
  HWProvider,
  Address,
  SmartContract,
  Argument,
} from '@elrondnetwork/erdjs';
import { setItem } from '../storage/session';
import { contractData } from '../config';
import numberToRequestData, { parseActionFullDetails } from 'helpers/converters';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { DappState } from '../context/state';

export default class Multisig {
  dapp: DappState;
  contract: SmartContract;
  signerProvider?: IDappProvider;

  constructor(dapp: DappState, contract?: string, signer?: IDappProvider) {
    this.dapp = dapp;
    const address = new Address(contract);
    this.contract = new SmartContract({ address });
    this.signerProvider = signer;
  }

  sign(actionId: number) {
    return this.sendTransaction('0', 'sign', numberToRequestData(actionId));
  }

  unsign(actionId: number) {
    return this.sendTransaction('0', 'unsign', numberToRequestData(actionId));
  }

  performAction(actionId: number) {
    return this.sendTransaction('0', 'performAction', numberToRequestData(actionId));
  }

  discardAction(actionId: number) {
    return this.sendTransaction('0', 'discardAction', numberToRequestData(actionId));
  }

  proposeChangeQuorum(quorumSize: number) {
    return this.sendTransaction('0', 'proposeChangeQuorum', numberToRequestData(quorumSize));
  }

  async getAllActions() {
    let result = await this.getPendingActionData();

    let actions = [];
    for (let returnData of result.returnData) {
        let buffer = returnData.asBuffer;
        
        let action = parseActionFullDetails(buffer);
        if (action !== null) {
          actions.push(action);
        }
    }

    return actions;
  }

  getBoardMembersCount() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getNumBoardMembers'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getProposersCount() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getNumProposers'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getQuorumCount() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getQuorum'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionLastId() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getActionLastIndex'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionData(actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getActionData'),
      args: [Argument.fromNumber(actionId)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getPendingActionData() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getPendingActionFullInfo'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getUserRole(userAddress: string) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('userRole'),
      args: [Argument.fromHex(userAddress)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getBoardMemberAddresses() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getAllBoardMembers'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getProposerAddresses() {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getAllProposers'),
      args: [],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionSignerAddresses(actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getActionSigners'),
      args: [Argument.fromNumber(actionId)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionSignerCount(actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getActionSignerCount'),
      args: [Argument.fromNumber(actionId)],
    });
    return this.dapp.proxy.queryContract(query);
  }

  getActionValidSignerCount(actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('getActionValidSignerCount'),
      args: [Argument.fromNumber(actionId)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionIsQuorumReached(actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('quorumReached'),
      args: [Argument.fromNumber(actionId)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  getActionIsSignedByAddress(userAddress: string, actionId: number) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction('signed'),
      args: [Argument.fromHex(userAddress), Argument.fromNumber(actionId)],
    });

    return this.dapp.proxy.queryContract(query);
  }

  async sendTransaction(
    value: string,
    transactionType: string,
    args: string = ''
  ): Promise<boolean> {
    if (!this.signerProvider) {
      throw new Error(
        'You need a singer to send a transaction, use either WalletProvider or LedgerProvider'
      );
    }

    switch (this.signerProvider.constructor) {
      case WalletProvider:
        // Can use something like this to handle callback redirect
        setItem('transaction_identifier', true, 120);
        return this.sendTransactionBasedOnType(value, transactionType, args);
      case HWProvider:
        return this.sendTransactionBasedOnType(value, transactionType, args);
      default:
        console.warn('invalid signerProvider');
    }

    return true;
  }

  private async sendTransactionBasedOnType(
    value: string,
    transactionType: string,
    args: string = ''
  ): Promise<boolean> {
    let contract = contractData.find(d => d.name === transactionType);
    if (!contract) {
      throw new Error('The contract for this action in not defined');
    } else {
      let funcName = contract.data;
      if (args !== '') {
        funcName = `${contract.data}${args}`;
      }
      const func = new ContractFunction(funcName);
      let payload = TransactionPayload.contractCall()
        .setFunction(func)
        .build();
      let transaction = new Transaction({
        receiver: this.contract.getAddress(),
        value: Balance.eGLD(value),
        gasLimit: new GasLimit(contract.gasLimit),
        data: payload,
      });

      // @ts-ignore
      await this.signerProvider.sendTransaction(transaction);

      return true;
    }
  }
}
