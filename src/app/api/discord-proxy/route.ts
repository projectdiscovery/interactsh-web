import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for Discord webhook calls.
 *
 * Discord's API does not return CORS headers, so browser-initiated fetch
 * requests to discord.com/discordapp.com are blocked by the Same-Origin
 * policy. This route receives the webhook URL and embed payload from the
 * client, then forwards them to Discord from the server where CORS does
 * not apply.
 */
export async function POST(req: NextRequest) {
  try {
    const { webhook, embeds } = await req.json();

    if (!webhook || !embeds) {
      return NextResponse.json(
        { error: 'Missing webhook or embeds' },
        { status: 400 }
      );
    }

    const pathname = new URL(webhook).pathname;
    const res = await fetch(`https://discord.com${pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });

    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to proxy Discord webhook' },
      { status: 500 }
    );
  }
}
