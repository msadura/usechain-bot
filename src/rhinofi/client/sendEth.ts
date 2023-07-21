import { RhinoClient } from '@app/rhinofi/client/getClient';

type SendConfig = {
  amount: number | string;
  recipient: string;
  rhinofi: RhinoClient;
};

export async function sendEth({ amount, recipient, rhinofi }: SendConfig) {
  const transferResponse = await rhinofi.transfer({
    recipientEthAddress: recipient,
    token: 'ETH',
    amount
  });

  return transferResponse;
}
