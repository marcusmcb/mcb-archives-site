import { NextResponse } from "next/server";

import { getUpvotesForShow, upvoteShowOnce } from "../../../../../lib/votes";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const upvotes = await getUpvotesForShow(id);
  return NextResponse.json({ showId: id, upvotes });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const deviceId = req.headers.get("x-device-id")?.trim();
  if (!deviceId) {
    return NextResponse.json({ error: "missing_device_id" }, { status: 400 });
  }

  const result = await upvoteShowOnce({ showId: id, deviceId });
  return NextResponse.json(result);
}
