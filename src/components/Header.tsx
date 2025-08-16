'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // URLパラメータから認証状態を確認
    if (searchParams.get('success') === 'true') {
      setUser({
        name: 'テストユーザー',
        email: 'test@example.com'
      });
    } else if (searchParams.get('logout') === 'true') {
      setUser(null);
    }
  }, [searchParams]);

  const isLoading = false;
  const error = null;

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Auth0 認証デモ</Link>
        </h1>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>こんにちは、{user.name}さん</span>
              <Link 
                href="/profile" 
                className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded"
              >
                プロフィール
              </Link>
              <Link 
                href="/api-docs" 
                className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded"
              >
                API ドキュメント
              </Link>
              <a
                href="/api/auth/logout"
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                ログアウト
              </a>
            </>
          ) : (
            <a
              href="/api/auth/login"
              className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded"
            >
              ログイン
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
