import React, { useState, useEffect } from 'react';
import { MultisigIssueToken } from 'types/MultisigIssueToken';

interface ProposeIssueTokenType {
  handleChange: (proposal: MultisigIssueToken) => void;
}

const ProposeIssueToken = ({ handleChange } : ProposeIssueTokenType) => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('');

  const getProposal = () : MultisigIssueToken | null => {
    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
        return null;
    }

    let decimalsNumeric = Number(decimals);
    if (isNaN(decimalsNumeric)) {
        return null;
    }

    return new MultisigIssueToken(name, identifier, amountNumeric, decimalsNumeric);
  };

  const refreshProposal = () => {
    setTimeout(() => {
      let proposal = getProposal();
      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const onNameChanged = (event: any) => {
    setName(event.target.value);

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

  const onDecimalsChanged = (event: any) => {
    setDecimals(event.target.value);

    refreshProposal();
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Name: </span>
        <input 
          type="text"
          className='form-control'
          value={name}
          autoComplete="off"
          onChange={onNameChanged}
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
        <span>Mint Amount: </span>
        <input 
          type="number"
          className='form-control'
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Decimals: </span>
        <input 
          type="number"
          className='form-control'
          value={decimals}
          autoComplete="off"
          onChange={onDecimalsChanged}
        />
      </div>
    </div>
  );
};

export default ProposeIssueToken;