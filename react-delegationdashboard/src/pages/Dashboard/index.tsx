import React from 'react';
import { useContext } from 'context';
import Multisig from './Multisig';
import { Redirect } from 'react-router-dom';
import Overview from 'components/Overview';

const Dashboard = () => {
  const { currentMultisigAddress } = useContext();

  if (!currentMultisigAddress) {
    return <Redirect to="/owner" />;
  }

  return (
    <div className="dashboard w-100">
      <div className="card border-0">
        <Overview />
        <div className="card-body pt-0 px-spacer pb-spacer">
          <Multisig />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
