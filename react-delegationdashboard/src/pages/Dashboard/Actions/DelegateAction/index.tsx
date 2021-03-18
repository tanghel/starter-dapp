import React, { useEffect, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { useDelegation } from 'helpers';

const DelegateAction = () => {
  const { dapp, address } = useContext();
  const { delegation } = useDelegation();
  const [balance, setBalance] = useState('');
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  useEffect(() => {
    dapp.proxy.getAccount(new Address(address)).then(value => setBalance(value.balance.toString()));
  }, [address, dapp.proxy]);

  const handleDelegate = (value: string) => {
    delegation
      .sendTransaction('0', 'proposeChangeQuorum', value)
      .then() 
      .catch(e => {
        console.error('handleDelegate ', e);
      });
  };
  return (
    <div>
    </div>
  );
};

export default DelegateAction;