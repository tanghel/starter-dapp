import {
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
import { multisigContractCode } from 'config';
import { useContext } from 'context';

import { DappState } from '../context/state';

export class SmartContractDeploy {

  private address: Address;
  private contract: SmartContract;
  private signerProvider?: IDappProvider;
  private standardGasLimit = 120000000;

  constructor(dapp: DappState, contract: string, signer: IDappProvider, address: Address) {
    this.address = address;
    this.contract = new SmartContract({ address: new Address(contract) });
    this.signerProvider = signer;
  }

  public async deploy() {
    this.sendTransaction(0, multisigContractCode, Argument.fromNumber(1280), Argument.fromNumber(256), Argument.fromNumber(1), Argument.fromPubkey(this.address));
  }

  private async sendTransaction(
    value: number,
    functionName: string,
    ...args: Argument[]
  ): Promise<boolean> {
    if (!this.signerProvider) {
      throw new Error(
        'You need a singer to send a transaction, use either WalletProvider or LedgerProvider'
      );
    }

    switch (this.signerProvider.constructor) {
      case WalletProvider:
        return this.sendTransactionBasedOnType2(value, functionName, ...args);
      case HWProvider:
        return this.sendTransactionBasedOnType2(value, functionName, ...args);
      default:
        console.warn('invalid signerProvider');
    }

    return true;
  }

  private async sendTransactionBasedOnType2(
    value: number,
    functionName: string,
    ...args: Argument[]
  ): Promise<boolean> {
    const func = new ContractFunction(functionName);

    let payload = TransactionPayload.contractCall()
      .setFunction(func)
      .setArgs(args)
      .build();

    let transaction = new Transaction({
      receiver: this.contract.getAddress(),
      value: Balance.eGLD(value),
      gasLimit: new GasLimit(this.standardGasLimit),
      data: payload,
    });

    // @ts-ignore
    await this.signerProvider.sendTransaction(transaction);

    return true;
  }
}
