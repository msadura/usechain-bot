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

  2) Send manually ETH to first minion account

  3) Uncomment activvate action to active generated minions

  // activateArbitrumAccounts();
  
  run `yarn start`

  4) ETH will stay on last minion and you gan send it back manually by importing last minion to your MM

