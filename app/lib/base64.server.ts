function toBase64Url(base64: string): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "===".slice((base64.length + 3) % 4);
    return base64 + padding;
}

export function base64UrlEncode(input: string): string {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(input, "utf-8").toString("base64url");
    }

    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return toBase64Url(btoa(binary));
}

export function base64UrlDecode(input: string): string {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(input, "base64url").toString("utf-8");
    }

    const binary = atob(fromBase64Url(input));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
