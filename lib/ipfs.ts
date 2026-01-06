export function resolveIpfs(url?: string | null): string {
  if (!url) return "";
  if (!url.startsWith("ipfs://")) return url;
  return `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`;
}
