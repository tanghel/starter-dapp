import React, { useState, useEffect } from 'react';
import { useContext } from 'context';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { MultisigSendEgld } from 'types/MultisigSendEgld';
import { BigUIntValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
}

const ProposeSendEgld = ({ handleChange } : ProposeSendEgldType) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');

  const getProposal = () : MultisigSendEgld | null => {
    let addressParam = new Address(address);

    let amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    let amountParam = new BigUIntValue(Balance.eGLD(amountNumeric).valueOf());

    return new MultisigSendEgld(addressParam, amountParam, data);
  };

  const refreshProposal = () => {
    let proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);

    refreshProposal();
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);

    refreshProposal();
  };

  const onDataChanged = (event: any) => {
    setData(event.target.value);

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
        <span>Amount: </span>
        <input 
          type="text"
          className='form-control'
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Data: </span>
        <input 
          type="text"
          className='form-control'
          value={data}
          autoComplete="off"
          onChange={onDataChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;