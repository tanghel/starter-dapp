import { Address } from '@elrondnetwork/erdjs/out';
import React, { useEffect } from 'react';
import { useContext, useDispatch } from 'context';
import { getItem, removeItem, setItem } from 'storage/session';

const WalletLogin = () => {
  const dispatch = useDispatch();
  const { dapp } = useContext();
  const handleOnClick = () => {
    dispatch({ type: 'loading', loading: true });
    dapp.provider
      .init()
      .then(initialised => {
        if (initialised) {
          // Wallet provider will redirect, we can set a session information so we know when we are getting back
          //  that we initiated a wallet provider login
          setItem('wallet_login', {}, 60); // Set a 60s session only
          dapp.provider.login();
        } else {
          dispatch({ type: 'loading', loading: true });
          console.warn('Something went wrong trying to redirect to wallet login..');
        }
      })
      .catch(err => {
        dispatch({ type: 'loading', loading: false });
        console.warn(err);
      });
  };

  // The wallet login component can check for the session and the address get param
  useEffect(() => {
    if (getItem('wallet_login')) {
      dispatch({ type: 'loading', loading: true });
      dapp.provider.init().then(initialised => {
        if (!initialised) {
          dispatch({ type: 'loading', loading: false });
          return;
        }

        dapp.provider
          .getAddress()
          .then(address => {
            removeItem('wallet_login');
            dispatch({ type: 'login', address });
          })
          // .then(value =>
          //   dapp.proxy
          //     .getAccount(new Address(getItem('address')))
          //     .then(account =>
          //       console.log({account})
          //     )
          // )
          .catch(err => {
            dispatch({ type: 'loading', loading: false });
          });
      });
    }
  }, [dapp.provider, dapp.proxy, dispatch]);

  return (
    <button onClick={handleOnClick} className="btn btn-primary px-sm-spacer mx-1 mx-sm-3">
      Access wallet
    </button>
  );
};

export default WalletLogin;
