import { Attribute } from "@/types";

const sleep = (n: number) => {
  return new Promise((resolve) => setTimeout(resolve, n));
};

function intToHex(string: string) {
  let hex = Number(string).toString(16);
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  return hex;
}

function stringToHex(string: string) {
  return string
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function decodeBase64(encodedString: string): string {
  return Buffer.from(encodedString, 'base64').toString('utf8');
}

function parseAttributes(attributesString: string): Attribute[] {
  return attributesString.split(';').map(attr => {
      const [trait_type, value] = attr.split(':');
      return { trait_type, value };
  });
}
const strToHex = (str: string): string => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  if (result.length % 2 !== 0) {
    result = `0${result}`;
  }
  return result;
};

function formatMultiEsdtData(nft: any, raw_ticker: any) {
  const ticker = strToHex(raw_ticker);
  const toSend = intToHex(nft.length.toString());
  let data = toSend;
  nft.forEach(function (nft: any) {
    const quantity = "01";
    const nonce = intToHex(nft.nonce);
    data = `${data}@${ticker}@${nonce}@${quantity}`;
  });
  return data;
}

export { sleep, intToHex, stringToHex, decodeBase64, parseAttributes, formatMultiEsdtData };
