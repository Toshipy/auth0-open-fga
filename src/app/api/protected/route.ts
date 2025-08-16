import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request, NextResponse.next());
    
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: '保護されたAPIへのアクセス成功！',
      user: {
        id: session.user.sub,
        name: session.user.name,
        email: session.user.email,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}