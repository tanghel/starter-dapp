import { Address, Argument, Balance } from '@elrondnetwork/erdjs/out';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSmartContractCall extends MultisigAction {
    address: Address;
    amount: BigUIntValue;
    endpointName: string;
    args: Argument[];
  
    constructor(address: Address, amount: BigUIntValue, endpointName: string, args: Argument[]) { 
        super(MultisigActionType.SendEgld);
        this.address = address;
        this.amount = amount;
        this.endpointName = endpointName;
        this.args = args;
    }
  
    title() {
      return 'Smart Contract call';
    }
  
    description() {
      return `${this.endpointName}: ${new Balance(this.amount.valueOf()).toCurrencyString()} to ${this.address.bech32()}`;
    }
  }