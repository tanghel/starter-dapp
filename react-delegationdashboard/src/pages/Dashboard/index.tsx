import React from 'react';
import { useContext } from 'context';
import Delegation from './Delegation';
import { Redirect } from 'react-router-dom';
import Overview from 'components/Overview';

const Dashboard = () => {
  const { loggedIn } = useContext();

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="dashboard w-100">
      <div className="card border-0">
        <Overview />
        <div className="card-body pt-0 px-spacer pb-spacer">
          <Delegation />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
