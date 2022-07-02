import { getMinions } from '@app/minions/minions';
import { getPoolImmutables, getPoolState, isTokenApproved } from './utils';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as IWETH9 } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/external/IWETH9.sol/IWETH9.json';
import SwapRouterABI from '@app/trade/uniswap/abi/SwapRouter02.json';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { BigNumber, ethers } from 'ethers';
import { getSignerFromMnemonic } from '@app/blockchain/wallet';
import { formatEther } from 'ethers/lib/utils';

const name0 = 'Wrapped Ether';
const symbol0 = 'WETH';
const decimals0 = 18;
const addressWETH = '0xc778417e063141139fce010982780140aa0cd5ab';

const name1 = 'DAI';
const symbol1 = 'DAI';
const decimals1 = 18;
const addressOut = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

// const poolAddress = '0x0f04024bdA15F6e5D48Ed92938654a6449F483ed'; // WETH/DAI
const poolAddress = '0x4D7C363DED4B3b4e1F954494d2Bc3955e49699cC'; // WETH/UNI
const swapRouterAddress = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

const minion = getMinions()[0];

export const uniswap = async () => {
  const signer = getSignerFromMnemonic(minion.mnemonic);

  const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, signer);
  const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, signer);
  const wethContract = new ethers.Contract(addressWETH, IWETH9, signer);
  let wethBalance: BigNumber = await wethContract.balanceOf(signer.address);

  const inputAmount = '0.03';
  const amountIn = ethers.utils.parseUnits(inputAmount, decimals0);
  const approveAmount = ethers.utils.parseUnits('1', decimals0);

  if (wethBalance.lt(amountIn)) {
    const wethToWrap = amountIn.sub(wethBalance);
    console.log('🔥 wrapping ETH:', formatEther(wethToWrap));
    const wrapTx = await wethContract.deposit({ value: wethToWrap });
    await wrapTx.wait();
  }

  wethBalance = await wethContract.balanceOf(signer.address);

  console.log('🔥 wallet balace:', formatEther(wethBalance));

  const immutables = await getPoolImmutables(poolContract);
  const isApproved = await isTokenApproved({
    tokenContract: wethContract,
    amount: approveAmount,
    spender: swapRouterAddress,
    owner: signer.address
  });

  console.log('🔥', isApproved);
  if (!isApproved) {
    console.log('🔥', 'Approving token');
    const approvalTx = await wethContract.approve(swapRouterAddress, approveAmount);
    await approvalTx.wait();
  }

  const params = {
    tokenIn: addressWETH,
    tokenOut: addressOut,
    fee: immutables.fee,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 310,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0
  };
  console.log('🔥', params);

  const swapTx = await swapRouterContract.exactInputSingle(params, {
    gasLimit: ethers.utils.hexlify(1000000)
  });
  const receipt = await swapTx.wait();

  console.log('🔥', receipt);

  // console.log('🔥a', receipt);
};
