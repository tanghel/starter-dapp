import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigAddProposer extends MultisigAction {
  address: Address;

  constructor(address: Address) {
      super(MultisigActionType.AddProposer);
      this.address = address;
  }

  title() {
    return 'Add Proposer';
  }

  description() {
    return this.address.bech32();
  }

  tooltip() {
    return '';
  }
}