import React, { useState, useEffect } from 'react';
import { useContext } from 'context';
import { Address } from '@elrondnetwork/erdjs/out';

interface ProposeInputAddressType {
  handleParamsChange: (params: Address) => void;
}

const ProposeInputAddress = ({ handleParamsChange } : ProposeInputAddressType) => {
  const [address, setAddress] = useState('');

  const handleAddressChanged = (event: any) => {
    setAddress(event.target.value);

    handleParamsChange(new Address(event.target.value));
  };

  return (
    <div className="modal-control-container">
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