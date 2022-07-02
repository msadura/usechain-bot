##How to use

- [] `yarn install`
- [] create `.env` file with variables:

```
RPC_URL=DESIRED_NETWORK_RPC_URL (recommended provider - infura.io)
```

Open index.ts:

  1) Uncomment and run once to generate file with accounts

  // generateMinions(20);

  run `yarn start`

  Minions are generated under `/src/minions` dir, you can configure filename by setting `MINIONS_FILE_NAME` in `src/constants.ts`

  2) Send manually ETH to first minion account

  3) Uncomment activvate action to active generated minions

  // activateArbitrumAccounts();

  run `yarn start`

  4) You can send back ETH to desired address by running:

  // sendEthFromMinion(mnemonic, recipient);

