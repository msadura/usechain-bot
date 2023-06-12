import * as ipfsClient from 'ipfs-http-client';

const projectId = process.env.INFURE_IPFS_API_KEY as string;
const projectSecret = process.env.INFURE_IPFS_API_SECRET as string;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

export async function uploadMetadataToIpfs(content: string) {
  const { cid } = await client.add(content);

  const res = { hash: cid.toString(), uri: `ipfs://${cid.toString()}` };

  return res;
}
