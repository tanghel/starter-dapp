import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useContext } from 'context';
import Select from 'react-select';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import { Multisig } from 'contracts';
import ProposeInputAddressType from './ProposeInputAddress';

interface ProposeModalType {
  show: boolean;
  handleClose: () => void;
}

const ProposeModal = ({ show, handleClose }: ProposeModalType) => {
  const { dapp, multisigContract } = useContext();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedParams, setSelectedParams] = useState('');

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
    const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
    multisig.sendTransaction('0', selectedOption, selectedParams);
  };

  const handleParamsChange = (value: string) => {
    setSelectedParams(value);
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-container" animation={false} centered>
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            Propose
          </p>
          <Select 
            options={options} 
            onChange={handleOptionChange}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: 'rgba(255, 255, 255, 0.4)',
                primary: 'rgba(255, 255, 255, 0.8)',
                neutral0: 'rgba(0, 0, 0, 0.9)'
              },
            })}
          />

          <div className="p-spacer">
          { selectedOption == 'proposeChangeQuorum' ?
            <ProposeChangeQuorum handleParamsChange={handleParamsChange} /> : 
            (selectedOption == 'proposeAddBoardMember' || selectedOption == 'proposeAddProposer' || selectedOption == 'proposeRemoveUser') ?
            <ProposeInputAddressType handleParamsChange={handleParamsChange} /> :
            
            <span></span>
          }
          </div>

          <div>
            <button
              onClick={onProposeClicked}
              className="btn btn-primary mb-3"
            >
              Propose
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeModal;
