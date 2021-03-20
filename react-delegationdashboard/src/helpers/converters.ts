import { Address, Argument } from '@elrondnetwork/erdjs/out';
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
import { MultisigSmartContractCall } from 'types/MultisigSmartContractCall';

export function parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
    let actionTypeByte = buffer.slice(0, 1)[0];
    let remainingBytes = buffer.slice(1);

    switch (actionTypeByte) {
      case MultisigActionType.AddBoardMember:
        return parseAddBoardMember(remainingBytes);
      case MultisigActionType.AddProposer:
        return parseAddProposer(remainingBytes);
      case MultisigActionType.RemoveUser:
        return parseRemoveUser(remainingBytes);
      case MultisigActionType.ChangeQuorum:
        return parseChangeQuorum(remainingBytes);
      case MultisigActionType.SendEgld:
        return parseSendEgld(remainingBytes);
      case MultisigActionType.SCCall:
        return parseSmartContractCall(remainingBytes);
      default:
        console.error(`Unrecognized action ${actionTypeByte}`);
        return [ null, remainingBytes ];
    }
}

function parseAddBoardMember(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
  let action = new MultisigAddBoardMember(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [ action, remainingBytes ];
}

function parseAddProposer(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
  let action = new MultisigAddProposer(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [ action, remainingBytes ];
}

function parseRemoveUser(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
  let action = new MultisigRemoveUser(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [ action, remainingBytes ];
}

function parseChangeQuorum(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
  let action = new MultisigChangeQuorum(getIntValueFromBytes(remainingBytes.slice(0, 4)));
  remainingBytes = remainingBytes.slice(4);

  return [ action, remainingBytes ];
}

function parseSendEgld(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
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

  let action = new MultisigSendEgld(targetAddress, amount, data);
  
  return [ action, remainingBytes ];
}

function parseSmartContractCall(remainingBytes: Buffer): [ MultisigAction | null, Buffer ] {
  let targetAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  let amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);

  let codec = new NumericalBinaryCodec();
  let amount = codec.decodeTopLevel(amountBytes, BigUIntType.One);

  let endpointNameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let endpointNameBytes = remainingBytes.slice(0, endpointNameSize);
  remainingBytes = remainingBytes.slice(endpointNameSize);
  
  let endpointName = endpointNameBytes.toString();

  let argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let args = [];
  for (let i = 0; i < argsSize; i++) {
    let argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    let argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(Argument.fromBytes(argBytes));
  }

  let action = new MultisigSmartContractCall(targetAddress, amount, endpointName, args);

  
  return [ action, remainingBytes ];
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

export function getBytesFromHexString(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return Buffer.from(bytes);
};

export function getBytesFromIntValue(value: number) {
  let paddedBuffer = Buffer.alloc(4);
  let encodedValue = Argument.fromNumber(value).valueOf();

  let encodedBuffer = getBytesFromHexString(encodedValue.toString());
  let concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  let result = concatenatedBuffer.slice(-4);
  return result;
};