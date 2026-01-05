import { createCoin } from '@zoralabs/coins-sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const adminAccount = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
const client = createWalletClient({
    account: adminAccount,
    chain: base,
    transport: http()
});

export async function launchToken(userAddress: string, name: string, ticker: string, imageIpfs: string) {
    console.log(`🚀 Launching BaseMint Token for ${userAddress}...`);

    const { parameters } = await createCoin({
        creator: userAddress as `0x${string}`,
        payoutRecipient: userAddress as `0x${string}`,
        name: name,
        symbol: ticker,
        uri: imageIpfs,
        platformReferrer: process.env.NEXT_PUBLIC_PLATFORM_WALLET as `0x${string}`, 
        chainId: 8453
    });

    const txHash = await client.writeContract(parameters);
    
    return {
        success: true,
        txHash: txHash,
        link: `https://zora.co/coin/base:${txHash}`
    };
}