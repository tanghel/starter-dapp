import React, { useState, useEffect } from 'react';
import { useContext } from 'context';

interface ProposeChangeQuorumType {
  handleParamsChange: (params: string) => void;
}

const ProposeChangeQuorum = ({ handleParamsChange } : ProposeChangeQuorumType) => {
  const { quorumSize } = useContext();

  const [newQuorumSize, setNewQuorumSize] = useState(0);

  const handleNewQuorumSizeChanged = (event: any) => {
    setNewQuorumSize(event.target.value);

    handleParamsChange(`0${event.target.value}`);
  };

  useEffect(() => {
    // setNewQuorumSize(quorumSize);
  }), [];

  return (
    <input 
      type="number"
      className='form-control'
      value={newQuorumSize}
      autoComplete="off"
      onChange={handleNewQuorumSizeChanged}
    />
  );
};

export default ProposeChangeQuorum;