import { NextRequest, NextResponse } from 'next/server';

// シンプルなAuth0認証処理
export async function GET(
  request: NextRequest,
  { params }: { params: { auth0: string[] } }
) {
  const route = params.auth0[0];
  const { searchParams } = new URL(request.url);
  
  // 共通の環境変数を取得
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.AUTH0_BASE_URL;
  
  switch (route) {
    case 'login':
      // Auth0のログインページにリダイレクト
      
      // デバッグ情報をログ出力
      console.log('環境変数チェック:', {
        auth0Domain,
        clientId,
        baseUrl
      });
      
      // 環境変数が設定されていない場合のエラーハンドリング
      if (!auth0Domain || !clientId || !baseUrl) {
        return NextResponse.json({
          error: '環境変数が設定されていません',
          details: {
            AUTH0_ISSUER_BASE_URL: !!auth0Domain,
            AUTH0_CLIENT_ID: !!clientId,
            AUTH0_BASE_URL: !!baseUrl
          }
        }, { status: 500 });
      }
      
      const redirectUri = `${baseUrl}/api/auth/callback`;
      const authUrl = `${auth0Domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid profile email`;
      
      console.log('Auth0 URL:', authUrl);
      return NextResponse.redirect(authUrl);
      
    case 'callback':
      // Auth0からのコールバック処理
      const code = searchParams.get('code');
      if (code) {
        // 簡単な成功ページにリダイレクト
        return NextResponse.redirect(new URL('/?success=true', request.url));
      }
      return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
      
    case 'logout':
      // ログアウト処理
      console.log('ログアウト処理開始:', {
        auth0Domain,
        baseUrl
      });
      
      if (!auth0Domain || !baseUrl) {
        return NextResponse.json({
          error: 'ログアウト用環境変数が不足',
          details: {
            AUTH0_ISSUER_BASE_URL: !!auth0Domain,
            AUTH0_BASE_URL: !!baseUrl
          }
        }, { status: 500 });
      }
      
      const logoutUrl = `${auth0Domain}/logout?` +
        `returnTo=${encodeURIComponent(baseUrl)}`;
        
      console.log('構築されたログアウトURL:', logoutUrl);
      return NextResponse.redirect(logoutUrl);
      
    case 'me':
      // ユーザー情報返却（テスト用）
      return NextResponse.json({
        user: null,
        message: 'カスタム実装：ログインが必要です'
      });
      
    default:
      return NextResponse.json({ error: 'Unknown auth route' }, { status: 404 });
  }
}

export const POST = GET;