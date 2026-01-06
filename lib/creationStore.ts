import { kv } from "@vercel/kv";

export type Creation = {
  id: string;
  creator: string;
  imageUrl: string;
  title: string;
  description?: string;
  createdAt: number;
};

export async function saveCreation(c: Creation) {
  await kv.hset(`creation:${c.id}`, c);
  await kv.lpush("creations:all", c.id);
}

export async function getCreation(id: string): Promise<Creation | null> {
  const c = await kv.hgetall<Creation>(`creation:${id}`);
  return c && c.id ? c : null;
}

export async function getRecentCreations(limit = 50) {
  const ids = await kv.lrange<string[]>("creations:all", 0, limit - 1);
  const items = await Promise.all(ids.map((id) => getCreation(id)));
  return items.filter(Boolean) as Creation[];
}
