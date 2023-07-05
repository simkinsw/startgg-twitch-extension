import { Buffer } from 'buffer';
import { gzip, inflate } from 'pako';
import { DataActionObjects, TransferState } from '../redux/data';
import { Dispatch, PayloadAction } from '@reduxjs/toolkit';

const twitch = window.Twitch?.ext;

// Declared at this scope so they can be used during "unlisten" later
let storageEventListener: { (event: StorageEvent): Promise<void>; (this: Window, ev: StorageEvent): any; (this: Window, ev: StorageEvent): any; };
let pubsubEventListener: (_target: string, _contentType: string, body: string) => void;

/* ************ */
/* SENDING DATA */
/* ************ */

const compress = (input: object): string => {
    return Buffer.from(gzip(JSON.stringify(input)).buffer).toString('base64');
}

// Store complete state
export const setConfig = (body: TransferState) => {
    const message: string = compress(body);

    if (twitch) {
        twitch.configuration.set("broadcaster", "1", message);
    }
    if (process.env.NODE_ENV === "development") {
        // Use localStorage as a message bus
        localStorage.removeItem("store");
        localStorage.setItem("store", message);
    }
}

// Send an action to the user
export const sendConfigUpdate = <T>(body: PayloadAction<T>) => {

    const message: string = compress(body);

    if (twitch) {
        twitch.send("broadcast", "text/plain", message);
    };

    if (process.env.NODE_ENV === "development") {
        // Use localStorage as a message bus
        // Force it to reprocess every time
        localStorage.removeItem("message");
        localStorage.setItem("message", message);
    }
}

/* ************** */
/* RECEIVING DATA */
/* ************** */

const decompress = <T>(input: string): T => {
    return JSON.parse(inflate(Buffer.from(input, 'base64'), { to: 'string'}));
}

// Store complete state
export const getConfig = (handleConfig: (input: TransferState) => void) => {

    // Config from Twitch ConfigStore
    twitch.configuration.onChanged(() => {
        if (twitch.configuration.broadcaster) {
            handleConfig(decompress(twitch.configuration.broadcaster.content));
        }
    });

    // Config from localStorage
    if (process.env.NODE_ENV === "development") {
        // Use localStorage as a message bus
        const store: string = localStorage.getItem("store") || "";
        if (store) {
            handleConfig(decompress(store));
        }
    }
}

export const listenConfigUpdate = (handleUpdate: Dispatch<DataActionObjects>) => {
    if (process.env.NODE_ENV === "development") {
        storageEventListener = async (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === "message" && event.newValue) {
                if (event.newValue !== null) {
                    handleUpdate(decompress<DataActionObjects>(event.newValue));
                }
            }
        };

        window.addEventListener('storage', storageEventListener);
        return;
    }

    if (twitch) {
        pubsubEventListener = (_target: string, _contentType: string, body: string) => {
            handleUpdate(decompress<DataActionObjects>(body));
        }
        twitch.listen("broadcast", pubsubEventListener);
    }
}

export const unlistenConfigUpdate = () => {
    if (process.env.NODE_ENV === "development") {
        window.removeEventListener('storage', storageEventListener);
        return;
    }

    if (twitch) {
        twitch.unlisten("broadcast", pubsubEventListener);
    }
}