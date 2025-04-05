# II Integration Helper

A TypeScript library that provides helper functions for integrating with Internet Identity (II) in web applications and native apps.

## Installation

```bash
npm install ii-integration-helper
```

## Dependencies

### Peer Dependencies

These dependencies need to be installed in your project:

```bash
npm install @dfinity/agent @dfinity/identity @dfinity/auth-client
```

- `@dfinity/agent`: For Internet Computer agent functionality
- `@dfinity/identity`: For identity and delegation management
- `@dfinity/auth-client`: For authentication client functionality

### Regular Dependencies

The following dependencies are included in the package:

- `canister-manager`: For canister URL management

## Features

- Internet Identity authentication integration
- Deep linking support for various platforms (ICP, Expo, native apps)
- Delegation chain management
- Public key handling
- Error formatting and rendering
- Button setup and event handling

## Usage

### Basic Usage

```typescript
import {
  buildParams,
  setupLoginButtonHandler,
  prepareButtons,
} from 'ii-integration-helper';

// Build parameters for II integration
const params = buildParams({
  localIPAddress: '127.0.0.1',
  dfxNetwork: 'local',
  internetIdentityCanisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  expoScheme: 'myapp',
  window: window,
});

// Prepare buttons
const { iiLoginButton, backToAppButton } = prepareButtons();

// Setup login button handler
await setupLoginButtonHandler({
  iiLoginButton,
  backToAppButton,
  deepLink: params.deepLink,
  appPublicKey: params.appPublicKey,
  iiUri: params.iiUri,
  window: window,
});
```

### Deep Linking

```typescript
import { buildDeepLink, DeepLinkType } from 'ii-integration-helper';

// Build a deep link for different platforms
const deepLink = buildDeepLink({
  deepLinkType: 'icp' as DeepLinkType,
  localIPAddress: '127.0.0.1',
  dfxNetwork: 'local',
  frontendCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  expoScheme: 'myapp',
});
```

### Delegation Chain

```typescript
import {
  buildMiddleToAppDelegationChain,
  buildURIFragment,
} from 'ii-integration-helper';

// Build a delegation chain
const delegationChain = await buildMiddleToAppDelegationChain({
  middleDelegationIdentity,
  appPublicKey,
  expiration: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
});

// Build a URI fragment for the delegation
const uriFragment = buildURIFragment(delegationChain);
```

## API Reference

### Core Functions

- `buildParams`: Builds parameters for II integration
- `buildDeepLink`: Creates deep links for different platforms
- `buildIIUri`: Builds the Internet Identity URI
- `buildAppPublicKey`: Converts a hex string to a PublicKey
- `buildDelegationString`: Converts a DelegationChain to a string
- `buildMiddleToAppDelegationChain`: Creates a delegation chain
- `buildURIFragment`: Builds a URI fragment for delegation

### UI Helpers

- `prepareButtons`: Prepares and validates UI buttons
- `prepareLogin`: Prepares the login process
- `setupLoginButtonHandler`: Sets up the login button handler
- `renderError`: Renders error messages
- `formatError`: Formats error messages

### Environment Detection

- `determineIframe`: Determines if the current window is an iframe
- `handleNativeAppDelegation`: Handles delegation in a native app
- `sendDelegationToParent`: Sends delegation to the parent window

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run tests with coverage
npm run test:coverage
```

## License

ISC
