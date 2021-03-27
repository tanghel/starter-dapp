import { useContext } from 'context';
import { MultisigContract } from 'contracts/MultisigContract';

export default function useMultisigContract() {
  const { dapp, currentMultisigAddress } = useContext();
  const multisigContract = new MultisigContract(dapp, currentMultisigAddress, dapp.provider);
  return { multisigContract };
}
