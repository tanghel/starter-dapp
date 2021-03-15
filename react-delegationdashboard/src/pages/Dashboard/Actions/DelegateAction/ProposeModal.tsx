import React, { useState } from 'react';
import { ErrorMessage, Formik } from 'formik';
import BigNumber from 'bignumber.js';
import { object, string } from 'yup';
import { Modal } from 'react-bootstrap';
import { useContext } from 'context';
import Denominate from 'components/Denominate';
import { entireBalance } from 'helpers';
import { denomination, decimals } from 'config';
import denominate from 'components/Denominate/formatters';
import Select from 'react-select';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import { Delegation } from 'contracts';

interface ProposeModalType {
  show: boolean;
  balance: string;
  handleClose: () => void;
  handleContinue: (value: string) => void;
}

const ProposeModal = ({ show, balance, handleClose, handleContinue }: ProposeModalType) => {
  const { egldLabel, contractOverview, totalActiveStake, quorumSize, dapp, multisigContract } = useContext();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedParams, setSelectedParams] = useState('');

  const available = entireBalance({
    balance: balance,
    gasPrice: '12000000',
    gasLimit: '12000000',
    denomination,
    decimals,
  });

  const isFullDelegationCapContract = () => {
    return (
      denominate({
        input: totalActiveStake,
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
      }) === contractOverview.maxDelegationCap
    );
  };

  const options = [
    { value: 'proposeChangeQuorum', label: 'Change quorum' },
    { value: 'proposeAddProposer', label: 'Add proposer' },
    { value: 'proposeAddBoardMember', label: 'Add board member' },
    { value: 'proposeRemoveUser', label: 'Remove user' },
  ];

  const handleOptionChange = (option: any, label: any) => {
    setSelectedOption(option.value.toString());
  };

  const onProposeClicked = () => {
    const delegation = new Delegation(dapp.proxy, multisigContract, dapp.provider);
    delegation.sendTransaction('0', selectedOption, selectedParams);
  };

  const handleParamsChange = (value: string) => {
    setSelectedParams(value);
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-container" animation={false} centered>
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            Delegate now
          </p>
          {isFullDelegationCapContract() ? (
            <p className="mb-spacer">
              The maximum delegation cap was reached you can not delegate more
            </p>
          ) : (
            <p className="mb-spacer">{`Select the amount of ${egldLabel} you want to propose.`}</p>
          )}

          <Select 
            options={options} 
            onChange={handleOptionChange}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: 'rgba(255, 255, 255, 0.2)',
                primary: 'black',
                neutral0: 'rgba(0, 0, 0, 0.4)'
              },
            })}
          />

          {selectedOption == 'proposeChangeQuorum' ?
            <ProposeChangeQuorum handleParamsChange={handleParamsChange} /> : <span>no change quorum</span>
          }

          <button
            onClick={onProposeClicked}
            className="btn btn-primary mb-3"
          >
            Propose
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeModal;
