import { useContext } from 'context';
import { Multisig } from 'contracts/Multisig';

export default function useMultisig() {
  const { dapp, currentMultisigAddress } = useContext();
  const multisig = new Multisig(dapp, currentMultisigAddress, dapp.provider);
  return { multisig };
}
