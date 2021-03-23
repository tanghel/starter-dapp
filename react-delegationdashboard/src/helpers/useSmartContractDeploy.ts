import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { SmartContractDeploy } from 'contracts';

export default function useSmartContractDeploy() {
  const { dapp, address, multisigManagerContract } = useContext();
  const scDeploy = new SmartContractDeploy(dapp, multisigManagerContract ?? '', dapp.provider, new Address(address));
  return { scDeploy };
}
