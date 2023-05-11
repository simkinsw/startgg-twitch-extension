export function setLocalStorageItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function clearLocalStorageItem(key: string) {
    localStorage.removeItem(key);
}

export function getLocalStorageItem(key: string): any | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}
