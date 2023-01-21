import { ActivateAction } from '@app/actions/types/index';
import { activateAccounts } from '@app/actions/activateAccounts';
import { getEpsylonAction } from '@app/fantom/epsylon/epsylonAction';
import { EPSYLON_ADDRESS, USDC } from '@app/fantom/epsylon/constants';

export const getEpsylonActions = (): ActivateAction[] => {
  const useEpsilon = getEpsylonAction({
    asset: USDC,
    epsylonContractAddress: EPSYLON_ADDRESS
  });

  return [useEpsilon];
};

export const activateEpsylonFTMAccounts = async () => {
  const actions = getEpsylonActions();

  await activateAccounts(actions, { skipPostAction: true });
};
