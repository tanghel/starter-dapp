import { Address } from '@elrondnetwork/erdjs/out';
import { useContext } from 'context';
import { SmartContractDeploy } from 'contracts';

export default function useSmartContractDeploy() {
  const { dapp, address } = useContext();
  const scDeploy = new SmartContractDeploy(dapp, 'erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu', dapp.provider, new Address(address));
  return { scDeploy };
}
