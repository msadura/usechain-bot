import '../init';
import { generateMinions } from '@app/minions/minions';

import readline from 'readline';

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function action() {
  input.question(`How many minions do you want to generate? `, async num => {
    if (Number(num) > 0) {
      await generateMinions(Number(num));
    }

    input.close();
  });
}

action();
