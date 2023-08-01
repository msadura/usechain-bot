import parseArgs from 'minimist';

type SupportedArgs = {
  amount?: string | number;
  to?: string;
  chain?: number | string;
};

export function getScriptArgs() {
  const args = parseArgs(process.argv.slice(2));
  console.log('🔥', process.argv.slice(2));
  return args as SupportedArgs;
}
