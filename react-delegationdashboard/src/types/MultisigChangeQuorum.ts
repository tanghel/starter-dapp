import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigChangeQuorum extends MultisigAction {
    newSize: number;
  
    constructor(newSize: number) { 
        super(MultisigActionType.ChangeQuorum);
        this.newSize = newSize;
    }
  
    title() {
      return 'Change Quorum';
    }
  
    description() {
      return 'New Quorum Size: ' + this.newSize.toString();
    }

    tooltip() {
      return '';
    }
  }