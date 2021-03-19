import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigRemoveUserDetailed extends MultisigAction {
    address: Address;
  
    constructor(type: MultisigActionType, address: Address) {
        super(type);
        this.address = address;
    }
  
    title() {
      return 'Remove user';
    }
  
    description() {
      return this.address.bech32();
    }
  }