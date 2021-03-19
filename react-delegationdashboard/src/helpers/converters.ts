import { Address } from '@elrondnetwork/erdjs/out';
import { NumericalBinaryCodec } from '@elrondnetwork/erdjs/out/smartcontracts/codec/numerical';
import { BigUIntType, NumericalType, NumericalValue, U32Type } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { MultisigActionType } from 'types/MultisigActionType';
import { MultisigAddBoardMember } from 'types/MultisigAddBoardMember';
import { MultisigAddProposer } from 'types/MultisigAddProposer';
import { MultisigChangeQuorum } from 'types/MultisigChangeQuorum';
import { MultisigRemoveUser } from 'types/MultisigRemoveUser';
import { MultisigSendEgld } from 'types/MultisigSendEgld';

export function parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
    let actionTypeByte = buffer.slice(0, 1)[0];

    let action: MultisigAction | null;
    let remainingBytes = buffer.slice(1);

    switch (actionTypeByte) {
      case MultisigActionType.AddBoardMember:
        action = new MultisigAddBoardMember(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
        remainingBytes = remainingBytes.slice(32);
        break;
      case MultisigActionType.AddProposer:
        action = new MultisigAddProposer(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
        remainingBytes = remainingBytes.slice(32);
        break;
      case MultisigActionType.RemoveUser:
        action = new MultisigRemoveUser(actionTypeByte, new Address(remainingBytes.slice(0, 32)));
        remainingBytes = remainingBytes.slice(32);
        break;
      case MultisigActionType.ChangeQuorum:
        action = new MultisigChangeQuorum(actionTypeByte, getIntValueFromBytes(remainingBytes.slice(0, 4)));
        remainingBytes = remainingBytes.slice(4);
        break;
      case MultisigActionType.SendEgld:
        let targetAddress = new Address(remainingBytes.slice(0, 32));
        remainingBytes = remainingBytes.slice(32);

        let amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
        remainingBytes = remainingBytes.slice(4);

        let amountBytes = remainingBytes.slice(0, amountSize);
        remainingBytes = remainingBytes.slice(amountSize);

        let codec = new NumericalBinaryCodec();
        let amount = codec.decodeTopLevel(amountBytes, BigUIntType.One);

        let dataSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
        remainingBytes = remainingBytes.slice(4);

        let dataBytes = remainingBytes.slice(0, dataSize);
        remainingBytes = remainingBytes.slice(dataSize);
        
        let data = dataBytes.toString();

        action = new MultisigSendEgld(actionTypeByte, targetAddress, amount, data);
        break;
      default:
        action = null;
        break;
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