import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface DeployMultisigModalType {
  show: boolean;
  handleClose: () => void;
  handleDeploy: (name: string) => void;
}

const DeployMultisigModal = ({ show, handleClose, handleDeploy }: DeployMultisigModalType) => {
  const [name, setName] = React.useState('');

  const onDeployClicked = () => {
    handleDeploy(name);
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-container" animation={false} centered>
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            Deploy Multisig
          </p>

          <div className="p-spacer">
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span>Name: </span>
              <input 
                type="text"
                className='form-control'
                value={name}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              onClick={onDeployClicked}
              className="btn btn-primary mb-3"
            >
              Deploy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeployMultisigModal;