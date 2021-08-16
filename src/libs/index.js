import zbase32 from "zbase32";
import NodeRSA from "node-rsa";
import crypto from "crypto";

// Copy given data to clipboard
export const copyDataToClipboard = (value) => {
  navigator.clipboard.writeText(value);
};

export const generateUrl = (id, incrementNumber, host) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const increment = Number(incrementNumber);
  const arr = new ArrayBuffer(8);
  const view = new DataView(arr);
  view.setUint32(0, timestamp, false);
  view.setUint32(4, increment, false);
  const random = arr;
  const encodedTimestamp = zbase32.encode(random);
  const url = `${id}${encodedTimestamp}.${host}`;
  return url;
};

export const poll = async (correlationId, secretKey, host) => {
  const data = await fetch(
    `https://${host}/poll?id=${correlationId}&secret=${secretKey}`
  )
    .then((res) => res.json())
    .then((res) => res);
  return data;
};

export const decryptAESKey = (privateKey, polledData) => {
  const key = new NodeRSA({ b: 2048 });
  key.setOptions({
    environment: "browser",
    encryptionScheme: {
      hash: "sha256",
    },
  });
  key.importKey(privateKey, "pkcs8-private");
  return key.decrypt(polledData.aes_key, "base64");
};

export const processData = (aesKey, polledData) => {
  let parsedData;
  if (polledData.data?.length !== 0) {
    const decryptedData = polledData.data?.map((item) => {
      const iv = Buffer.from(item, "base64").slice(0, 16);
      const decipher = crypto.createDecipheriv("aes-256-cfb", aesKey, iv);
      let mystr = decipher.update(
        Buffer.from(item, "base64", "utf8").slice(16)
      );
      mystr += decipher.final("utf8");
      return mystr;
    });
    parsedData = decryptedData?.map((item) => JSON.parse(item));
  }
  return parsedData;
};

export const setToLocalStorage = (data) => {
  Object.entries(data).map((item) => {
    localStorage.setItem(item[0], item[1]);
  });
};

export const register = async (publicKey, secretKey, correlationId) => {
  const registerFetcherOptions = {
    "public-key": btoa(publicKey),
    "secret-key": secretKey,
    "correlation-id": correlationId,
  };

  const response = await fetch(
    `https://${localStorage.getItem("host")}/register`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(registerFetcherOptions),
    }
  );
  return response;
};
