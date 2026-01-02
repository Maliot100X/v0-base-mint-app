"use client"
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { ProfileTab } from "@/components/ProfileTab";

export default function Home() {
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const ctx = await sdk.context;
      setContext(ctx);
      await sdk.actions.ready();
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <ProfileTab userContext={context} />
    </main>
  );
}