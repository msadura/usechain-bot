import { transferERC20FromWallet } from '@app/utils/transferERC20FromWallet';
import { wait } from '@app/utils/wait';
import { BigNumber, ethers, Wallet } from 'ethers';
import { abi as ERC20ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { TransactionResponse } from 'zksync-web3/build/types';
import { formatUnits } from 'ethers/lib/utils';
import { isTokenApproved } from '@app/trade/utils';
import { TradeAsset } from '@app/types';
import { transferEthFromWallet } from '@app/utils/transferEthFromWallet';

type Config = {
  asset: TradeAsset;
  epsylonContractAddress: string;
};

type Params = {
  signer: Wallet;
  recipient: string;
} & Config;

export const Epsylon = async ({ asset, signer, epsylonContractAddress, recipient }: Params) => {
  const depositContract = new ethers.Contract(
    epsylonContractAddress,
    ['function deposit(uint value) external', 'function withdraw() external'],
    signer
  );
  const assetContract = new ethers.Contract(asset.address, ERC20ABI, signer); //USDC

  const depositBalance: BigNumber = await assetContract.balanceOf(signer.address);
  console.log(`🔥 deposit ${asset.name} balance: `, formatUnits(depositBalance, asset.decimals));

  let tradeTx: TransactionResponse | null = null;

  const isApproved = await isTokenApproved({
    tokenContract: assetContract,
    amount: depositBalance,
    spender: epsylonContractAddress,
    owner: signer.address
  });

  if (!isApproved) {
    console.log('🔥', `Approving ${asset.name} token`);
    const approvalTx = await assetContract.approve(epsylonContractAddress, depositBalance);
    await approvalTx.wait();
  }

  console.log('🔥', 'Depositing...');
  tradeTx = await depositContract.deposit(depositBalance);

  if (tradeTx) {
    await tradeTx?.wait();
  }

  console.log('🔥', 'Waiting a bit...');
  await wait(1000 * 60 * 5);

  console.log('🔥', 'Withdrawing...');
  const txWithdraw = await depositContract.withdraw();
  await txWithdraw.wait();
  await wait(1000 * 10);

  //send ftm
  //send usdc asset
  // next minion address
  await transferERC20FromWallet({ recipient, asset, assetContract, signer });
  await transferEthFromWallet(signer, recipient);

  console.log('------ EOT ------');

  return true;
};

export const getEpsylonAction = (config: Config) => {
  return (signer: Wallet, recipient: string) => Epsylon({ ...config, signer, recipient });
};
