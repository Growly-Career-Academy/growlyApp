// src/app/api/auth/check-phone/route.js
//
// فرانت ما این رو صدا می‌زنه.
// ما اینجا درخواست رو به بک‌اند اصلی می‌فرستیم:
//   POST {API_BASE}/auth/check-phone/
// با body: { phone }
// و عین جواب بک رو پاس می‌دیم بالا.
// جواب بک (طبق swagger):
//   { registered: boolean, has_password: boolean }

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ message: "phone لازم است" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/check-phone/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone }),
      }
    );

    const text = await upstream.text(); // امن‌تر از json()
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("proxy /api/auth/check-phone error:", err);
    return new Response(
      JSON.stringify({ message: "proxy request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
