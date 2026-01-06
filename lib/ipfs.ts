export function resolveIpfs(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    const cid = url.replace("ipfs://", "");
    // Use Pinata gateway (stable TLS)
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  return url;
}
