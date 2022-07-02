import { ethers } from 'ethers';

import { WSS_RPC_URL } from '@app/constants';

let wssProvider: ethers.providers.WebSocketProvider | null;
let retries = 0;
let autoReconnect = true;

export const connectProvider = async (onConnect?: () => void) => {
  try {
    autoReconnect = true;

    if (WSS_RPC_URL) {
      wssProvider = new ethers.providers.WebSocketProvider(WSS_RPC_URL as string);
      console.log('🔥 Ws provider info:', WSS_RPC_URL);
      keepAlive({ onConnect });
      await wssProvider.ready;
    }

    retries = 0;
  } catch (e) {
    console.log('Error while connecting to provider.');
    console.log('🔥', e);

    if (retries < 5) {
      retries += 1;
      console.log('🔥', 'Retrying connecting to provider');
      connectProvider(onConnect);
    }
  }
};

type KeepAliveParams = {
  onDisconnect?: (error: Error) => void;
  onConnect?: () => void;
  expectedPongBack?: number;
  checkInterval?: number;
};
const keepAlive = ({
  onDisconnect,
  onConnect,
  expectedPongBack = 15000,
  checkInterval = 7500
}: KeepAliveParams) => {
  let pingTimeout: NodeJS.Timer | null = null;
  let keepAliveInterval: NodeJS.Timer | null = null;

  wssProvider?._websocket.on('open', () => {
    console.log('🔥', 'Sockets connected.');
    onConnect && onConnect();

    keepAliveInterval = setInterval(() => {
      wssProvider?._websocket.ping();

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        wssProvider?._websocket.terminate();
      }, expectedPongBack);
    }, checkInterval);
  });

  wssProvider?._websocket.on('close', (err: Error) => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }

    if (pingTimeout) {
      clearTimeout(pingTimeout);
    }

    wssProvider = null;
    onDisconnect && onDisconnect(err);

    if (autoReconnect) {
      console.log('🔥', 'Sockets disconnected, reconnecting...');
      connectProvider(onConnect);
    }
  });

  wssProvider?._websocket.on('pong', () => {
    if (pingTimeout) {
      clearInterval(pingTimeout);
    }
  });
};

export const disconnectSockets = () => {
  console.log('🔥', 'Manually shutting down sockets.');
  autoReconnect = false;
  try {
    wssProvider?._websocket.terminate();
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const getWssProvider = () => {
  if (!wssProvider) {
    console.log('🔥', 'Trying to use wss provider that is not initialized!');
  }

  return wssProvider;
};

