import { Address } from '@elrondnetwork/erdjs/out';
import { useContext, useDispatch } from 'context';
import { contractViews } from 'contracts/ContractViews';
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children, page }: { children: React.ReactNode; page: string }) => {
  const dispatch = useDispatch();
  const { dapp, address, multisigContract } = useContext();
  const { getNumBoardMembers, getNumProposers, getQuorum, userRole, getAllActions } = contractViews;

  React.useEffect(() => {
    if (address !== null) {
      Promise.all([
          getNumBoardMembers(dapp, multisigContract ?? ''),
          getNumProposers(dapp, multisigContract ?? ''),
          getQuorum(dapp, multisigContract ?? ''),
          userRole(new Address(address).hex(), dapp, multisigContract ?? ''),
          getAllActions(dapp, multisigContract ?? '')
      ])
      .then(
        ([
          numBoardMembers,
          numProposers,
          quorum,
          userRole,
          allActions
        ]) => {
          dispatch({
            type: 'setTotalBoardMembers',
            totalBoardMembers: numBoardMembers.returnData[0].asNumber
          });
          dispatch({
            type: 'setTotalProposers',
            totalProposers: numProposers.returnData[0].asNumber
          });
          dispatch({
            type: 'setQuorumSize',
            quorumSize: quorum.returnData[0].asNumber
          }); 
          dispatch({
            type: 'setUserRole',
            userRole: userRole.returnData[0].asNumber
          });
          dispatch({
            type: 'setAllActions',
            allActions: allActions
          });
        }
      )
      .catch(e => {
        console.log('To do ', e);
      });
    }
  }, []);

  return (
    <div className={`layout d-flex flex-column min-vh-100 ${page}`}>
      {page !== 'home' && <Navbar />}
      <main className="container flex-grow-1 d-flex p-3 p-sm-spacer">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
