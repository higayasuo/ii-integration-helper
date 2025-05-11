import { DelegationChain } from '@dfinity/identity';
import { buildDelegationString } from './buildDelegationString';
import { updateParams } from 'expo-icp-frontend-helpers';

type BuildURIFragmentParams = {
  /** The delegation chain to encode */
  delegationChain: DelegationChain;
  /** The session ID to include in the URI fragment */
  sessionId: string;
};

/**
 * Builds a URI fragment containing the encoded delegation information.
 * This is used for secure transmission of delegation data in the URL fragment
 * (the part after #) which is not sent to the server.
 *
 * @param {DelegationChain} delegationChain - The delegation chain containing the delegation information.
 * @returns {string} A URI fragment in the format 'delegation=<encoded_delegation_string>'.
 */
export const buildURIFragment = ({
  delegationChain,
  sessionId,
}: BuildURIFragmentParams): string => {
  const delegation = buildDelegationString(delegationChain);
  const hashParams = new URLSearchParams();
  updateParams(hashParams, {
    delegation,
    sessionId,
  });
  return hashParams.toString();
};
