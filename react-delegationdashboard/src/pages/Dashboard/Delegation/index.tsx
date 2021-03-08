import * as React from 'react';
import { useContext, useDispatch } from 'context';
import { contractViews } from 'contracts/ContractViews';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import State from 'components/State';
import ProposeAction from '../Actions/DelegateAction/ProposeAction';
import StatCard from 'components/StatCard';


const MyDelegation = () => {
  const { dapp, address, egldLabel, delegationContract, multisigContract, loading, allActions } = useContext();

  const onProposeClicked = () => {
    console.log('Propose clicked');
  };

  return (
    <>
      {loading ? (
        <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
      ) : (
        <div className="card mt-spacer">
          <div className="card-body p-spacer">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <p className="h6 mb-3">My proposals</p>
              <div className="d-flex flex-wrap">
                <ProposeAction />
              </div>
            </div>

            {
              allActions.map(action => <StatCard title={action.title()} value={action.description()} color='red' />)
            }
            
          </div>
        </div>
      )}
    </>
  );
};

export default MyDelegation;
