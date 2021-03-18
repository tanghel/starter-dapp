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

  getAllActions() {
    return this.queryActionArray('getPendingActionFullInfo');
  }

  getBoardMembersCount() {
    return this.queryNumber('getNumBoardMembers');
  }

  getProposersCount() {
    return this.queryNumber('getNumProposers');
  }

  getQuorumCount() {
    return this.queryNumber('getQuorum');
  }

  getActionLastId() {
    return this.queryNumber('getActionLastIndex');
  }

  getActionData(actionId: number) {
    return this.query('getActionData', [Argument.fromNumber(actionId)]);
  }

  getUserRole(userAddress: string) {
    return this.queryNumber('userRole', [Argument.fromHex(userAddress)]);
  }

  getBoardMemberAddresses() {
    return this.query('getAllBoardMembers');
  }

  getProposerAddresses() {
    return this.query('getAllProposers');
  }

  getActionSignerAddresses(actionId: number) {
    return this.query('getActionSigners', [Argument.fromNumber(actionId)]);
  }

  getActionSignerCount(actionId: number) {
    return this.queryNumber('getActionSignerCount', [Argument.fromNumber(actionId)]);
  }

  getActionValidSignerCount(actionId: number) {
    return this.queryNumber('getActionValidSignerCount', [Argument.fromNumber(actionId)]);
  }

  getActionIsQuorumReached(actionId: number) {
    return this.query('quorumReached', [Argument.fromNumber(actionId)]);
  }

  getActionIsSignedByAddress(userAddress: string, actionId: number) {
    return this.query('signed', [Argument.fromHex(userAddress), Argument.fromNumber(actionId)]);
  }

  async queryNumber(functionName: string, args: Array<any> = []) {
    let result = await this.query(functionName, args);

    return result.returnData[0].asNumber;
  }

  async queryActionArray(functionName: string, args: Array<any> = []) {
    let result = await this.query(functionName, args);

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

  async query(functionName: string, args: Array<any> = []) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction(functionName),
      args: args,
    });

    return await this.dapp.proxy.queryContract(query);
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
