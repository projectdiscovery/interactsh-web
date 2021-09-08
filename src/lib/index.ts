import crypto from "crypto";

import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";
import zbase32 from "zbase32";

import { Data } from "./localStorage";

export const copyDataToClipboard = (data: string) => navigator.clipboard.writeText(data);

export const generateUrl = (correlationId: string, incrementNumber: number, host: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const increment = incrementNumber;
  const arr = new ArrayBuffer(8);
  const view = new DataView(arr);
  view.setUint32(0, timestamp, false);
  view.setUint32(4, increment, false);
  const encodedTimestamp = zbase32.encode(arr);
  const url = `${correlationId}${encodedTimestamp}.${host}`;
  const uniqueId = `${correlationId}${encodedTimestamp}`;
  return { url, uniqueId };
};

export const clearIntervals = () => {
  const currentTimeoutId = setTimeout(() => {
    let id = Number(currentTimeoutId);
    for (id; id > 0; id -= 1) {
      window.clearInterval(id);
    }
  }, 11);
};

interface PolledData {
  aes_key: string;
  data: string[];
}

export const poll = (
  correlationId: string,
  secretKey: string,
  host: string,
  token: string
): Promise<PolledData> => {
  const headers = {
    Authorization: token,
  };
  return fetch(`https://${host}/poll?id=${correlationId}&secret=${secretKey}`, {
    method: "GET",
    cache: "no-cache",
    headers: token !== "" ? headers : {},
    referrerPolicy: "no-referrer",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => data);
};

export const decryptAESKey = (privateKey: string, aesKey: string) => {
  const key = new NodeRSA({ b: 2048 });
  key.setOptions({
    environment: "browser",
    encryptionScheme: {
      hash: "sha256",
      scheme: "pkcs1_oaep", // TODO: Ensure that this is correct.
    },
  });
  key.importKey(privateKey, "pkcs8-private");
  return key.decrypt(aesKey, "base64");
};

export const processData = (aesKey: string, polledData: PolledData) => {
  const { data } = polledData;
  let parsedData: Data[] = [];
  if (data.length > 0) {
    const decryptedData: string[] = data.map((item) => {
      const iv = Buffer.from(item, "base64").slice(0, 16);
      const key = Buffer.from(aesKey, "base64");
      const decipher = crypto.createDecipheriv("aes-256-cfb", key, iv);
      let mystr: any = decipher.update(Buffer.from(item, "base64").slice(16));
      mystr += decipher.final("utf8");
      const test: string = mystr;
      return test;
    });
    parsedData = decryptedData.map((item) => ({
      ...JSON.parse(item),
      id: uuidv4(),
    }));
    console.log("parsedData");
    console.log(decryptedData);
  }

  return parsedData;
};

export const register = (
  publicKey: string,
  secretKey: string,
  correlationId: string,
  host: string,
  token?: string
) => {
  const registerFetcherOptions = {
    "public-key": btoa(publicKey),
    "secret-key": secretKey,
    "correlation-id": correlationId,
  };

  const headers = [
    { "Content-Type": "application/json" },
    {
      "Content-Type": "application/json",
      Authorization: token,
    },
  ] as const;

  return fetch(`https://${host}/register`, {
    method: "POST",
    cache: "no-cache",
    headers: token && token !== "" ? headers[1] : headers[0],
    referrerPolicy: "no-referrer",
    body: JSON.stringify(registerFetcherOptions),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return "Registered successfully.";
    })
    .then((data) => data);
};

export const deregister = (secretKey: string, correlationId: string, host: string) => {
  const registerFetcherOptions = {
    "secret-key": secretKey,
    "correlation-id": correlationId,
  };

  return fetch(`https://${host}/deregister`, {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(registerFetcherOptions),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return "DeRegistered successfully.";
    })
    .then((data) => data);
};
