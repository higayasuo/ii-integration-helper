import { PublicKey } from '@dfinity/agent';
import { prepareLogin } from './prepareLogin';
import { buildMiddleToAppDelegationChain } from './buildMiddleToAppDelegationChain';
import { determineIframe } from 'expo-icp-frontend-helpers';
import { sendDelegationToParent } from './sendDelegationToParent';
import { handleNativeAppDelegation } from './handleNativeAppDelegation';
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
      const expiration = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes from now

      // Build the delegation chain
      const delegationChain = await buildMiddleToAppDelegationChain({
        middleDelegationIdentity,
        appPublicKey,
        expiration,
      });

      // Check if we're in an iframe (web browser case)
      const isIframe = determineIframe();

      if (isIframe) {
        // We're in a web browser iframe
        sendDelegationToParent({
          deepLink,
          delegationChain,
        });
      } else {
        // We're in a native app's WebView
        handleNativeAppDelegation({
          deepLink,
          delegationChain,
          iiLoginButton,
          backToAppButton,
        });
      }
    } catch (error) {
      renderError(formatError(ERROR_MESSAGES.LOGIN_PROCESS, error));
    }
  });
};
