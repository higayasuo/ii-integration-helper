import { DelegationChain } from '@dfinity/identity';
import { buildDelegationString } from './buildDelegationString';

/**
 * Parameters for sending delegation to the parent window
 */
export type SendDelegationToParentParams = {
  deepLink: string;
  delegationChain: DelegationChain;
};

/**
 * Sends delegation information to the parent window using postMessage.
 *
 * @param {SendDelegationToParentParams} params - The parameters for sending delegation
 * @param {Window & typeof globalThis} params.window - The window object from the web environment
 */
export const sendDelegationToParent = ({
  deepLink,
  delegationChain,
}: SendDelegationToParentParams): void => {
  console.log('Web browser detected, using postMessage');
  const message = {
    kind: 'success',
    delegation: buildDelegationString(delegationChain),
  };
  window.parent.postMessage(message, new URL(deepLink).origin);
};
