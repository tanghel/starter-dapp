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
  private dapp: DappState;
  private contract: SmartContract;
  private signerProvider?: IDappProvider;

  constructor(dapp: DappState, contract?: string, signer?: IDappProvider) {
    this.dapp = dapp;
    const address = new Address(contract);
    this.contract = new SmartContract({ address });
    this.signerProvider = signer;
  }

  mutateSign(actionId: number) {
    return this.sendTransaction('0', 'sign', numberToRequestData(actionId));
  }

  mutateUnsign(actionId: number) {
    return this.sendTransaction('0', 'unsign', numberToRequestData(actionId));
  }

  mutatePerformAction(actionId: number) {
    return this.sendTransaction('0', 'performAction', numberToRequestData(actionId));
  }

  mutateDiscardAction(actionId: number) {
    return this.sendTransaction('0', 'discardAction', numberToRequestData(actionId));
  }

  mutateProposeChangeQuorum(quorumSize: number) {
    return this.sendTransaction('0', 'proposeChangeQuorum', numberToRequestData(quorumSize));
  }

  mutateProposeAddProposer(address: Address) {
    return this.sendTransaction('0', 'proposeAddProposer', address.hex());
  }

  mutateProposeAddBoardMember(address: Address) {
    return this.sendTransaction('0', 'proposeAddBoardMember', address.hex());
  }

  mutateProposeRemoveUser(address: Address) {
    return this.sendTransaction('0', 'proposeRemoveUser', address.hex());
  }

  queryAllActions() {
    return this.queryActionArray('getPendingActionFullInfo');
  }

  queryBoardMembersCount() {
    return this.queryNumber('getNumBoardMembers');
  }

  queryProposersCount() {
    return this.queryNumber('getNumProposers');
  }

  queryQuorumCount() {
    return this.queryNumber('getQuorum');
  }

  queryActionLastId() {
    return this.queryNumber('getActionLastIndex');
  }

  queryActionData(actionId: number) {
    return this.query('getActionData', [Argument.fromNumber(actionId)]);
  }

  queryUserRole(userAddress: string) {
    return this.queryNumber('userRole', [Argument.fromHex(userAddress)]);
  }

  queryBoardMemberAddresses() {
    return this.query('getAllBoardMembers');
  }

  queryProposerAddresses() {
    return this.query('getAllProposers');
  }

  queryActionSignerAddresses(actionId: number) {
    return this.query('getActionSigners', [Argument.fromNumber(actionId)]);
  }

  queryActionSignerCount(actionId: number) {
    return this.queryNumber('getActionSignerCount', [Argument.fromNumber(actionId)]);
  }

  queryActionValidSignerCount(actionId: number) {
    return this.queryNumber('getActionValidSignerCount', [Argument.fromNumber(actionId)]);
  }

  queryActionIsQuorumReached(actionId: number) {
    return this.query('quorumReached', [Argument.fromNumber(actionId)]);
  }

  queryActionIsSignedByAddress(userAddress: string, actionId: number) {
    return this.query('signed', [Argument.fromHex(userAddress), Argument.fromNumber(actionId)]);
  }

  private async queryNumber(functionName: string, args: Array<any> = []) {
    let result = await this.query(functionName, args);

    return result.returnData[0].asNumber;
  }

  private async queryActionArray(functionName: string, args: Array<any> = []) {
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

  private async query(functionName: string, args: Array<any> = []) {
    const query = new Query({
      address: this.contract.getAddress(),
      func: new ContractFunction(functionName),
      args: args,
    });

    return await this.dapp.proxy.queryContract(query);
  }

  private async sendTransaction(
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
