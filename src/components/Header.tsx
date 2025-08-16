'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function Header() {
  const { user, isLoading, error } = useUser();

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
                href="/auth/logout"
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                ログアウト
              </a>
            </>
          ) : (
            <a
              href="/auth/login"
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
