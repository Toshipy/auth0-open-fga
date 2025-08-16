# Auth0認証システム テストガイド

## 🚀 クイックスタート

### ステップ1: Auth0アカウントの作成と設定

1. **Auth0アカウント作成**
   - [Auth0.com](https://auth0.com) にアクセス
   - "Sign Up"でアカウント作成
   - 無料プランで十分です

2. **アプリケーション作成**
   ```
   Applications → Create Application
   - Name: "Auth0 Demo App"
   - Type: "Single Page Applications"
   - Technology: "React"
   ```

3. **アプリケーション設定**
   ```
   Settings タブで以下を設定:
   
   Allowed Callback URLs:
   http://localhost:3000/api/auth/callback
   
   Allowed Logout URLs:
   http://localhost:3000
   
   Allowed Web Origins:
   http://localhost:3000
   
   Allowed Origins (CORS):
   http://localhost:3000
   ```

4. **設定値を取得**
   ```
   Domain: your-domain.auth0.com
   Client ID: xxxxxxxxxx
   Client Secret: xxxxxxxxxx
   ```

### ステップ2: 環境変数の設定

1. `.env.local`ファイルを作成:
```bash
cp .env.example .env.local
```

2. `.env.local`を編集:
```env
# 32文字以上のランダム文字列（下記コマンドで生成可能）
AUTH0_SECRET='use-a-long-random-value-at-least-32-characters-long'

# 開発環境URL
AUTH0_BASE_URL='http://localhost:3000'

# Auth0から取得した値に置き換え
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

**SECRET生成方法:**
```bash
# macOS/Linux
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ステップ3: アプリケーションの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 🧪 テストシナリオ

### テスト1: 基本認証フロー

1. **未認証状態の確認**
   - http://localhost:3000 にアクセス
   - "認証が必要です" が表示される
   - "ログイン" ボタンが表示される

2. **ログイン実行**
   - "ログイン" ボタンクリック
   - Auth0のログイン画面にリダイレクト
   - メールアドレス/パスワードでログイン
   - または "Continue with Google" でGoogleログイン

3. **認証成功確認**
   - アプリケーションにリダイレクト
   - "ログイン成功！" が表示される
   - ユーザー情報（名前、メール等）が表示される
   - ヘッダーに "プロフィール", "API ドキュメント", "ログアウト" が表示

### テスト2: プロフィールページ

1. **プロフィールアクセス**
   - ヘッダーの "プロフィール" をクリック
   - `/profile` ページに移動

2. **情報確認**
   - ユーザーID、名前、メールが表示される
   - 認証プロバイダー情報が表示される
   - プロフィール画像が表示される（あれば）
   - 完全なユーザー情報（JSON）が表示される

### テスト3: 保護されたAPI

1. **API ドキュメントアクセス**
   - ヘッダーの "API ドキュメント" をクリック
   - `/api-docs` ページに移動
   - SwaggerUIが表示される

2. **保護されたエンドポイントテスト**
   ```
   GET /api/protected
   1. "Try it out" をクリック
   2. "Execute" をクリック
   3. Response: 200 OK
   4. レスポンス内容を確認:
      {
        "message": "保護されたAPIへのアクセス成功！",
        "user": {...},
        "timestamp": "..."
      }
   ```

3. **ユーザー一覧API**
   ```
   GET /api/users
   1. "Try it out" をクリック
   2. "Execute" をクリック
   3. Response: 200 OK
   4. モックユーザーデータが返される
   ```

4. **ユーザー作成API**
   ```
   POST /api/users
   1. "Try it out" をクリック
   2. Request body を編集:
      {
        "name": "テストユーザー",
        "email": "test@example.com",
        "role": "user"
      }
   3. "Execute" をクリック
   4. Response: 201 Created
   ```

### テスト4: ログアウト

1. **ログアウト実行**
   - ヘッダーの "ログアウト" をクリック
   - Auth0のログアウト処理実行
   - アプリケーションに戻る

2. **未認証状態確認**
   - "認証が必要です" が再表示される
   - ヘッダーに "ログイン" ボタンのみ表示

## 🔍 手動テスト

### ブラウザでの直接確認

1. **認証が必要なページに直接アクセス**
   ```
   http://localhost:3000/profile
   → 自動的にログインページにリダイレクト
   ```

2. **APIエンドポイントに直接アクセス**
   ```bash
   # 未認証でのアクセス
   curl http://localhost:3000/api/protected
   # 期待結果: {"error":"認証が必要です"} (401)
   
   # 認証後のアクセス（ブラウザでログイン後、Cookieを取得）
   curl -b "appSession=..." http://localhost:3000/api/protected
   # 期待結果: 成功レスポンス (200)
   ```

### 開発者ツールでの確認

1. **ネットワークタブ**
   - ログイン時の認証フロー確認
   - API呼び出し時のヘッダー確認
   - レスポンスコード確認

2. **コンソールタブ**
   - JavaScriptエラーの確認
   - 認証状態の確認

3. **アプリケーションタブ**
   - Cookieの確認
   - セッション情報の確認

## ❗ トラブルシューティング

### よくあるエラーと解決方法

1. **"Invalid state" エラー**
   ```
   原因: Auth0の設定URL不一致
   解決: Callback URLsを再確認
   ```

2. **"Access denied" エラー**
   ```
   原因: ユーザーが存在しない or 権限不足
   解決: Auth0ダッシュボードでユーザー確認
   ```

3. **SwaggerUIが表示されない**
   ```
   原因: CDNアクセス制限 or JavaScriptエラー
   解決: ブラウザコンソールでエラー確認
   ```

4. **APIが401を返す**
   ```
   原因: セッション期限切れ or Cookie設定問題
   解決: 再ログイン or ブラウザキャッシュクリア
   ```

### デバッグコマンド

```bash
# 環境変数確認
cat .env.local

# プロセス確認
ps aux | grep next

# ポート確認
lsof -i :3000

# ログ確認
npm run dev -- --debug
```

## 🎯 テスト成功の指標

- [ ] ログイン・ログアウトが正常に動作
- [ ] プロフィールページでユーザー情報表示
- [ ] SwaggerUIでAPIテストが実行可能
- [ ] 保護されたAPIが認証チェック実行
- [ ] 未認証時は適切にエラーレスポンス
- [ ] 認証後はユーザー情報を含むレスポンス

すべてチェックできれば、Auth0認証システムが正常に動作しています！