import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';

const Header = () => {
  const { pathname } = useLocation();
  const { address, currentMultisigAddress, contractOverview } = useContext();

  return (
    <div className="header card-header d-flex align-items-center border-0 justify-content-between px-spacer">
      <div className="py-spacer text-truncate">
        <p className="opacity-6 mb-0">Multisig Address</p>
        <span className="text-truncate">{currentMultisigAddress?.hex()}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center justify-content-between">
        <Link to="/owner" className="btn btn-primary btn-sm">
          Manage multisigs
        </Link>
      </div>
    </div>
  );
};

export default Header;
