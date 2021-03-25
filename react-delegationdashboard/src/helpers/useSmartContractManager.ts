import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { SmartContractManager } from 'contracts/SmartContractManager';

export default function useSmartContractManager() {
  const { dapp, address, multisigManagerContract } = useContext();
  const scDeploy = new SmartContractManager(dapp, multisigManagerContract ?? '', dapp.provider, new Address(address));
  return { scDeploy };
}
