import crypto from "crypto";

import format from "date-fns/format";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as J from "fp-ts/Json";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import downloadData from "js-file-download";
import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";
import xid from "xid-js";
import zbase32 from "zbase32";

import { Data, StoredData } from "./localStorage";
import Tab from "./types/tab";

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
  }

  return parsedData;
};

const getData = (key: string) =>
  pipe(
    O.tryCatch(() => localStorage.getItem(key)),
    O.chain(O.fromNullable)
  );

export const handleDataExport = () => {
  const values = pipe(
    R.mapWithIndex((key) => ({ key, data: getData(key) }))(localStorage),
    R.filterMap((x) => x.data),
    J.stringify,
    E.getOrElse(() => "An error occured") // TODO: Handle error case.
  );

  const fileName = `${format(Date.now(), "yyyy-mm-dd_hh:mm")}.json`;
  downloadData(values, fileName);
};

export const generateRegistrationParams = () => {
  const key = new NodeRSA({ b: 2048 });
  const pub = key.exportKey("pkcs8-public-pem");
  const priv = key.exportKey("pkcs8-private-pem");
  const correlation = xid.next();
  const secret = uuidv4().toString();

  return { pub, priv, correlation, secret };
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

export const registert = (storedData: StoredData, token?: string) => {
  const { pub, priv, correlation, secret } = generateRegistrationParams();
  const registerFetcherOptions = {
    "public-key": btoa(pub),
    "secret-key": secret,
    "correlation-id": correlation,
  };
  const headers = [
    { "Content-Type": "application/json" },
    {
      "Content-Type": "application/json",
      Authorization: token,
    },
  ] as const;

  return fetch(`https://${storedData.host}/register`, {
    method: "POST",
    cache: "no-cache",
    headers: token && token !== "" ? headers[1] : headers[0],
    referrerPolicy: "no-referrer",
    body: JSON.stringify(registerFetcherOptions),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const { url, uniqueId } = generateUrl(correlation, 1, storedData.host);
    const tabData: Tab[] = [
      {
        "unique-id": uniqueId,
        correlationId: correlation,
        name: (1).toString(),
        url,
        note: "",
      },
    ];
    const data: StoredData = {
      privateKey: priv,
      publicKey: pub,
      correlationId: correlation,
      secretKey: secret,
      view: storedData.view,
      theme: storedData.theme,
      host: storedData.host,
      increment: 1,
      token: token || "",
      tabs: tabData,
      selectedTab: tabData[0],
      data: [],
      aesKey: "",
      notes: [],
      filter: {
        dns: true,
        http: true,
        smtp: true,
      },
    };
    clearIntervals();
    return data;
  });
};

export const deregister = (
  secretKey: string,
  correlationId: string,
  host: string,
  token?: string
) => {
  const registerFetcherOptions = {
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

  return fetch(`https://${host}/deregister`, {
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
      return "DeRegistered successfully.";
    })
    .then((data) => data);
};
