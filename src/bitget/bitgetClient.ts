import { SpotClient } from 'bitget-api';

const API_KEY = process.env.BITGET_API_KEY as string;
const API_SECRET = process.env.BITGET_API_SECRET as string;
const API_PASS = process.env.BITGET_API_PASS as string;

export const bitgetClient = new SpotClient({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  apiPass: API_PASS
});
