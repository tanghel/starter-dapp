import React, { useState, useEffect } from 'react';
import { useContext } from 'context';

interface ProposeChangeQuorumType {
  handleParamsChange: (params: number) => void;
}

const ProposeChangeQuorum = ({ handleParamsChange } : ProposeChangeQuorumType) => {
  const { quorumSize } = useContext();

  const [newQuorumSize, setNewQuorumSize] = useState(0);

  const handleNewQuorumSizeChanged = (event: any) => {
    setNewQuorumSize(event.target.value);

    handleParamsChange(event.target.value);
  };

  useEffect(() => {
    setNewQuorumSize(quorumSize);
  }, []);

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <span style={{flexGrow: 1}}>Quorum size: </span>
      <input 
        style={{width: 250}}
        type="number"
        className='form-control'
        value={newQuorumSize}
        autoComplete="off"
        onChange={handleNewQuorumSizeChanged}
      />
    </div>
  );
};

export default ProposeChangeQuorum;