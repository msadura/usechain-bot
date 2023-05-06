import { wait } from '@app/utils/wait';
import { BigNumber, ethers, Wallet } from 'ethers';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import CamelotAbi from './abi/camelot.json';
import { formatUnits } from 'ethers/lib/utils';
import { isTokenApproved } from '@app/trade/utils';
import { TradeAsset } from '@app/types';
import { MAX_APPROVE_AMOUNT } from '@app/constants';
import { USDC } from '@app/arbitrum/constants';
import { TransactionResponse } from 'zksync-web3/build/src/types';

type Config = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
  swapRouterAddress: string;
  wethAddress: string;
};

type Params = {
  signer: Wallet;
} & Config;

export const CamelotTrade = async ({
  assetIn,
  assetOut,
  signer,
  swapRouterAddress,
  wethAddress
}: Params) => {
  const isETHIn = assetIn.address === wethAddress;

  const swapRouterContract = new ethers.Contract(swapRouterAddress, CamelotAbi, signer);
  const tokenInContract = new ethers.Contract(assetIn.address, ERC20ABI, signer);

  const inBalancePromise: Promise<BigNumber> = isETHIn
    ? signer.getBalance()
    : tokenInContract.balanceOf(signer.address);
  const inBalance: BigNumber = await inBalancePromise;
  console.log(`🔥 ${assetIn.name} balance: `, formatUnits(inBalance, assetIn.decimals));

  const amountIn = isETHIn ? inBalance.div(100).mul(80) : inBalance;
  console.log(`🔥 ${assetIn.name} sell amount: `, formatUnits(amountIn, assetIn.decimals));

  const minOut = 0;
  // grail routes through USDC
  const path = [assetIn.address, assetOut.address];
  const recipient = signer.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10min

  const amountsOut = await swapRouterContract.getAmountsOut(amountIn, path);
  const amountOut = [...amountsOut].pop().div(100).mul(90); // max 5% slippage

  let tradeTx: TransactionResponse | null = null;
  if (isETHIn) {
    console.log('🔥', 'Selling eth');
    tradeTx = await swapRouterContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
      amountOut,
      path,
      recipient,
      '0x7d3019a42Dc5729852F643f540170a27727c7C80', // referrer
      deadline,
      {
        value: amountIn
        // gasLimit: ethers.utils.hexlify(1000000)
      }
    );
  } else {
    const isApproved = await isTokenApproved({
      tokenContract: tokenInContract,
      amount: amountIn,
      spender: swapRouterAddress,
      owner: signer.address
    });

    if (!isApproved) {
      console.log('🔥', `Approving token - ${assetIn.name}`);
      const approvalTx = await tokenInContract.approve(swapRouterAddress, MAX_APPROVE_AMOUNT);
      await approvalTx.wait();
    }

    console.log('🔥', `Selling token - ${assetIn.name}`);
    tradeTx = await swapRouterContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountIn,
      minOut,
      path,
      recipient,
      '0x7d3019a42Dc5729852F643f540170a27727c7C80',
      deadline,
      {
        // gasLimit: ethers.utils.hexlify(1000000)
      }
    );
  }

  if (tradeTx) {
    await tradeTx?.wait();
  } else {
    await wait(5000);
  }

  console.log('------ EOT ------');

  return true;
};

export const getCamelotAction = (config: Config) => {
  return (signer: Wallet) => CamelotTrade({ ...config, signer });
};
