# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.5] - 2025-05-12

### Changed

- Updated URL handling to use proper URL objects consistently across the codebase:
  - Changed `iiUri` parameter to `internetIdentityURL` in `prepareLogin` and `setupLoginButtonHandler`
  - Updated `deepLink` parameter to use URL objects in `buildParams`, `handleAppDelegation`, and `setupLoginButtonHandler`
  - Updated tests to use URL objects for better type safety
  - Improved parameter type consistency across all functions

## [0.1.4] - 2025-05-11

### Changed

- Updated `buildURIFragment` test to use `URLSearchParams` and `updateParams` instead of direct `encodeURIComponent` usage
- Improved test coverage and reliability

## [0.1.3] - 2025-05-07

### Added

- Added `sessionId` parameter to support session tracking:
  - Added to `buildParams` to extract session ID from URL parameters
  - Added to `handleAppDelegation` for delegation chain handling
  - Added to `buildURIFragment` to include session ID in URI fragment
  - Added to `setupLoginButtonHandler` for complete session tracking flow

## [0.1.2] - 2025-05-03

### Added

- Added `ttlMs` parameter to `setupLoginButtonHandler` to control authentication expiration time

### Changed

- Updated peer dependencies to include `expo-icp-frontend-helpers`

## [0.1.1] - 2025-04-25

### Changed

- Consolidated delegation handling functions:
  - Merged `handleNativeAppDelegation` and `sendDelegationToParent` into a single `handleAppDelegation` function
  - `handleAppDelegation` now handles both native app and web browser scenarios

## [0.1.0] - 2025-04-25

### Added

- Initial release of the II Integration Helpers library
- Core functions for II integration:
  - `buildParams`: Builds parameters for II integration
  - `buildIIUri`: Builds the Internet Identity URI
  - `buildAppPublicKey`: Converts a hex string to a PublicKey
  - `buildDelegationString`: Converts a DelegationChain to a string
  - `buildMiddleToAppDelegationChain`: Creates a delegation chain
  - `buildURIFragment`: Builds a URI fragment for delegation
- Authentication functions:
  - `prepareLogin`: Prepares the login process
  - `setupLoginButtonHandler`: Sets up the login button handler
- Delegation return functions:
  - `handleNativeAppDelegation`: Returns delegation chain to native app
  - `sendDelegationToParent`: Returns delegation chain to parent window
- UI functions:
  - `prepareButtons`: Prepares and validates UI buttons
  - `renderError`: Renders error messages
  - `formatError`: Formats error messages
