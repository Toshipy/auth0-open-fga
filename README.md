# Auth0認証システム デモアプリケーション

このプロジェクトは、Auth0とNext.jsを使用した認証システムの教育用デモンストレーションです。
初心者向けに、Auth0の基本的な機能とSwaggerUIを使ったAPI開発の実践例を提供します。

## 🎯 このプロジェクトで学べること

- Auth0を使用したソーシャルログイン・認証の実装
- Next.js App Routerでの認証状態管理
- 保護されたAPIエンドポイントの作成
- SwaggerUIを使ったAPI仕様の文書化とテスト
- TypeScriptでの型安全な開発

## 🚀 セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd 20250816-auth0-login
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. Auth0の設定

#### Auth0アカウントの作成
1. [Auth0](https://auth0.com)でアカウントを作成
2. 新しいApplicationを作成（Single Page Application）
3. Application設定で以下を設定：
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

#### 環境変数の設定
`.env.example`を`.env.local`にコピーして、Auth0の値を設定：

```bash
cp .env.example .env.local
```

`.env.local`を編集して以下の値を設定：
```env
# 32文字以上のランダムな文字列を生成
AUTH0_SECRET='your-32-character-secret-here'

# 開発環境のベースURL
AUTH0_BASE_URL='http://localhost:3000'

# Auth0ダッシュボードから取得
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 📱 機能紹介

### 🔐 認証機能
- **ログイン**: Auth0 Universal Loginを使用
- **ログアウト**: セッション管理とセキュアなログアウト
- **プロフィール表示**: ユーザー情報の取得と表示
- **認証状態管理**: クライアントサイドでの認証状態の管理

### 🛡️ 保護されたAPI
- **GET /api/protected**: 認証テスト用のシンプルなエンドポイント
- **GET /api/users**: ユーザー一覧取得（モックデータ）
- **POST /api/users**: 新規ユーザー作成（モック実装）

### 📚 API仕様書
- **SwaggerUI**: `/api-docs`でアクセス可能
- **インタラクティブテスト**: ブラウザから直接APIをテスト
- **認証トークンの自動送信**: ログイン後は自動で認証ヘッダーを追加

## 🏗️ プロジェクト構造

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...auth0]/     # Auth0認証エンドポイント
│   │   ├── protected/           # 保護されたAPIエンドポイント
│   │   ├── users/              # ユーザー管理API
│   │   └── swagger/            # OpenAPI仕様
│   ├── api-docs/               # SwaggerUIページ
│   ├── profile/                # ユーザープロフィールページ
│   ├── layout.tsx              # ルートレイアウト（UserProvider設定）
│   └── page.tsx                # ホームページ
├── components/
│   └── Header.tsx              # ナビゲーションヘッダー
└── lib/
    └── swagger.ts              # OpenAPI仕様定義
```

## 🔧 主要な技術要素

### Auth0設定
- **UserProvider**: 認証状態をアプリケーション全体で管理
- **withPageAuthRequired**: ページレベルでの認証保護
- **getSession**: サーバーサイドでの認証情報取得

### API認証
```typescript
// サーバーサイドでの認証チェック例
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(request: NextRequest) {
  const session = await getSession(request, NextResponse.next());
  
  if (!session) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    );
  }
  
  // 認証済みユーザーの処理
}
```

### フロントエンド認証
```typescript
// クライアントサイドでの認証状態取得
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Component() {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;
  
  return user ? <AuthenticatedView /> : <LoginPrompt />;
}
```

## 📖 学習ポイント

### 1. Auth0認証フロー
- Universal Loginによるセキュアな認証
- JWTトークンを使用したステートレス認証
- セッション管理とリフレッシュトークン

### 2. Next.js App Router
- クライアントコンポーネント（'use client'）の使用
- Server Actionsでの認証情報取得
- レイアウトでのProvider設定

### 3. API設計
- RESTful APIの設計原則
- エラーハンドリングのベストプラクティス
- OpenAPI仕様を使った文書化

### 4. セキュリティ
- 環境変数を使った機密情報の管理
- 認証トークンの適切な処理
- CORS設定とセキュリティヘッダー

## 🔍 トラブルシューティング

### よくある問題

#### 1. Auth0設定エラー
```
Error: The audience parameter must be provided
```
- `.env.local`でAUTH0_AUDIENCEが設定されていない場合に発生
- Auth0ダッシュボードでAPIの設定を確認

#### 2. 認証ループ
- Callback URLの設定を確認
- `AUTH0_BASE_URL`が正しく設定されているか確認

#### 3. SwaggerUI表示エラー
- ブラウザのコンソールでJavaScriptエラーを確認
- CDNからのリソース読み込みを確認

### デバッグ方法

#### 認証状態の確認
```typescript
// ユーザー情報をコンソールに出力
console.log('User:', user);
console.log('Session:', session);
```

#### API応答の確認
```bash
# 保護されたエンドポイントのテスト
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/protected
```

## 🎓 次のステップ

このデモを理解したら、以下の機能拡張に挑戦してみてください：

1. **データベース連携**: PostgreSQLやMongoDBとの連携
2. **ロール管理**: ユーザーの権限管理機能
3. **メール通知**: 新規登録やパスワードリセット
4. **多要素認証**: SMS認証やTOTPの実装
5. **ソーシャルプロバイダー追加**: Google、GitHub以外の認証
6. **テスト実装**: Jest、Cypressを使った自動テスト

## 📚 参考資料

- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT.io](https://jwt.io/) - JWTトークンのデバッグ

## 🤝 コントリビューション

このプロジェクトは教育目的で作成されています。
改善提案やバグ報告はIssueでお願いします。

## 📄 ライセンス

MIT License
