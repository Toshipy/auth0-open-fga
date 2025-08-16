'use client';

import { useUser } from '@auth0/nextjs-auth0';
import Header from '@/components/Header';

function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">プロフィール</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            {user && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ユーザーID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.sub}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      名前
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      メールアドレス
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      認証プロバイダー
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.sub?.split('|')[0]}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      メール認証済み
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.email_verified ? '認証済み' : '未認証'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      最終更新日時
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.updated_at ? new Date(user.updated_at).toLocaleString('ja-JP') : '不明'}
                    </p>
                  </div>
                </div>

                {user.picture && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      プロフィール画像
                    </label>
                    <img
                      src={user.picture}
                      alt="プロフィール画像"
                      className="w-24 h-24 rounded-full border border-gray-300"
                    />
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    完全なユーザー情報（開発用）
                  </label>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto text-gray-900">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
