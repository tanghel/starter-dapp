import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Address } from '@elrondnetwork/erdjs/out';
import ProposeInputAddress from '../MultisigDetails/Propose/ProposeInputAddress';

interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  handleStep: () => void;
  currentStep: number;
}

const DeployStepsModal = ({ show, handleClose, handleStep, currentStep }: DeployStepsModalType) => {
  const onConfirmClicked = () => {
    handleStep();
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-container" animation={false} centered>
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            Multisig Deployment
          </p>

          <div className="p-spacer">
          </div>

          <div>
            <button
              onClick={onConfirmClicked}
              className="btn btn-primary mb-3"
            >
              { currentStep === 3 ? <span>Finish</span> : <span>Next</span>  }
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeployStepsModal;
