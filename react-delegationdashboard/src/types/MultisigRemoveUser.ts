import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigRemoveUser extends MultisigAction {
    address: Address;
  
    constructor(address: Address) {
        super(MultisigActionType.RemoveUser);
        this.address = address;
    }
  
    title() {
      return 'Remove user';
    }
  
    description() {
      return this.address.bech32();
    }
  }