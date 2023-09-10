import { Buffer } from "buffer";
import { gzip, inflate } from "pako";
import { type DataActionObjects, type TransferState } from "../redux/data";
import { type Dispatch, type PayloadAction } from "@reduxjs/toolkit";

const twitch = window.Twitch?.ext;

// Declared at this scope so they can be used during "unlisten" later
let storageEventListener: {
  (event: StorageEvent): void;
  (this: Window, ev: StorageEvent): any;
  (this: Window, ev: StorageEvent): any;
};
let pubsubEventListener: (
  _target: string,
  _contentType: string,
  body: string,
) => void;

/* ************ */
/* SENDING DATA */
/* ************ */

const compress = (input: object): string => {
  return Buffer.from(gzip(JSON.stringify(input)).buffer).toString("base64");
};

// Store complete state
export const setConfig = (body: TransferState): void => {
  const message: string = compress(body);

  if (twitch !== undefined) {
    twitch.configuration.set("broadcaster", "1", message);
  }
  if (process.env.NODE_ENV === "development") {
    // Use localStorage as a message bus
    localStorage.removeItem("store");
    localStorage.setItem("store", message);
  }
};

// Send an action to the user
export const sendConfigUpdate = <T>(body: PayloadAction<T>): void => {
  const message: string = compress(body);

  if (twitch !== undefined) {
    twitch.send("broadcast", "text/plain", message);
  }

  if (process.env.NODE_ENV === "development") {
    // Use localStorage as a message bus
    // Force it to reprocess every time
    localStorage.removeItem("message");
    localStorage.setItem("message", message);
  }
};

/* ************** */
/* RECEIVING DATA */
/* ************** */

export const decompress = <T>(input: string): T => {
  return JSON.parse(inflate(Buffer.from(input, "base64"), { to: "string" }));
};

export const listenConfigUpdate = (
  handleUpdate: Dispatch<DataActionObjects>,
): void => {
  if (process.env.NODE_ENV === "development") {
    storageEventListener = (event: StorageEvent) => {
      if (
        event.storageArea === localStorage &&
        event.key === "message" &&
        event.newValue !== null
      ) {
        if (event.newValue !== null) {
          handleUpdate(decompress<DataActionObjects>(event.newValue));
        }
      }
    };

    window.addEventListener("storage", storageEventListener);
    return;
  }

  if (twitch !== undefined) {
    pubsubEventListener = (
      _target: string,
      _contentType: string,
      body: string,
    ) => {
      handleUpdate(decompress<DataActionObjects>(body));
    };
    twitch.listen("broadcast", pubsubEventListener);
  }
};

export const unlistenConfigUpdate = (): void => {
  if (process.env.NODE_ENV === "development") {
    window.removeEventListener("storage", storageEventListener);
    return;
  }

  if (twitch !== undefined) {
    twitch.unlisten("broadcast", pubsubEventListener);
  }
};
