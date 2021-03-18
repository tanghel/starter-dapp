import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigAction, MultisigActionDetailed, MultisigActionType, MultisigAddBoardMember, MultisigAddProposerDetailed, MultisigChangeQuorumDetailed, MultisigRemoveUserDetailed } from 'context/state';

export default function numberToRequestData(value: number) {
    if (value < 16) {
        return '0' + value.toString(16);
    }

    return value.toString(16);
};

export function parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
    let actionTypeByte = buffer.slice(0, 1)[0];

    let action: MultisigAction;
    let remainingBytes = buffer.slice(1);

    switch (actionTypeByte) {
      case MultisigActionType.AddBoardMember:
          action = new MultisigAddBoardMember(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.AddProposer:
          action = new MultisigAddProposerDetailed(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.RemoveUser:
          action = new MultisigRemoveUserDetailed(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.ChangeQuorum:
          action = new MultisigChangeQuorumDetailed(actionTypeByte, getIntValueFromBytes(remainingBytes.slice(0, 4)));
          remainingBytes = remainingBytes.slice(4);
          break;
      default:
          return [null, remainingBytes];
    }

    return [action, remainingBytes];
}

export function parseActionDetailed(buffer: Buffer): MultisigActionDetailed | null {
    let actionId = getIntValueFromBytes(buffer.slice(0, 4));
    let actionBytes = buffer.slice(4);

    let [action, remainingBytes] = parseAction(actionBytes);
    if (action === null) {
        return null;
    }

    let signerCount = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);
    
    let signers = [];
    for (let i = 0; i < signerCount; i++) {
        let addressBytes = remainingBytes.slice(0, 32);
        let address = new Address(addressBytes);
        remainingBytes = remainingBytes.slice(32);

        signers.push(address);
    }

    return new MultisigActionDetailed(action, actionId, signers);
  }

  export function getIntValueFromBytes(buffer: Buffer) {
    return ((buffer[buffer.length - 1]) | 
    (buffer[buffer.length - 2] << 8) | 
    (buffer[buffer.length - 3] << 16) | 
    (buffer[buffer.length - 4] << 24));
  }