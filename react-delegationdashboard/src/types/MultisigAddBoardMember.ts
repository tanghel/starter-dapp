import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigAddBoardMember extends MultisigAction {
    address: Address;
  
    constructor(type: MultisigActionType, address: Address) {
        super(type);
        this.address = address;
    }
  
    title() {
      return 'Add board member';
    }
  
    description() {
      return this.address.bech32();
    }
  }