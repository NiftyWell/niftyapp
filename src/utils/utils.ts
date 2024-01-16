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

export { sleep, intToHex, stringToHex };
