# Auth0コンソール設定ガイド

## 🚀 Auth0アカウント作成からアプリ設定まで

### ステップ1: Auth0アカウント作成

1. **Auth0サイトにアクセス**
   - https://auth0.com にアクセス
   - 右上の「Sign Up」をクリック

2. **アカウント情報入力**
   ```
   Email: あなたのメールアドレス
   Password: 強力なパスワード
   ```

3. **テナント作成**
   ```
   Tenant Domain: your-domain (例: my-app-dev)
   → 最終的に https://your-domain.auth0.com になります
   Region: Asia Pacific (Tokyo) または US
   ```

### ステップ2: アプリケーション作成

1. **ダッシュボードアクセス**
   - Auth0にログイン後、ダッシュボードが表示される

2. **新規アプリケーション作成**
   ```
   左メニュー: Applications → Applications
   「+ Create Application」ボタンをクリック
   ```

3. **アプリケーション設定**
   ```
   Name: Auth0 Demo App（または任意の名前）
   Application Type: Single Page Applications
   Technology: React
   ```
   
   「Create」ボタンをクリック

### ステップ3: アプリケーション詳細設定

アプリケーション作成後、「Settings」タブで以下を設定：

#### 🔧 基本設定

1. **Application URIs設定**
   ```
   Allowed Callback URLs:
   http://localhost:3000/api/auth/callback
   
   Allowed Logout URLs:
   http://localhost:3000
   
   Allowed Web Origins:
   http://localhost:3000
   
   Allowed Origins (CORS):
   http://localhost:3000
   ```

2. **重要な値をメモ**
   ```
   Domain: your-domain.auth0.com
   Client ID: xxxxxxxxxxxxxxxxx
   Client Secret: xxxxxxxxxxxxxxxxx（Show をクリックして表示）
   ```

#### 🔑 高度な設定（オプション）

1. **Grant Types**（デフォルトのままでOK）
   ```
   ✓ Authorization Code
   ✓ Refresh Token
   ✓ Implicit
   ```

2. **Token Settings**
   ```
   JWT Expiration: 36000 seconds（デフォルト）
   ```

### ステップ4: ソーシャルログイン設定（オプション）

#### Google認証を有効にする場合

1. **Social Connections**
   ```
   左メニュー: Authentication → Social
   「Google」をクリック
   ```

2. **Google設定**
   ```
   Status: ON（トグルをオンに）
   Client ID: （Google Developer Consoleから取得）
   Client Secret: （Google Developer Consoleから取得）
   
   または「Use Auth0 Dev Keys」を有効にして開発用キーを使用
   ```

3. **アプリケーションとの連携**
   ```
   Applications タブで作成したアプリを選択
   「Save」をクリック
   ```

### ステップ5: ユーザー管理設定

1. **Database Connection**
   ```
   左メニュー: Authentication → Database
   デフォルトで「Username-Password-Authentication」が作成済み
   ```

2. **Sign Up設定**
   ```
   Settings → Disable Sign Ups: OFF（ユーザー登録を許可）
   ```

### ステップ6: セキュリティ設定

1. **Brute Force Protection**（推奨）
   ```
   左メニュー: Security → Attack Protection
   Brute Force Protection: ON
   ```

2. **Multi-factor Authentication**（本番環境推奨）
   ```
   左メニュー: Security → Multi-factor Auth
   Push Notifications via Auth0 Guardian: ON（オプション）
   ```

## 📋 設定値の確認チェックリスト

### ✅ 必須設定

- [ ] Application作成済み（Single Page Application）
- [ ] Domain取得済み（your-domain.auth0.com）
- [ ] Client ID取得済み
- [ ] Client Secret取得済み
- [ ] Callback URLs設定済み（http://localhost:3000/api/auth/callback）
- [ ] Logout URLs設定済み（http://localhost:3000）
- [ ] Web Origins設定済み（http://localhost:3000）

### ✅ オプション設定

- [ ] Google認証設定（ソーシャルログイン用）
- [ ] ユーザー登録許可設定
- [ ] ブルートフォース攻撃対策

## 🔍 設定確認方法

### 1. Test Connection

Auth0ダッシュボードの「Connections」で：
```
Authentication → Database → Username-Password-Authentication
「Try Connection」ボタンでテスト
```

### 2. Application Test

```
Applications → あなたのアプリ → Quick Start
サンプルコードでテスト可能
```

## 📱 実際の画面キャプチャ例

### Auth0ダッシュボード画面構成

```
┌─ 左メニュー
│  ├─ Applications (アプリ管理)
│  ├─ APIs (API管理)
│  ├─ Authentication
│  │  ├─ Database (DB接続)
│  │  ├─ Social (ソーシャル)
│  │  └─ Enterprise (企業認証)
│  ├─ User Management (ユーザー管理)
│  └─ Security (セキュリティ)
└─ メインエリア
```

### Application Settings画面

```
┌─ Basic Information
│  Name: Auth0 Demo App
│  Domain: your-domain.auth0.com
│  Client ID: abc123...
│  Client Secret: xyz789... [Show]
│
├─ Application URIs
│  Allowed Callback URLs:
│  http://localhost:3000/api/auth/callback
│  
│  Allowed Logout URLs:
│  http://localhost:3000
│
└─ [Save Changes] ボタン
```

## ❗ よくあるエラーと解決方法

### 1. "Invalid Callback URL" エラー
```
❌ 原因: Callback URLが正確に設定されていない
✅ 解決: http://localhost:3000/api/auth/callback を正確に入力
```

### 2. "Access Denied" エラー
```
❌ 原因: Client IDまたはSecretが間違っている
✅ 解決: Auth0から正確な値をコピー
```

### 3. "Cross-Origin Request Blocked" エラー
```
❌ 原因: Allowed Web Originsが設定されていない
✅ 解決: http://localhost:3000 を追加
```

## 🔄 設定完了後のテスト

1. **.env.localに値を設定**
   ```env
   AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
   AUTH0_CLIENT_ID='your-client-id'
   AUTH0_CLIENT_SECRET='your-client-secret'
   ```

2. **アプリケーション起動**
   ```bash
   npm run dev
   ```

3. **ログインテスト**
   ```
   http://localhost:3000 → ログインボタン → Auth0画面 → ログイン成功
   ```

設定が正しく完了していれば、Auth0のログイン画面が表示され、認証後にアプリケーションに戻ってきます！