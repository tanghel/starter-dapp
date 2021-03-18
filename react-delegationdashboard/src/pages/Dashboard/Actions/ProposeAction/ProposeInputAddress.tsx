import React, { useState, useEffect } from 'react';
import { useContext } from 'context';
import { Address } from '@elrondnetwork/erdjs/out';

interface ProposeInputAddressType {
  handleParamsChange: (params: string) => void;
}

const ProposeInputAddress = ({ handleParamsChange } : ProposeInputAddressType) => {
  const [address, setAddress] = useState('');

  const handleAddressChanged = (event: any) => {
    setAddress(event.target.value);

    let address = new Address(event.target.value);

    handleParamsChange(address.hex());
  };

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <span>Address: </span>
      <input 
        type="text"
        className='form-control'
        value={address}
        autoComplete="off"
        onChange={handleAddressChanged}
      />
    </div>
  );
};

export default ProposeInputAddress;