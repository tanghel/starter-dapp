import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { DeployContract } from 'contracts/DeployContract';

export default function useDeployContract() {
  const { dapp, address, multisigDeployerContract } = useContext();
  const deployContract = new DeployContract(dapp, multisigDeployerContract ?? '', dapp.provider, new Address(address));
  return { deployContract };
}
