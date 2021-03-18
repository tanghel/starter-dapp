import { useContext } from 'context';
import { Multisig } from 'contracts';

export default function useMultisig() {
  const { dapp, delegationContract } = useContext();
  const multisig = new Multisig(dapp.proxy, delegationContract, dapp.provider);
  return { multisig };
}
