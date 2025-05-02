import { PublicKey } from '@dfinity/agent';
import { prepareLogin } from './prepareLogin';
import { buildMiddleToAppDelegationChain } from './buildMiddleToAppDelegationChain';
import { handleAppDelegation } from './handleAppDelegation';
import { renderError } from './renderError';
import { formatError } from './formatError';
import { ERROR_MESSAGES } from './constants';

/**
 * Parameters for setting up the login button handler
 */
type SetupLoginButtonHandlerParams = {
  /** The Internet Identity login button element */
  iiLoginButton: HTMLButtonElement;
  /** The back to app button element */
  backToAppButton: HTMLButtonElement;
  /** The deep link URL for the app */
  deepLink: string;
  /** The public key for the app */
  appPublicKey: PublicKey;
  /** The Internet Identity URI */
  iiUri: string;
  /** Time to live in milliseconds from the current time */
  ttlMs: number;
};

/**
 * Sets up the click event handler for the Internet Identity login button
 * @param params - The parameters for setting up the login button handler
 */
export const setupLoginButtonHandler = async ({
  iiLoginButton,
  backToAppButton,
  deepLink,
  appPublicKey,
  iiUri,
  ttlMs,
}: SetupLoginButtonHandlerParams): Promise<void> => {
  // Prepare login outside of the event handler
  const login = await prepareLogin({
    iiUri,
  });

  iiLoginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    renderError('');

    try {
      const middleDelegationIdentity = await login();
      // Build the delegation chain
      const delegationChain = await buildMiddleToAppDelegationChain({
        middleDelegationIdentity,
        appPublicKey,
        expiration: new Date(Date.now() + ttlMs),
      });

      handleAppDelegation({
        deepLink,
        delegationChain,
        iiLoginButton,
        backToAppButton,
      });
    } catch (error) {
      renderError(formatError(ERROR_MESSAGES.LOGIN_PROCESS, error));
    }
  });
};
