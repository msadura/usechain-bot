import { getMinionByAddress } from '@app/minions/minions';
import { generateMetadata } from '@app/mintsquare/generateMetadata';
import { uploadMetadataToIpfs } from '@app/mintsquare/uploadMetadataToIpfs';
import { Contract, Wallet } from 'zksync-web3';

type Params = {
  wallet: Wallet;
};

const MINTSQUARE_CONTRACT = '0x53eC17BD635F7A54B3551E76Fd53Db8881028fC3';

export async function mint({ wallet }: Params) {
  const abi = ['function mint(string memory uri) public'];
  const mintSquareContract = new Contract(MINTSQUARE_CONTRACT, abi, wallet);

  const minion = getMinionByAddress(wallet.address);
  if (!minion) {
    return;
  }

  const metadata = generateMetadata(minion.id);
  const metadataJson = JSON.stringify(metadata, null, 4);

  const { uri } = await uploadMetadataToIpfs(metadataJson);

  console.log('🔥', 'Minting...');
  await mintSquareContract.mint(uri);
  console.log('🔥', 'NFT minted!');
}
