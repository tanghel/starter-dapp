import React, { useEffect, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { useMultisig } from 'helpers';
import ProposeModal from './ProposeModal';

const ProposeAction = () => {
  const { dapp, address } = useContext();
  const { multisig } = useMultisig();
  const [balance, setBalance] = useState('');
  const [showProposeModal, setShowProposeModal] = useState(false);
  useEffect(() => {
    dapp.proxy.getAccount(new Address(address)).then(value => setBalance(value.balance.toString()));
  }, [address, dapp.proxy]);

  const handlePropose = (value: string) => {
    multisig
      .sendTransaction('0', 'proposeChangeQuorum', value)
      .then() 
      .catch(e => {
        console.error('handlePropose ', e);
      });
  };
  return (
    <div>
      <button
        onClick={() => {
            setShowProposeModal(true);
        }}
        className="btn btn-primary mb-3"
      >
        Propose
      </button>
      <ProposeModal
        show={showProposeModal}
        balance={balance}
        handleClose={() => {
            setShowProposeModal(false);
        }}
        handleContinue={handlePropose}
      />
    </div>
  );
};

export default ProposeAction;