import { wait } from '@app/utils/wait';
import { BigNumber, ethers, Wallet } from 'ethers';
import UniswapV2RouterABI from '@app/trade/uniswap/abi/UniswapV2SwapRouter02.json';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { TransactionResponse } from 'zksync-web3/build/types';
import { formatUnits } from 'ethers/lib/utils';
import { isTokenApproved } from '@app/trade/utils';
import { TradeAsset } from '@app/types';

type SushiConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
  swapRouterAddress: string;
  wethAddress: string;
};

type Params = {
  signer: Wallet;
} & SushiConfig;

export const V2SwapRouter = async ({
  assetIn,
  assetOut,
  signer,
  swapRouterAddress,
  wethAddress
}: Params) => {
  const isETHIn = assetIn.address === wethAddress;

  const swapRouterContract = new ethers.Contract(swapRouterAddress, UniswapV2RouterABI, signer);
  const tokenInContract = new ethers.Contract(assetIn.address, ERC20ABI, signer);
  const tokenOutContract = new ethers.Contract(assetOut.address, ERC20ABI, signer);

  const inBalancePromise: Promise<BigNumber> = isETHIn
    ? signer.getBalance()
    : tokenInContract.balanceOf(signer.address);
  const inBalance: BigNumber = await inBalancePromise;
  console.log(`🔥 ${assetIn.name} balance: `, formatUnits(inBalance, assetIn.decimals));

  const amountIn = isETHIn ? inBalance.div(100).mul(80) : inBalance;
  console.log(`🔥 ${assetIn.name} sell amount: `, formatUnits(amountIn, assetIn.decimals));

  const minOut = 0;
  const path = [assetIn.address, assetOut.address];
  const recipient = signer.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10min

  let tradeTx: TransactionResponse | null = null;
  if (isETHIn) {
    console.log('🔥', 'Selling eth');
    tradeTx = await swapRouterContract.swapExactETHForTokens(minOut, path, recipient, deadline, {
      value: amountIn,
      gasLimit: ethers.utils.hexlify(1000000)
    });
  } else {
    const isApproved = await isTokenApproved({
      tokenContract: tokenInContract,
      amount: amountIn,
      spender: swapRouterAddress,
      owner: signer.address
    });

    if (!isApproved) {
      console.log('🔥', 'Approving token');
      const approvalTx = await tokenInContract.approve(swapRouterAddress, amountIn);
      await approvalTx.wait();
    }

    console.log('🔥', 'Seling token');
    tradeTx = await swapRouterContract.swapExactTokensForETH(
      amountIn,
      minOut,
      path,
      recipient,
      deadline,
      {
        gasLimit: ethers.utils.hexlify(1000000)
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

export const getV2SwapRouterAction = (config: SushiConfig) => {
  return (signer: Wallet) => V2SwapRouter({ ...config, signer });
};
