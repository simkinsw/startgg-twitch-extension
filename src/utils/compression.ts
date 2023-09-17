import { Buffer } from "buffer";
import { gzip, inflate } from "pako";

export const compress = <T>(input: T): string => {
  return Buffer.from(gzip(JSON.stringify(input)).buffer).toString("base64");
};

export const decompress = <T>(input: string): T => {
  return JSON.parse(inflate(Buffer.from(input, "base64"), { to: "string" }));
};
