import parseArgs from 'minimist';

type SupportedArgs = {
  amount?: string | number;
};

export function getScriptArgs() {
  const args = parseArgs(process.argv.slice(2));

  return args as SupportedArgs;
}
