import { getFundingClient } from '@app/rhinofi/client/getFundingClient';
import { sendEth } from '@app/rhinofi/client/sendEth';

export async function fundAccount({
  address,
  amount
}: {
  address: string;
  amount: string | number;
}) {
  if (!address) {
    throw new Error('No address provided');
  }

  if (!amount) {
    throw new Error('No amount provided');
  }

  const rhinofiFunding = await getFundingClient();

  await sendEth({
    rhinofi: rhinofiFunding,
    amount: amount,
    recipient: address
  });
}
