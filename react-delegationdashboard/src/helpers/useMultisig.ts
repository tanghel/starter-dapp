import { useContext } from 'context';
import { Multisig } from 'contracts';

export default function useMultisig() {
  const { dapp, multisigContract } = useContext();
  const multisig = new Multisig(dapp.proxy, multisigContract, dapp.provider);
  return { multisig };
}
