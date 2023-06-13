import '@app/init';
import { generateMinions } from '@app/minions/minions';

import * as readline from 'readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function action() {
  const num = await rl.question(`How many minions do you want to generate? `);

  if (Number(num) > 0) {
    generateMinions(Number(num));
  }

  rl.close();
}

action();
