import { Address } from '@elrondnetwork/erdjs/out';
import React, { useState, useEffect } from 'react';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
}

const ProposeSendToken = ({ handleChange } : ProposeSendTokenType) => {
  const [address, setAddress] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');

  const getProposal = () : MultisigSendToken | null => {
    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
        return null;
    }

    return new MultisigSendToken(new Address(address), identifier, amountNumeric);
  };

  const refreshProposal = () => {
    setTimeout(() => {
      let proposal = getProposal();
      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);

    refreshProposal();
  };

  const onIdentifierChanged = (event: any) => {
    setIdentifier(event.target.value);

    refreshProposal();
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);

    refreshProposal();
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Address: </span>
        <input 
          type="text"
          className='form-control'
          value={address}
          autoComplete="off"
          onChange={onAddressChanged}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Identifier: </span>
        <input 
          type="text"
          className='form-control'
          value={identifier}
          autoComplete="off"
          onChange={onIdentifierChanged}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Amount: </span>
        <input 
          type="number"
          className='form-control'
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendToken;