import { Address } from '@elrondnetwork/erdjs/out';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendEgldDetailed extends MultisigAction {
    address: Address;
    amount: BigUIntValue;
    data: string;
  
    constructor(type: MultisigActionType, address: Address, amount: BigUIntValue, data: string) { 
        super(type);
        this.address = address;
        this.amount = amount;
        this.data = data;
    }
  
    title() {
      return 'Send Egld';
    }
  
    toHumanReadableString(value: BigUIntValue, numberOfDecimals: number): string {
      const DENOMINATION = 18;
  
      let padded = value.valueOf().toString().padStart(DENOMINATION, '0');
      let decimals = padded.slice(-DENOMINATION);
      if (decimals.length > numberOfDecimals) {
          decimals = decimals.slice(0, numberOfDecimals);
      }
  
      let integer = padded.slice(0, padded.length - DENOMINATION) || 0;
      return `${integer}.${decimals}`;
    }
  
    description() {
      let description = `${this.toHumanReadableString(this.amount, 2)} to ${this.address.hex()}`;
  
      if (this.data !== '') {
        description += ` (${this.data})`;
      }
  
      return description;
    }
  }