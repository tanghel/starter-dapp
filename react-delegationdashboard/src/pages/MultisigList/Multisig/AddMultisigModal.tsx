import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useMultisig } from 'helpers';
import { Address } from '@elrondnetwork/erdjs/out';
import ProposeInputAddress from '../ProposeInputAddress';

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  handleAdd: (address: Address) => void;
}

const AddMultisigModal = ({ show, handleClose, handleAdd }: AddMultisigModalType) => {
  const [address, setAddress] = React.useState(Address.Zero());

  const onAddressParamChange = (address: Address) => {
    setAddress(address);
  };

  const onAddClicked = () => {
    handleAdd(address);
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-container" animation={false} centered>
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            Add Multisig
          </p>

          <div className="p-spacer">
            <ProposeInputAddress handleParamsChange={onAddressParamChange} />
          </div>

          <div>
            <button
              onClick={onAddClicked}
              className="btn btn-primary mb-3"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultisigModal;
