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
} from '@elrondnetwork/erdjs';
import { setItem } from '../storage/session';
import { contractData } from '../config';

export default class Multisig {
  contract: SmartContract;
  proxyProvider: ProxyProvider;
  signerProvider?: IDappProvider;

  constructor(provider: ProxyProvider, delegationContract?: string, signer?: IDappProvider) {
    const address = new Address(delegationContract);
    this.contract = new SmartContract({ address });
    this.proxyProvider = provider;
    this.signerProvider = signer;
  }

  async sendTransaction(
    value: string,
    transcationType: string,
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
        return this.sendTransactionBasedOnType(value, transcationType, args);
      case HWProvider:
        return this.sendTransactionBasedOnType(value, transcationType, args);
      default:
        console.warn('invalid signerProvider');
    }

    return true;
  }

  private async sendTransactionBasedOnType(
    value: string,
    transcationType: string,
    args: string = ''
  ): Promise<boolean> {
    let contract = contractData.find(d => d.name === transcationType);
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
