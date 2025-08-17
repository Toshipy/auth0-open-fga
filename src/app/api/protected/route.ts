import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { checkAccess } from '@/lib/openfga';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // OpenFGAで閲覧権限をチェック（ドキュメントIDは例として固定）
    const allowed = await checkAccess({
      user: `user:${session.user.sub}`,
      relation: 'can_read',
      object: 'document:123',
    });

    if (!allowed) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
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
