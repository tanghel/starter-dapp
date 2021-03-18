import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useContext } from 'context';
import Select from 'react-select';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import ProposeInputAddressType from './ProposeInputAddress';
import { useMultisig } from 'helpers';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigRemoveUser } from 'context/state';

interface ProposeModalType {
  show: boolean;
  handleClose: () => void;
}

const ProposeModal = ({ show, handleClose }: ProposeModalType) => {
  const { multisig } = useMultisig();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedNumericParam, setSelectedNumericParam] = useState(0);
  const [selectedAddressParam, setSelectedAddressParam] = useState(new Address());

  const options = [
    { value: 'change_quorum', label: 'Change quorum' },
    { value: 'add_proposer', label: 'Add proposer' },
    { value: 'add_board_member', label: 'Add board member' },
    { value: 'remove_user', label: 'Remove user' },
  ];

  const handleOptionChange = (option: any, label: any) => {
    setSelectedOption(option.value.toString());
  };

  const onProposeClicked = () => {
    switch (selectedOption) {
      case 'change_quorum':
        multisig.mutateProposeChangeQuorum(selectedNumericParam);
        break;
      case 'add_proposer':
        multisig.mutateProposeAddProposer(selectedAddressParam);
        break;
      case 'add_board_member':
        multisig.mutateProposeAddBoardMember(selectedAddressParam);
        break;
      case 'remove_user':
        multisig.mutateProposeRemoveUser(selectedAddressParam);
        break;
      default:
        console.error(`Unrecognized option ${selectedOption}`);
        break;
    }
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
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
          { selectedOption == 'change_quorum' ?
            <ProposeChangeQuorum handleParamsChange={handleNumericParamChange} /> : 
            (selectedOption == 'add_proposer' || selectedOption == 'add_board_member' || selectedOption == 'remove_user') ?
            <ProposeInputAddressType handleParamsChange={handleAddressParamChange} /> :
            
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
