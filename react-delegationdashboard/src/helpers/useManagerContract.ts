import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { ManagerContract } from 'contracts/ManagerContract';

export default function useManagerContract() {
  const { dapp, address, multisigManagerContract } = useContext();
  const managerContract = new ManagerContract(dapp, multisigManagerContract ?? '', dapp.provider, new Address(address));
  return { managerContract };
}
