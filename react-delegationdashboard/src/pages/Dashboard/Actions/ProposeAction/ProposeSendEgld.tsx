import React, { useState, useEffect } from 'react';
import { useContext } from 'context';
import { Address } from '@elrondnetwork/erdjs/out';

interface ProposeSendEgldType {
  handleAddressChange: (address: Address) => void;
  handleAmountChange: (amount: number) => void;
  handleDataChange: (data: string) => void;
}

const ProposeSendEgld = ({ handleAddressChange, handleAmountChange, handleDataChange } : ProposeSendEgldType) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);

    handleAddressChange(new Address(event.target.value));
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);

    handleAmountChange(Number(event.target.value));
  };

  const onDataChanged = (event: any) => {
    setData(event.target.value);

    handleDataChange(event.target.value);
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