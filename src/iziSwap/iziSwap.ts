import { getProvider } from '@app/blockchain/provider';
import { TradeAsset } from '@app/types';
import { Wallet } from 'ethers';
import Web3 from 'web3';

import { SwapChainWithExactInputParams } from 'iziswap-sdk/lib/swap/types';
import { QuoterSwapChainWithExactInputParams } from 'iziswap-sdk/lib/quoter/types';
import { getSwapChainWithExactInputCall, getSwapContract } from 'iziswap-sdk/lib/swap/funcs';
import { getQuoterContract, quoterSwapChainWithExactInput } from 'iziswap-sdk/lib/quoter/funcs';
import { BigNumber } from 'bignumber.js';
import { BaseChain } from 'iziswap-sdk/lib/base/types';
import {
  amount2Decimal,
  fetchToken,
  getErc20TokenContract
} from 'iziswap-sdk/lib/base/token/token';
import { WETH_ADDRESS } from '@app/zkSync/constants';
import { isSameAddress } from '@app/utils/isSameAddress';
import { getPercentAmount } from '@app/utils/getPercentAmount';
import { getSwapAssetBalance } from '@app/utils/getSwapAssetBalance';
import { formatUnits } from 'ethers/lib/utils';
import { approveMaxToken } from '@app/utils/approveMaxToken';

const quoterAddresses: Record<number, string> = {
  324: '0x30C089574551516e5F1169C32C6D429C92bf3CD7'
};

const swapAddresses: Record<number, string> = {
  324: '0x943ac2310D9BC703d6AB5e5e76876e212100f894'
};

type SwapConfig = {
  assetIn: TradeAsset;
  assetOut: TradeAsset;
  chainIn: number;
  chainOut?: number;
  amountIn?: string;
};

type Params = {
  wallet: Wallet;
} & SwapConfig;

export async function iziSwap({ assetIn, assetOut, wallet, chainIn, chainOut }: Params) {
  const swapChainIn = chainIn;
  const swapChainOut = chainOut || chainIn;
  // swap 80% of the balance if it is gas asset

  const isETHIn = isSameAddress(assetIn.address, WETH_ADDRESS);
  const assetBalance = await getSwapAssetBalance({
    assetIn,
    signer: wallet,
    wethAddress: WETH_ADDRESS
  });
  const swapAmountIn = isETHIn ? getPercentAmount(assetBalance, 90) : assetBalance;

  if (swapAmountIn.isZero()) {
    throw Error(
      `🔴 Not enough balance - ${formatUnits(assetBalance, assetIn.decimals)} ${assetIn.name} `
    );
  }

  const provider = getProvider(chainIn);
  const rpc = provider.connection.url;
  const privateKey = wallet.privateKey;
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log('address: ', account.address);

  const quoterAddress = quoterAddresses[chainIn];
  const quoterContract = getQuoterContract(quoterAddress, web3);

  console.log('quoter address: ', quoterAddress);

  // TokenInfoFormatted of token 'testA' and token 'testB'
  const testA = await fetchToken(assetIn.address, swapChainIn as unknown as BaseChain, web3);
  const testB = await fetchToken(assetOut.address, swapChainOut as unknown as BaseChain, web3);
  const fee = 2000; // 2000 means 0.2%

  const params = {
    // pay testA to buy testB
    tokenChain: [testA, testB],
    feeChain: [fee],
    inputAmount: swapAmountIn.toString()
  } as QuoterSwapChainWithExactInputParams;

  const { outputAmount } = await quoterSwapChainWithExactInput(quoterContract, params);

  const amountB = outputAmount;
  const amountBDecimal = amount2Decimal(new BigNumber(amountB), testB);

  console.log(' amountA to pay: ', swapAmountIn.toString());
  console.log(' amountB to acquire: ', amountBDecimal);

  const swapAddress = swapAddresses[chainIn];
  const swapContract = getSwapContract(swapAddress, web3);

  // example of swap

  const swapParams = {
    ...params,
    // slippery is 1.5%
    minOutputAmount: new BigNumber(amountB).times(0.985).toFixed(0)
  } as SwapChainWithExactInputParams;

  const gasPrice = await web3.eth.getGasPrice();

  const tokenA = testA;
  const tokenB = testB;
  const tokenAContract = getErc20TokenContract(tokenA.address, web3);
  const tokenBContract = getErc20TokenContract(tokenB.address, web3);

  const tokenABalanceBeforeSwap = await tokenAContract.methods.balanceOf(account.address).call();
  const tokenBBalanceBeforeSwap = await tokenBContract.methods.balanceOf(account.address).call();

  console.log('tokenABalanceBeforeSwap: ', tokenABalanceBeforeSwap);
  console.log('tokenBBalanceBeforeSwap: ', tokenBBalanceBeforeSwap);

  const { swapCalling, options } = getSwapChainWithExactInputCall(
    swapContract,
    account.address,
    chainIn as unknown as BaseChain,
    swapParams,
    gasPrice
  );

  if (!isETHIn) {
    // swap tokens for eth
    await approveMaxToken({
      tokenAddress: assetIn.address,
      amountIn: swapAmountIn,
      signer: wallet,
      spenderAddress: swapAddress
    });
  }

  const gasLimit = await swapCalling.estimateGas(options);
  console.log('gas limit: ', gasLimit);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      ...options,
      to: swapAddress,
      data: swapCalling.encodeABI(),
      gas: new BigNumber(gasLimit * 1.1).toFixed(0, 2)
    },
    privateKey
  );

  if (!signedTx.rawTransaction) {
    throw Error('🔴 Something wrong with the iziSwap transaction');
  }

  const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('tx: ', tx);

  const tokenABalanceAfterSwap = await tokenAContract.methods.balanceOf(account.address).call();
  const tokenBBalanceAfterSwap = await tokenBContract.methods.balanceOf(account.address).call();

  console.log('tokenABalanceAfterSwap: ', tokenABalanceAfterSwap);
  console.log('tokenBBalanceAfterSwap: ', tokenBBalanceAfterSwap);

  console.log(
    'payed A: ',
    new BigNumber(tokenABalanceBeforeSwap.toString())
      .minus(tokenABalanceAfterSwap.toString())
      .toFixed(0)
  );
  console.log(
    'acquired B: ',
    new BigNumber(tokenBBalanceAfterSwap.toString())
      .minus(tokenBBalanceBeforeSwap.toString())
      .toFixed(0)
  );
}
