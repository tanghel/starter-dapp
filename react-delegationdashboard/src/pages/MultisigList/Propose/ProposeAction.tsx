import React, { useEffect, useState } from 'react';
import ProposeModal from './ProposeModal';

const ProposeAction = () => {
  const [showProposeModal, setShowProposeModal] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => {
            setShowProposeModal(true);
        }}
        className="btn btn-primary mb-3"
      >
        Propose
      </button>
      <ProposeModal
        show={showProposeModal}
        handleClose={() => {
            setShowProposeModal(false);
        }}
      />
    </div>
  );
};

export default ProposeAction;