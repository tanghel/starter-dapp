import { Address } from '@elrondnetwork/erdjs/out';
import { useContext, useDispatch } from 'context';
import { useManagerContract } from 'contracts/ManagerContract';
import { useMultisigContract } from 'contracts/MultisigContract';
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children, page }: { children: React.ReactNode; page: string }) => {
  const dispatch = useDispatch();
  const { address, currentMultisigAddress } = useContext();
  const { multisigContract } = useMultisigContract();
  const { managerContract } = useManagerContract();

  const getDashboardInfo = async () => {
    const [
      numBoardMembers,
      numProposers,
      quorum,
      userRole,
      allActions,
      contracts
    ] = await Promise.all([
      multisigContract.queryBoardMembersCount(),
      multisigContract.queryProposersCount(),
      multisigContract.queryQuorumCount(),
      multisigContract.queryUserRole(new Address(address).hex()),
      multisigContract.queryAllActions(),
      managerContract.queryContracts()
    ]);

    dispatch({
      type: 'setTotalBoardMembers',
      totalBoardMembers: numBoardMembers
    });

    dispatch({
      type: 'setTotalProposers',
      totalProposers: numProposers
    });

    dispatch({
      type: 'setQuorumSize',
      quorumSize: quorum
    }); 

    dispatch({
      type: 'setUserRole',
      userRole: userRole
    });

    dispatch({
      type: 'setAllActions',
      allActions: allActions
    });

    dispatch({
      type: 'setAllMultisigContracts',
      allMultisigContracts: contracts
    });
  };

  React.useEffect(() => {
    console.log({currentMultisigAddress});
    if (address === null || (currentMultisigAddress === null || currentMultisigAddress === undefined || currentMultisigAddress === Address.Zero())) {
      dispatch({ type: 'loading', loading: false});
      return;
    }

    getDashboardInfo();
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
