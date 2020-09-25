# iot-bc-solidity

## Setup

Prerequisits: Truffle, Ganache, npm

1. `npm install`

2. Create a workspace in Truffle

3. Link the `tuffle-config.js` file to the workspace

## Testing

1. Create a branch for that student and switch to it

2. Copy student contract(s) into the relevant folder in `/contracts`

3. Add `.only` to the top level `contract()` test method so only those tests run

4. There will likely be some naming differences between the student contract and the example solution. Make any required adjustments to the "wrapper functions".
The test files are in `/test`.
   
   * These wrapper functions are called by the tests and serve as an "adapter" so the tests can be isolated from these differences. It's also centralizes
   the changes to one place.

5. `truffle console`

6. `test`
