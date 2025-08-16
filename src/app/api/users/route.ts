import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request, NextResponse.next());
    
    if (!session) {
      return NextResponse.json(
        { 
          error: '認証が必要です',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    const mockUsers = [
      { id: 1, name: '田中太郎', email: 'tanaka@example.com', role: 'admin' },
      { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'user' },
      { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'user' },
    ];

    return NextResponse.json({
      users: mockUsers,
      currentUser: {
        id: session.user.sub,
        name: session.user.name,
        email: session.user.email,
      },
      meta: {
        total: mockUsers.length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        code: 'INTERNAL_SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request, NextResponse.next());
    
    if (!session) {
      return NextResponse.json(
        { 
          error: '認証が必要です',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, role = 'user' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { 
          error: '名前とメールアドレスは必須です',
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      createdBy: session.user.sub,
    };

    return NextResponse.json({
      message: 'ユーザーが正常に作成されました',
      user: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        code: 'INTERNAL_SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}