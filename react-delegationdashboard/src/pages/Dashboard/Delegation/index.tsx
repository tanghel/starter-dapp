import * as React from 'react';
import { useContext, useDispatch } from 'context';
import denominate from 'components/Denominate/formatters';
import DelegateAction from '../Actions/DelegateAction';
import UndelegateAction from '../Actions/UndelegateAction';
import { contractViews } from 'contracts/ContractViews';
import ClaimRewardsAction from '../Actions/ClaimRewardsAction';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import State from 'components/State';
import { denomination, decimals } from 'config';
import { BinaryCodec } from '@elrondnetwork/erdjs/out/smartcontracts/codec';
import { TypeDescriptor, VectorType, StructureDefinition, StructureField, U32Value, StructureFieldDefinition, Vector, StructureType } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import ProposeAction from '../Actions/DelegateAction/ProposeAction';


const MyDelegation = () => {
  const { dapp, address, egldLabel, delegationContract, multisigContract, loading } = useContext();
  const dispatch = useDispatch();
  const { getClaimableRewards, getUserActiveStake, getNumBoardMembers, getNumProposers, getQuorum, 
    getActionLastIndex, getActionData, getPendingActionFullInfo, userRole, getAllBoardMembers,
    getAllProposers, getActionSigners, getActionSignerCount, getActionValidSignerCount, quorumReached, signed
   } = contractViews;
  const [userActiveStake, setUserActiveStake] = React.useState('0');
  const [userActiveNominatedStake, setUserActiveNominatedStake] = React.useState('0');
  const [claimableRewards, setClaimableRewards] = React.useState('0');
  const [displayRewards, setDisplayRewards] = React.useState(false);
  const [displayUndelegate, setDisplayUndelegate] = React.useState(false);

  const getAllData = () => {
    console.log(`Multisig contract: ${multisigContract}`);
    console.log(`Delegation contract: ${delegationContract}`);

    dispatch({ type: 'loading', loading: true });

    // let numNodesResponse = await getNumNodes(dapp, multisigContract);
    // console.log({ numNodesResponse });
    getNumBoardMembers(dapp, multisigContract ?? '')
      .then(value => {
        console.log({numBoardMembers: value.returnData[0].asNumber});
      });
 
    getNumProposers(dapp, multisigContract ?? '')
      .then(value => {
        console.log({numProposers: value.returnData[0].asNumber});
      });

    getQuorum(dapp, multisigContract ?? '')
      .then(value => {
        console.log({quorum: value.returnData[0].asNumber});
      });

    getActionLastIndex(dapp, multisigContract ?? '')
      .then(value => {
        console.log({actionLastIndex: value.returnData[0].asNumber});
      });

    getActionData(5, dapp, multisigContract ?? '')
      .then(value => {
        console.log({actionData: value});
      });

    getPendingActionFullInfo(dapp, multisigContract ?? '')
      .then(value => {
        // let myDefinition = new StructureDefinition(
        //   'HelloWorld',
        //   [
        //     new StructureFieldDefinition('action_id', '', ['U32']),
        //     new StructureFieldDefinition('action_data', '', ['BigUInt']),
        //     new StructureFieldDefinition('signers', '', ['Vector', 'Address'])
        //   ]
        // );

        // let myType = new StructureType(myDefinition);

        // let codec = new BinaryCodec(); 

        // let result = codec.decodeNested(value.returnData[0].asBuffer, new TypeDescriptor([myType]));

        console.log({pendingActionFullInfo: value});
      });

    userRole('88c738a5d26c0e3a2b4f9e8110b540ee9c0b71a3be057569a5a7b0fcb482c8f7', dapp, multisigContract ?? '')
      .then(value => {
        console.log({userRole: value.returnData[0].asNumber});
      });

    getAllBoardMembers(dapp, multisigContract ?? '')
      .then(value => {
        let allBoardMembers = value.returnData.map(x => x.asHex);

        console.log({allBoardMembers});
      });

    getAllProposers(dapp, multisigContract ?? '')
      .then(value => {
        let allProposers = value.returnData.map(x => x.asHex);

        console.log({allProposers});
      });

    getActionSigners(4, dapp, multisigContract ?? '')
      .then(value => {
        console.log({actionSigners: value});
      });
      
    getActionSignerCount(4, dapp, multisigContract ?? '')
      .then(value => {
        console.log({actionSignerCount: value.returnData[0].asNumber});
      });

    getActionValidSignerCount(5, dapp, multisigContract ?? '')
      .then(value => {
        console.log({actionValidSignerCount: value.returnData[0].asNumber});
      });

    quorumReached(5, dapp, multisigContract ?? '')
      .then(value => {
        console.log({quorumReached: value.returnData[0].asBool});
      });

    signed('88c738a5d26c0e3a2b4f9e8110b540ee9c0b71a3be057569a5a7b0fcb482c8f7', 5, dapp, multisigContract ?? '')
      .then(value => {
        console.log({signed: value.returnData[0].asBool});
      });

    getClaimableRewards(dapp, address, delegationContract)
      .then(value => {
        console.log(value);

        if (value.returnData.length > 0 && value.returnData[0]?.asNumber !== 0) {
          setDisplayRewards(true);
        }
        setClaimableRewards(
          denominate({
            denomination,
            decimals,
            input: value.returnData[0]?.asBigInt.toString(),
            showLastNonZeroDecimal: false,
          }) || ''
        );
      })
      .catch(e => console.error('getClaimableRewards error', e));
    getUserActiveStake(dapp, address, delegationContract)
      .then(value => {
        setUserActiveStake(
          denominate({
            denomination,
            decimals,
            input: value.returnData[0]?.asBigInt.toString(),
            showLastNonZeroDecimal: false,
          }) || ''
        );
        setUserActiveNominatedStake(value.returnData[0]?.asBigInt.toString());
        if (value.returnData.length > 0 && value.returnData[0]?.asNumber !== 0) {
          setDisplayUndelegate(true);
        }

        dispatch({ type: 'loading', loading: false });
      })
      .catch(e => {
        console.error('getUserActiveStake error', e);
        dispatch({
          type: 'loading',
          loading: false,
        });
      });
  };

  const onProposeClicked = () => {
    console.log('Propose clicked');
  };

  React.useEffect(getAllData, []);

  return (
    <>
      {loading ? (
        <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
      ) : (
        <div className="card mt-spacer">
          <div className="card-body p-spacer">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <p className="h6 mb-3">My proposals</p>
              <div className="d-flex flex-wrap">
                <ProposeAction />
              </div>
            </div>
            {userActiveStake === String(0) ? (
              <State
                title="No pending proposals"
                description="Welcome to our platform!"
                action={<DelegateAction />}
              />
            ) : (
              <div className="m-auto text-center py-spacer">
                <div>
                  <p className="m-0">Active Delegation</p>
                  <p className="h4">
                    {userActiveStake}{' '}
                    {egldLabel}
                  </p>
                </div>
                <div>
                  <p className="text-muted">
                    {claimableRewards}{' '}
                    {egldLabel} Claimable rewards
                  </p>
                </div>
                {displayRewards ? <ClaimRewardsAction /> : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyDelegation;
