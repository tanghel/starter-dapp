import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigChangeQuorumDetailed extends MultisigAction {
    newSize: number;
  
    constructor(type: MultisigActionType, newSize: number) { 
        super(type);
        this.newSize = newSize;
    }
  
    title() {
      return 'Change quorum';
    }
  
    description() {
      return this.newSize.toString();
    }
  }