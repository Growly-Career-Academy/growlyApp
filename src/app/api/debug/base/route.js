export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      base: process.env.NEXT_PUBLIC_API_BASE || null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
