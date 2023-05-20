import { Buffer } from 'buffer';
import { gzip, inflate } from 'pako';

export function compress(input: object): string {
    return Buffer.from(gzip(JSON.stringify(input)).buffer).toString('base64');
}

export function decompress<T>(input: string): T {
    return JSON.parse(inflate(Buffer.from(input, 'base64'), { to: 'string'}));
}