import React from 'react';
import { useContext } from 'context';
import Multisig from './Multisig';
import { Redirect } from 'react-router-dom';
import MultisigDetailsHeader from 'pages/MultisigDetails/MultisigDetailsHeader';
import MultisigDetailsCards from 'pages/MultisigDetails/MultisigDetailsCards';

const MultisigDetailsPage = () => {
  const { currentMultisigAddress } = useContext();

  if (!currentMultisigAddress) {
    return <Redirect to="/owner" />;
  }

  return (
    <div className="dashboard w-100">
      <div className="card border-0">
        <MultisigDetailsHeader />
        <MultisigDetailsCards />
        <div className="card-body pt-0 px-spacer pb-spacer">
          <Multisig />
        </div>
      </div>
    </div>
  );
};

export default MultisigDetailsPage;
