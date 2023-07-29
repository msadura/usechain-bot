import '@app/init';
import { getMinions } from '@app/minions/minions';

export async function action() {
  const minions = getMinions();

  const addressBook = minions
    .map(minion => `${minion.address}, ${process.env.MINIONS_FILE_NAME}_${minion.id}`)
    .join('\n');

  console.log(addressBook);
}

action();
