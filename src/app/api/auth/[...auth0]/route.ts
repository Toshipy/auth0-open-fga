import { NextRequest, NextResponse } from 'next/server';

// 互換のため、/api/auth/* へのアクセスを /auth/* に転送
export async function GET(
  request: NextRequest,
  { params }: { params: { auth0: string[] } }
) {
  const route = params.auth0[0];
  const url = new URL(request.url);
  url.pathname = `/auth/${route}`;
  return NextResponse.redirect(url);
}

export const POST = GET;
