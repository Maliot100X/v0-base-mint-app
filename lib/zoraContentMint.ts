import { Address, encodeFunctionData } from "viem";

/**
 * Zora Creator ERC-721 (Base mainnet)
 * This is the REAL content mint.
 */
export const ZORA_CREATOR_ERC721 =
  "0xF74B146ce44CC162b601deC3BE331784DB111DC1"; // Zora Creator (Base)

const ABI = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      { name: "to", type: "address" },
      { name: "quantity", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
    outputs: [],
  },
];

export function prepareZoraContentMint(input: {
  creator: Address;
  metadataUri: string; // ipfs://CID
}) {
  return {
    to: ZORA_CREATOR_ERC721,
    data: encodeFunctionData({
      abi: ABI,
      functionName: "mint",
      args: [input.creator, 1n, input.metadataUri],
    }),
    value: 0n,
  };
}
