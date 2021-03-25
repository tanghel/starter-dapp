import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { SmartContractDeploy } from 'contracts';

export default function useSmartContractDeploy() {
  const { dapp, address, multisigDeployerContract } = useContext();
  const scDeploy = new SmartContractDeploy(dapp, multisigDeployerContract ?? '', dapp.provider, new Address(address));
  return { scDeploy };
}
