import { Buffer } from 'buffer';
import { gzip, inflate } from 'pako';
import { DataState, initialData } from '../redux/data';

const twitch = window.Twitch?.ext;

export interface Message<T> { type: T }
export interface StateMessage<F extends keyof DataState> extends Message<F> {
    type: F,
    data: DataState[F]
}

type MessageHandler<ParentType extends Record<string, any>> = {
  [K in keyof ParentType]: (payload: ParentType[K]) => void;
};
export type StateMessageHandler = MessageHandler<DataState>;

let storageEventListener: { (event: StorageEvent): Promise<void>; (this: Window, ev: StorageEvent): any; (this: Window, ev: StorageEvent): any; };
let pubsubEventListener: (_target: string, _contentType: string, body: string) => void;

/* ************ */
/* SENDING DATA */
/* ************ */

export function createStateMessage<F extends keyof DataState>(type: F, input: DataState[F]): StateMessage<F> {
    return {
        type: type,
        data: input
    }
}

const compress = (input: object): string => {
    return Buffer.from(gzip(JSON.stringify(input)).buffer).toString('base64');
}

// Store complete state
export const setConfig = (body: DataState) => {
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

// Send partial state (a top level field of DataState) to app
export const sendConfigUpdate = <T extends keyof DataState>(body: StateMessage<T>) => {

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

type ConfigHandler = (input: DataState) => void;

// Store complete state
export const getConfig = (handleConfig: ConfigHandler) => {

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

const handleMessage = (handler: StateMessageHandler, message: Message<string>): void => {
    if (!(message.type in initialData)) {
        console.log(message.type, "not in initialData");
        return
    }
    const stateMessageType = message.type as keyof DataState;
    switch (stateMessageType) {
        case "sets":
            handler.sets((message as StateMessage<"sets">).data);
            break;
        case "startGGEvent":
            handler.startGGEvent((message as StateMessage<"startGGEvent">).data);
            break;
        default:
            const unreachable: never = stateMessageType;
            break;
    }
}

const localStorageEventHandler = (handler: StateMessageHandler) => async (event: StorageEvent) => {
    if (event.storageArea === localStorage && event.key === "message" && event.newValue) {
        if (event.newValue !== null) {
            handleMessage(handler, decompress(event.newValue));
        }
    }
}

const pubsubEventHandler = (handler: StateMessageHandler) => (_target: string, _contentType: string, body: string) => {
    handleMessage(handler, decompress(body));
};

export const listenConfigUpdate = (handleUpdate: StateMessageHandler) => {
    if (process.env.NODE_ENV === "development") {
        storageEventListener = localStorageEventHandler(handleUpdate);
        window.addEventListener('storage', storageEventListener);
        return;
    }

    if (twitch) {
        pubsubEventListener = pubsubEventHandler(handleUpdate);
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