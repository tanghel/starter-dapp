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
import { parseAction, parseActionDetailed } from 'helpers/converters';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import { DappState } from '../context/state';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { MultisigIssueToken } from 'types/MultisigIssueToken';
import { settings } from 'node:cluster';

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
    return this.sendTransaction('0', 'sign', Argument.fromNumber(actionId).valueOf());
  }

  mutateUnsign(actionId: number) {
    return this.sendTransaction('0', 'unsign', Argument.fromNumber(actionId).valueOf());
  }

  mutatePerformAction(actionId: number) {
    return this.sendTransaction('0', 'performAction', Argument.fromNumber(actionId).valueOf());
  }

  mutateDiscardAction(actionId: number) {
    return this.sendTransaction('0', 'discardAction', Argument.fromNumber(actionId).valueOf());
  }

  mutateProposeChangeQuorum(quorumSize: number) {
    return this.sendTransaction('0', 'proposeChangeQuorum', Argument.fromNumber(quorumSize).valueOf());
  }

  mutateProposeAddProposer(address: Address) {
    return this.sendTransaction('0', 'proposeAddProposer', Argument.fromHex(address.hex()).valueOf());
  }

  mutateProposeAddBoardMember(address: Address) {
    return this.sendTransaction('0', 'proposeAddBoardMember', Argument.fromHex(address.hex()).valueOf());
  }

  mutateProposeRemoveUser(address: Address) {
    return this.sendTransaction('0', 'proposeRemoveUser', Argument.fromHex(address.hex()).valueOf());
  }

  mutateSendEgld(address: Address, amount: BigUIntValue, data: string) {
    let addressEncoded = Argument.fromHex(address.hex()).valueOf();
    let amountEncoded = Argument.fromBigInt(amount.valueOf()).valueOf();
    let dataEncoded = Argument.fromBytes(Buffer.from(data)).valueOf();

    return this.sendTransaction('0', 'proposeSendEgld', `${addressEncoded}@${amountEncoded}@${dataEncoded}`);
  }

  mutateIssueToken(proposal: MultisigIssueToken) {
    let esdtAddress = new Address('erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u');
    let esdtAmount = new BigUIntValue(Balance.eGLD(5).valueOf());

    console.log({decimals: proposal.decimals});
    console.log({mintAmount: proposal.amount * Math.pow(10, proposal.decimals)});

    let name = Argument.fromUTF8(proposal.name).valueOf();
    let identifier = Argument.fromUTF8(proposal.identifier).valueOf();
    let mintAmount = Argument.fromNumber(proposal.amount * Math.pow(10, proposal.decimals)).valueOf();
    let decimals = Argument.fromNumber(proposal.decimals).valueOf();

    let extras = '';
    if (proposal.canFreeze) {
      extras += `@${Argument.fromUTF8('canFreeze').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canWipe) {
      extras += `@${Argument.fromUTF8('canWipe').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canPause) {
      extras += `@${Argument.fromUTF8('canPause').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canMint) {
      extras += `@${Argument.fromUTF8('canMint').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canBurn) {
      extras += `@${Argument.fromUTF8('canBurn').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canChangeOwner) {
      extras += `@${Argument.fromUTF8('canChangeOwner').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    if (proposal.canUpgrade) {
      extras += `@${Argument.fromUTF8('canUpgrade').valueOf()}@${Argument.fromUTF8('true').valueOf()}`;
    }

    let data = `issue@${name}@${identifier}@${mintAmount}@${decimals}${extras}`;
    this.mutateSendEgld(esdtAddress, esdtAmount, data);
  }

  queryAllActions(): Promise<MultisigActionDetailed[]> {
    return this.queryActionContainerArray('getPendingActionFullInfo');
  }

  queryBoardMembersCount(): Promise<number> {
    return this.queryNumber('getNumBoardMembers');
  }

  queryProposersCount(): Promise<number> {
    return this.queryNumber('getNumProposers');
  }

  queryQuorumCount(): Promise<number> {
    return this.queryNumber('getQuorum');
  }

  queryActionLastId(): Promise<number> {
    return this.queryNumber('getActionLastIndex');
  }

  queryActionData(actionId: number): Promise<MultisigAction | null> {
    return this.queryActionContainer('getActionData', [Argument.fromNumber(actionId)]);
  }

  queryUserRole(userAddress: string): Promise<number> {
    return this.queryNumber('userRole', [Argument.fromHex(userAddress)]);
  }

  queryBoardMemberAddresses(): Promise<Address[]> {
    return this.queryAddressArray('getAllBoardMembers');
  }

  queryProposerAddresses(): Promise<Address[]> {
    return this.queryAddressArray('getAllProposers');
  }

  queryActionSignerAddresses(actionId: number): Promise<Address[]> {
    return this.queryAddressArray('getActionSigners', [Argument.fromNumber(actionId)]);
  }

  queryActionSignerCount(actionId: number): Promise<number> {
    return this.queryNumber('getActionSignerCount', [Argument.fromNumber(actionId)]);
  }

  queryActionValidSignerCount(actionId: number): Promise<number> {
    return this.queryNumber('getActionValidSignerCount', [Argument.fromNumber(actionId)]);
  }

  queryActionIsQuorumReached(actionId: number): Promise<boolean> {
    return this.queryBoolean('quorumReached', [Argument.fromNumber(actionId)]);
  }

  queryActionIsSignedByAddress(userAddress: Address, actionId: number): Promise<boolean> {
    return this.queryBoolean('signed', [Argument.fromHex(userAddress.hex()), Argument.fromNumber(actionId)]);
  }

  private async queryNumber(functionName: string, args: Array<any> = []): Promise<number> {
    let result = await this.query(functionName, args);

    return result.returnData[0].asNumber;
  }

  private async queryBoolean(functionName: string, args: Array<any> = []): Promise<boolean> {
    let result = await this.query(functionName, args);

    return result.returnData[0].asBool;
  }

  private async queryActionContainer(functionName: string, args: Array<any> = []): Promise<MultisigAction | null> {
    let result = await this.query(functionName, args);

    if (result.returnData.length === 0) {
      return null;
    }

    let [action, _] = parseAction(result.returnData[0].asBuffer);
    return action;
  }

  private async queryActionContainerArray(functionName: string, args: Array<any> = []): Promise<MultisigActionDetailed[]> {
    let result = await this.query(functionName, args);

    let actions = [];
    for (let returnData of result.returnData) {
        let buffer = returnData.asBuffer;
        
        let action = parseActionDetailed(buffer);
        if (action !== null) {
          actions.push(action);
        }
    }

    return actions;
  }

  private async queryAddressArray(functionName: string, args: Array<any> = []): Promise<Address[]> {
    let result = await this.query(functionName, args);

    return result.returnData.map(x => new Address(x.asHex));
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
