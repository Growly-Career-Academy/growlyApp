// src/app/api/debug/cookies/route.js
import { cookies } from "next/headers";

export async function GET() {
  const list = cookies().getAll().map(c => ({
    name: c.name,
    hasValue: Boolean(c.value),
    path: c.path,
  }));
  return new Response(JSON.stringify(list, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
