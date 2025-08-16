'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Header from '@/components/Header';

export default function ApiDocs() {
  const { user, isLoading } = useUser();
  const [swaggerLoaded, setSwaggerLoaded] = useState(false);

  useEffect(() => {
    const loadSwaggerUI = async () => {
      try {
        const SwaggerUI = (await import('swagger-ui-dist/swagger-ui-bundle')).default;
        
        SwaggerUI({
          dom_id: '#swagger-ui',
          url: '/api/swagger',
          presets: [
            SwaggerUI.presets.apis,
            SwaggerUI.presets.standalone
          ],
          plugins: [
            SwaggerUI.plugins.DownloadUrl
          ],
          layout: 'StandaloneLayout',
          requestInterceptor: (request: any) => {
            if (user) {
              request.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }
            return request;
          },
          onComplete: () => {
            setSwaggerLoaded(true);
          }
        });
      } catch (error) {
        console.error('Swagger UIの読み込みエラー:', error);
      }
    };

    if (!isLoading) {
      loadSwaggerUI();
    }
  }, [user, isLoading]);

  useEffect(() => {
    const loadSwaggerCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css';
      document.head.appendChild(link);
    };

    loadSwaggerCSS();
  }, []);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">API ドキュメント</h2>
          <p className="text-gray-600">
            Auth0認証システムのAPIエンドポイントの仕様とテスト機能
          </p>
        </div>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              認証が必要です
            </h3>
            <p className="text-yellow-700">
              保護されたAPIエンドポイントをテストするには、まずログインしてください。
            </p>
            <a
              href="/api/auth/login"
              className="mt-3 inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              ログイン
            </a>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              使用方法
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>ログイン後、保護されたAPIエンドポイントをテストできます</li>
              <li>"Try it out"ボタンでAPIリクエストを実行できます</li>
              <li>認証トークンは自動的に送信されます</li>
              <li>レスポンスの例とスキーマを確認できます</li>
            </ul>
          </div>

          {!swaggerLoaded && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Swagger UIを読み込み中...</p>
            </div>
          )}

          <div id="swagger-ui"></div>
        </div>
      </main>
    </div>
  );
}
