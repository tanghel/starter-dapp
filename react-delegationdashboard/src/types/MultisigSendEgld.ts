import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendEgld extends MultisigAction {
    address: Address;
    amount: BigUIntValue;
    data: string;
  
    constructor(address: Address, amount: BigUIntValue, data: string) { 
        super(MultisigActionType.SendEgld);
        this.address = address;
        this.amount = amount;
        this.data = data;
    }
  
    title() {
      return 'Send Egld';
    }
  
    description() {
      let description = `${new Balance(this.amount.valueOf()).toCurrencyString()} to ${this.address.bech32()}`;
  
      if (this.data !== '') {
        description += ` (${this.data})`;
      }
  
      return description;
    }
  }