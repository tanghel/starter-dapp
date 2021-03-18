import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigActionContainer, MultisigActionType, MultisigAddBoardMember, MultisigAddProposer, MultisigChangeQuorum, MultisigRemoveUser } from 'context/state';

export default function numberToRequestData(value: number) {
    if (value < 16) {
        return '0' + value.toString(16);
    }

    return value.toString(16);
};

export function parseActionFullDetails(buffer: Buffer) {
    let actionId = getIntValueFromBytes(buffer.slice(0, 4));
    let actionTypeByte = buffer.slice(4, 5)[0];

    let action: MultisigActionContainer;
    let remainingBytes = buffer.slice(5);

    switch (actionTypeByte) {
      case MultisigActionType.AddBoardMember:
          action = new MultisigAddBoardMember(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.AddProposer:
          action = new MultisigAddProposer(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.RemoveUser:
          action = new MultisigRemoveUser(new Address(remainingBytes.slice(0, 32)));
          remainingBytes = remainingBytes.slice(32);
          break;
      case MultisigActionType.ChangeQuorum:
          action = new MultisigChangeQuorum(getIntValueFromBytes(remainingBytes.slice(0, 4)));
          remainingBytes = remainingBytes.slice(4);
          break;
      default:
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

    action.actionId = actionId;
    action.signers = signers;

    return action;
  }

  export function getIntValueFromBytes(buffer: Buffer) {
    return ((buffer[buffer.length - 1]) | 
    (buffer[buffer.length - 2] << 8) | 
    (buffer[buffer.length - 3] << 16) | 
    (buffer[buffer.length - 4] << 24));
  }