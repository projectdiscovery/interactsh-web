import { format } from 'date-fns';
import downloadData from 'js-file-download';
import NodeRSA from 'node-rsa';
import { v4 as uuidv4 } from 'uuid';

import { generateRandomString } from './utils';
import { getStoredData, writeStoredData, defaultStoredData } from './localStorage';
import { Data } from './types/data';
import { defaultFilter } from './types/filter';
import { StoredData } from './types/storedData';
import { Tab } from './types/tab';

export { getStoredData, writeStoredData, defaultStoredData };
export { copyDataToClipboard } from './clipboard';

export const generateUrl = (
  correlationId: string,
  correlationIdNonceLength: number,
  incrementNumber: number,
  host: string
): { url: string; uniqueId: string } => {
  const randomId = generateRandomString(correlationIdNonceLength);
  const url = `${correlationId}${randomId}.${host}`;
  const uniqueId = `${correlationId}${randomId}`;
  return { url, uniqueId };
};

export const clearIntervals = (): void => {
  const currentTimeoutId = setTimeout(() => {
    let id = Number(currentTimeoutId);
    for (id; id > 0; id -= 1) {
      window.clearInterval(id);
    }
  }, 11);
};

interface PolledData {
  error?: string;
  aes_key: string;
  data: string[];
}

export const decryptAESKey = (privateKey: string, aesKey: string): string => {
  const key = new NodeRSA(privateKey, 'pkcs8-private', {
    environment: 'browser',
    encryptionScheme: {
      hash: 'sha256',
      scheme: 'pkcs1_oaep',
    },
  });
  return key.decrypt(aesKey, 'base64');
};

// Use dynamic import for crypto to handle browser environment
const getCrypto = async () => {
  if (typeof window !== 'undefined') {
    // Browser environment - use crypto-browserify
    const crypto = await import('crypto-browserify');
    return crypto.default || crypto;
  }
  // Node environment
  const crypto = await import('crypto');
  return crypto.default || crypto;
};

export const processData = async (aesKey: string, polledData: PolledData): Promise<Data[]> => {
  const { data } = polledData;
  let parsedData: Data[] = [];

  if (data && data.length > 0) {
    const crypto = await getCrypto();
    const decryptedData: string[] = data.map((item) => {
      const iv = Buffer.from(item, 'base64').slice(0, 16);
      const key = Buffer.from(aesKey, 'base64');
      const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
      let mystr: string = decipher.update(Buffer.from(item, 'base64').slice(16)).toString();
      mystr += decipher.final('utf8');
      return mystr;
    });
    parsedData = decryptedData.map((item) => ({
      ...JSON.parse(item),
      id: uuidv4(),
    }));
  }

  return parsedData;
};

export const handleResponseExport = (item: Data): void => {
  const fileName = `${format(Date.now(), 'yyyy-MM-dd_hh:mm')}_${item.protocol}_${item['remote-address']}_${item['full-id']}_${item.id}.txt`;
  downloadData(item['raw-request'], fileName);
};

export const handleDataExport = (): void => {
  if (typeof window === 'undefined') return;

  const values: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        values[key] = value;
      }
    }
  }

  const fileName = `${format(Date.now(), 'yyyy-MM-dd_hh:mm')}.json`;
  downloadData(JSON.stringify(values), fileName);
};

export const generateRegistrationParams = (correlationIdLength: number) => {
  const key = new NodeRSA({ b: 2048 });
  const pub = key.exportKey('pkcs8-public-pem');
  const priv = key.exportKey('pkcs8-private-pem');
  const correlation = generateRandomString(correlationIdLength, true);
  const secret = uuidv4().toString();

  return { pub, priv, correlation, secret };
};

export const deregister = (
  secretKey: string,
  correlationId: string,
  host: string,
  token?: string
): Promise<Response | void> => {
  const registerFetcherOptions = {
    'secret-key': secretKey,
    'correlation-id': correlationId,
  };

  const headers: Record<string, string> = token && token !== ''
    ? { 'Content-Type': 'application/json', Authorization: token }
    : { 'Content-Type': 'application/json' };

  return fetch(`https://${host}/deregister`, {
    method: 'POST',
    cache: 'no-cache',
    headers,
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(registerFetcherOptions),
  }).catch(() => { });
};

export const register = (
  host: string,
  token: string,
  deregisterCurrentInstance: boolean,
  reregister: boolean
): Promise<StoredData> => {
  const currentData = getStoredData();
  const { pub, priv, correlation, secret } = generateRegistrationParams(
    currentData.correlationIdLength
  );

  const registerFetcherOptions = reregister
    ? {
      'public-key': btoa(currentData.publicKey),
      'secret-key': currentData.secretKey,
      'correlation-id': currentData.correlationId,
    }
    : {
      'public-key': btoa(pub),
      'secret-key': secret,
      'correlation-id': correlation,
    };

  const contentType = { 'Content-Type': 'application/json' };
  const authorizationHeader = { Authorization: token };

  return fetch(`https://${host}/register`, {
    method: 'POST',
    cache: 'no-cache',
    headers: token && token !== '' ? { ...contentType, ...authorizationHeader } : contentType,
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(registerFetcherOptions),
  }).then(async (res) => {
    if (res.status === 401) {
      throw new Error('auth failed');
    }
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error);
    }

    const { url, uniqueId } = generateUrl(
      correlation,
      currentData.correlationIdNonceLength,
      1,
      host
    );

    const tabData: Tab[] = [
      {
        'unique-id': uniqueId,
        correlationId: correlation,
        name: '1',
        url,
        note: '',
      },
    ];

    const data: StoredData = reregister
      ? { ...currentData, aesKey: '', token }
      : {
        privateKey: priv,
        publicKey: pub,
        correlationId: correlation,
        secretKey: secret,
        view: currentData.view,
        theme: currentData.theme,
        host,
        correlationIdLength: currentData.correlationIdLength,
        correlationIdNonceLength: currentData.correlationIdNonceLength,
        responseExport: false,
        increment: 1,
        token,
        telegram: {
          enabled: false,
          botToken: '',
          chatId: '',
        },
        slack: {
          enabled: false,
          hookKey: '',
          channel: '',
        },
        discord: {
          enabled: false,
          webhook: '',
          channel: '',
        },
        tabs: tabData,
        selectedTab: tabData[0],
        data: [],
        aesKey: '',
        notes: [],
        filter: defaultFilter,
      };

    if (!reregister) {
      clearIntervals();
    }
    if (deregisterCurrentInstance && res.ok) {
      deregister(
        currentData.secretKey,
        currentData.correlationId,
        currentData.host,
        currentData.token
      ).then(() => !reregister && typeof window !== 'undefined' && window.location.reload());
    }
    return data;
  });
};

export const poll = (
  correlationId: string,
  secretKey: string,
  host: string,
  token: string,
  handleResetPopupDialogVisibility: () => void,
  handleCustomHostDialogVisibility: () => void
): Promise<PolledData> => {
  const headers: Record<string, string> = token !== '' ? { Authorization: token } : {};

  return fetch(`https://${host}/poll?id=${correlationId}&secret=${secretKey}`, {
    method: 'GET',
    cache: 'no-cache',
    headers,
    referrerPolicy: 'no-referrer',
  })
    .then(async (res) => {
      const status = res.status;
      const getRes = async (): Promise<PolledData> => {
        try {
          return await res.json();
        } catch {
          return { aes_key: '', data: [] };
        }
      };
      const data = await getRes();

      if (!res.ok) {
        const err = data.error;
        if (err === 'could not get interactions: could not get correlation-id from cache') {
          register(host, token, false, true)
            .then((d) => {
              writeStoredData(d);
            })
            .catch((err2) => {
              if (
                err2.message !==
                'could not set id and public key: correlation-id provided is invalid'
              ) {
                clearIntervals();
                handleResetPopupDialogVisibility();
              }
            });
        } else if (
          err ===
          'could not set id and public key: could not read public Key: illegal base64 data at input byte 600'
        ) {
          register(host, token, false, false)
            .then((d) => {
              writeStoredData(d);
            })
            .catch((err2) => {
              if (
                err2.message !==
                'could not set id and public key: correlation-id provided is invalid'
              ) {
                clearIntervals();
                handleResetPopupDialogVisibility();
              }
            });
        } else if (status === 401) {
          handleCustomHostDialogVisibility();
        } else {
          clearIntervals();
          handleResetPopupDialogVisibility();
        }
      }
      return data;
    })
    .then((data) => data);
};
