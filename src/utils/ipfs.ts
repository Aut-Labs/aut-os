import { environment } from "@api/environment";

export const isValidUrl = (uri: string) => {
  let url = null as any;
  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }
  return (
    url.protocol === "ipfs:" ||
    url.protocol === "http:" ||
    url.protocol === "https:"
  );
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  if (!url || typeof url !== "string") {
    return url;
  }
  if (!url.includes("https://"))
    return isJson
      ? `${environment.ipfsGatewayUrl}/${replaceAll(
          url,
          "ipfs://",
          ""
        )}/metadata.json`
      : `${environment.ipfsGatewayUrl}/${replaceAll(url, "ipfs://", "")}`;
  return url;
}

export function httpUrlToIpfsCID(url: string) {
  if (!url) {
    return url;
  }

  if (typeof url === "object") {
    url = "";
  }
  if (url.includes("https://")) {
    const notHttpsUrl = `${replaceAll(url, "https://", "")}`;
    const [_, __, cid, name] = notHttpsUrl.split("/");
    if (name) {
      return `ipfs://${cid}/${name}`;
    }
    return `ipfs://${cid}`;
  }
  return url;
}
