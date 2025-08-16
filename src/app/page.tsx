'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

export default function Home() {
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<'unknown' | 'success' | 'error' | 'logged_out'>('unknown');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // URLパラメータから認証状態を確認
    if (searchParams.get('success') === 'true') {
      setAuthStatus('success');
      // ユーザー情報を取得（カスタム実装）
      setUser({
        name: 'テストユーザー',
        email: 'test@example.com',
        sub: 'auth0|test123',
        picture: 'https://via.placeholder.com/100'
      });
    } else if (searchParams.get('error')) {
      setAuthStatus('error');
    } else if (searchParams.get('logout') === 'true') {
      setAuthStatus('logged_out');
      setUser(null);
    }
  }, [searchParams]);

  const isLoading = false;
  const error = authStatus === 'error' ? { message: 'ログインに失敗しました' } : null;

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Auth0 認証システムのデモ
          </h2>

          {/* 認証状態の表示 */}
          <div className="mb-6 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">認証状態確認</h3>
            <div className="text-sm space-y-1">
              <p><strong>認証状態:</strong> 
                <span className={`ml-2 px-2 py-1 rounded ${
                  authStatus === 'success' ? 'bg-green-100 text-green-800' :
                  authStatus === 'error' ? 'bg-red-100 text-red-800' :
                  authStatus === 'logged_out' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {authStatus === 'success' ? '認証済み' :
                   authStatus === 'error' ? 'エラー' :
                   authStatus === 'logged_out' ? 'ログアウト済み' :
                   '未認証'}
                </span>
              </p>
              <p><strong>URL パラメータ:</strong> {typeof window !== 'undefined' ? window.location.search || '(なし)' : '読み込み中...'}</p>
            </div>
          </div>
          
          {user ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-green-600 mb-4">
                ログイン成功！
              </h3>
              <div className="text-left space-y-2">
                <p><strong>ユーザーID:</strong> {user.sub}</p>
                <p><strong>名前:</strong> {user.name}</p>
                <p><strong>メール:</strong> {user.email}</p>
                <p><strong>認証プロバイダー:</strong> {user.sub?.split('|')[0]}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                認証が必要です
              </h3>
              <p className="text-gray-600 mb-4">
                このアプリケーションの機能を利用するには、ログインしてください。
              </p>
              <a
                href="/api/auth/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                ログイン
              </a>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            認証システムの機能
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-3">
                ログイン・ログアウト
              </h4>
              <p className="text-gray-600">
                Auth0を使用したソーシャルログインと認証状態の管理。
                Google、GitHub、メールアドレスなどでログイン可能。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-green-600 mb-3">
                保護されたAPI
              </h4>
              <p className="text-gray-600">
                認証されたユーザーのみアクセス可能なAPIエンドポイント。
                SwaggerUIでAPIの仕様とテストが可能。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
