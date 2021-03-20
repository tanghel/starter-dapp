import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendToken extends MultisigAction {
    address: Address;
    identifier: string;
    amount: number;
  
    constructor(address: Address, identifier: string, amount: number) { 
        super(MultisigActionType.SendEgld);
        this.address = address;
        this.identifier = identifier;
        this.amount = amount;
    }
  
    title() {
      return 'Send token';
    }
  
    description() {
      return `${this.amount} (${this.description})`;
    }
  }