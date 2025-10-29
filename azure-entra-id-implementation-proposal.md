# Azure Entra ID 認証機能実装の提案

## プロジェクト構成
- **フロントエンド**: Next.js 15.5.4 + React 19.1.0 + TypeScript
- **バックエンド**: FastAPI + SQLAlchemy + PostgreSQL + Python 3.13

---

## 1. 要件

### 機能要件
1. **認証（Authentication）**
   - Azure Entra IDを使用したログイン機能
   - トークンの自動更新
   - ログアウト機能

2. **認可（Authorization）**
   - プロジェクトベースのアクセス制御
   - プロジェクトに所属しているユーザーのみがファイルアップロード/ダウンロード可能
   - ロールベースの権限管理（OWNER/ADMIN/MEMBER/VIEWER）

3. **リソースアクセス制御**
   - プロジェクト単位でのファイル管理
   - ページへのアクセス権限チェック
   - ファイルアップロード時の権限チェック
   - ファイルダウンロード時の権限チェック

### 開発要件
1. **フロントエンド開発モード**
   - MSWを使用したモック認証機能
   - 開発時は毎回Azure ADログインせずに開発可能
   - 環境変数で本番認証とモック認証を切り替え

2. **バックエンド開発モード**
   - 簡易認証機能（ダミートークン検証）
   - 環境変数で本番認証と開発認証を切り替え

### 非機能要件
- Microsoft公式サポートのライブラリを使用（`@azure/msal-react`、`fastapi-azure-auth`）
- シンプルで保守性の高い実装
- セキュアなトークン管理
- スケーラブルな権限設計
- 開発体験の向上（モック認証による効率化）

---

## 2. 推奨ソリューション

### 採用技術

| 項目 | 選択技術 | 理由 |
|------|---------|------|
| フロントエンド認証 | `@azure/msal-react` + `@azure/msal-browser` | Microsoft公式、React Hooks対応、トークン自動更新 |
| バックエンド認証 | `fastapi-azure-auth` | FastAPI専用、デコレーターベース、簡潔な実装 |
| データベース | PostgreSQL | リレーショナルデータに最適、UUID型サポート |
| 権限管理方式 | 2層権限モデル | システムレベル + プロジェクトレベル |

### アーキテクチャ概要

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   ブラウザ   │ ←────→ │ Azure AD     │         │              │
│  (Next.js)  │  OIDC   │ Entra ID     │         │              │
└─────────────┘         └──────────────┘         │              │
       │                                          │              │
       │ Bearer Token                             │              │
       ↓                                          │              │
┌─────────────┐                                  │  PostgreSQL  │
│   FastAPI   │ ←─── Token検証                   │              │
│   Backend   │                                  │              │
└─────────────┘                                  │              │
       │                                          │              │
       └────────── DB接続 ─────────────────────→ │              │
                                                  └──────────────┘
```

### 認可フロー

```
リクエスト
  ↓
Azure AD認証（トークン検証）
  ↓
DBユーザー取得（Azure OID → User）
  ↓
プロジェクトメンバーシップチェック
  ↓
ロールベース権限チェック（OWNER/ADMIN/MEMBER/VIEWER）
  ↓
リソースアクセス許可
```

---

## 3. データベース設計

### ER図

```
┌─────────────────────┐
│ users               │
├─────────────────────┤
│ id (PK)             │ UUID
│ azure_oid (UNIQUE)  │ String  ← Azure Object ID
│ email (UNIQUE)      │ String
│ display_name        │ String
│ roles               │ JSON    ← システム全体のロール ['SystemAdmin', 'User']
│ is_active           │ Boolean
│ created_at          │ DateTime
│ updated_at          │ DateTime
│ last_login          │ DateTime
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────┐
│ project_members         │
├─────────────────────────┤
│ id (PK)                 │ UUID
│ project_id (FK)         │ UUID → projects.id
│ user_id (FK)            │ UUID → users.id
│ role                    │ Enum (owner/admin/member/viewer)
│ joined_at               │ DateTime
│ added_by (FK)           │ UUID → users.id
└─────────────────────────┘
         │
         │ N:1
         ▼
┌─────────────────────┐           ┌──────────────────────┐
│ projects            │           │ project_files        │
├─────────────────────┤           ├──────────────────────┤
│ id (PK)             │◄─────────│ id (PK)              │ UUID
│ name                │ String  1:N  │ project_id (FK)      │ UUID → projects.id
│ code (UNIQUE)       │ String    │ filename             │ String
│ description         │ Text      │ original_filename    │ String
│ is_active           │ Boolean   │ file_path            │ String (Azure Blob Storage)
│ created_at          │ DateTime  │ file_size            │ Integer
│ updated_at          │ DateTime  │ mime_type            │ String
│ created_by          │ UUID      │ uploaded_by (FK)     │ UUID → users.id
└─────────────────────┘           │ uploaded_at          │ DateTime
                                  └──────────────────────┘
```

### 権限モデル

#### システムレベル権限（users.roles）
- **SystemAdmin**: システム全体の管理者、全プロジェクトにアクセス可能
- **User**: 一般ユーザー、割り当てられたプロジェクトのみアクセス可能

#### プロジェクトレベル権限（project_members.role）
- **OWNER**: プロジェクト所有者（全権限）
- **ADMIN**: プロジェクト管理者（メンバー追加・削除可能）
- **MEMBER**: 一般メンバー（ファイルアップロード・ダウンロード可能）
- **VIEWER**: 閲覧者（ファイル閲覧のみ）

### テーブル定義

#### usersテーブル
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    azure_oid VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    display_name VARCHAR,
    roles JSON DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX ix_users_azure_oid ON users(azure_oid);
CREATE INDEX ix_users_email ON users(email);
```

#### projectsテーブル
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX ix_projects_code ON projects(code);
```

#### project_membersテーブル
```sql
CREATE TYPE projectrole AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role projectrole NOT NULL,
    joined_at TIMESTAMP DEFAULT NOW(),
    added_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(project_id, user_id)
);

CREATE INDEX ix_project_members_project_id ON project_members(project_id);
CREATE INDEX ix_project_members_user_id ON project_members(user_id);
```

#### project_filesテーブル
```sql
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ix_project_files_project_id ON project_files(project_id);
```

---

## 4. フロントエンド実装

### 既存プロジェクト構造の確認

```
既存の構造:
src/
├── config/
│   └── env.ts                  # Zod環境変数検証（既存）
├── lib/
│   ├── msw.tsx                 # MSW Provider（既存）
│   ├── api-client.ts           # Axios設定（既存）
│   └── tanstack-query.ts       # React Query設定（既存）
├── app/
│   ├── provider.tsx            # AppProvider（既存）
│   └── loading.tsx             # ローディング（既存）
├── features/
│   └── sample-auth/            # サンプル認証（既存）
│       ├── stores/
│       │   └── auth-store.ts   # Zustand認証ストア（既存）
│       └── api/
│           └── login.ts        # ログインAPI（既存）
├── hooks/
│   └── use-devtools.tsx        # 開発ツール（既存）
└── mocks/
    ├── browser.ts              # MSWブラウザ（既存）
    └── handlers.ts             # MSWハンドラー（既存）
```

### 新規追加するディレクトリ構成

```
src/
├── config/
│   └── env.ts                  # 🔄 Azure AD環境変数を追加
├── lib/
│   ├── auth/                   # ✨ 新規ディレクトリ
│   │   ├── msalConfig.ts       # MSAL設定
│   │   ├── authProvider.tsx    # MSAL Provider
│   │   └── mockAuth.ts         # モック認証（開発モード用）
│   ├── api-client.ts           # 🔄 Bearerトークン対応に更新
│   └── msw.tsx                 # 既存のまま
├── app/
│   ├── provider.tsx            # 🔄 AuthProvider追加
│   └── (auth)/                 # ✨ 認証ルート
│       └── login/
│           └── page.tsx
├── features/
│   ├── auth/                   # ✨ 新規フィーチャー
│   │   ├── stores/
│   │   │   └── auth-store.ts  # Azure AD用認証ストア
│   │   ├── api/
│   │   │   ├── get-me.ts      # ユーザー情報取得
│   │   │   └── logout.ts      # ログアウト
│   │   ├── hooks/
│   │   │   └── use-auth.ts    # 認証フック
│   │   └── types/
│   │       └── index.ts
│   └── projects/               # ✨ 新規フィーチャー
│       ├── api/
│       │   ├── get-projects.ts
│       │   └── create-project.ts
│       └── routes/
│           └── projects/
└── mocks/
    └── handlers/
        └── auth-handlers.ts    # ✨ Azure AD用モックハンドラー
```

### パッケージインストール

```bash
pnpm add @azure/msal-react @azure/msal-browser
```

### 実装コード

#### 1. 環境変数設定の更新

**src/config/env.ts（更新）**
```typescript
import * as z from 'zod';
import { logger } from '@/utils/logger';

const createEnv = () => {
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT;
  const apiUrl = storybookPort ? `http://localhost:${storybookPort}/api/v1` : process.env.NEXT_PUBLIC_API_URL;

  const EnvSchema = z.object({
    // 既存の環境変数
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
    APP_URL: z.string().optional().default('http://localhost:3000'),
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
    STORYBOOK_PORT: z.string().optional(),

    // ✨ 追加: Azure AD環境変数
    AUTH_MODE: z.enum(['development', 'production']).optional().default('development'),
    AZURE_CLIENT_ID: z.string().optional(),
    AZURE_TENANT_ID: z.string().optional(),
    AZURE_REDIRECT_URI: z.string().optional(),
  });

  const envVars = {
    API_URL: apiUrl,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    STORYBOOK_PORT: storybookPort,

    // ✨ 追加
    AUTH_MODE: process.env.NEXT_PUBLIC_AUTH_MODE,
    AZURE_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    AZURE_TENANT_ID: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
    AZURE_REDIRECT_URI: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `不正な環境変数が提供されました。
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
```

#### 2. MSAL設定

**src/lib/auth/msalConfig.ts（新規）**
```typescript
import { Configuration, LogLevel } from '@azure/msal-browser';
import { env } from '@/config/env';

export const msalConfig: Configuration = {
  auth: {
    clientId: env.AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}`,
    redirectUri: env.AZURE_REDIRECT_URI || env.APP_URL,
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.Info : LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read', `api://${env.AZURE_CLIENT_ID}/access_as_user`],
};
```

**src/lib/auth/authProvider.tsx**
```typescript
'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
```

**src/lib/auth/hooks.ts**
```typescript
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';

export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    instance.logoutRedirect();
  };

  const getAccessToken = async () => {
    if (accounts.length === 0) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      const response = await instance.acquireTokenRedirect(loginRequest);
      return response?.accessToken;
    }
  };

  return {
    user: accounts[0] || null,
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== 'none',
    login,
    logout,
    getAccessToken,
  };
}
```

**src/lib/api/client.ts（axiosインターセプター）**
```typescript
import axios from 'axios';
import { msalInstance } from '@/lib/auth/authProvider';
import { loginRequest } from '@/lib/auth/msalConfig';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      config.headers.Authorization = `Bearer ${response.accessToken}`;
    } catch (error) {
      console.error('Token acquisition failed', error);
    }
  }
  return config;
});

export default apiClient;
```

**src/app/(protected)/layout.tsx**
```typescript
'use client';

import { useAuth } from '@/lib/auth/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### 開発モード実装（MSW）

**パッケージインストール**

MSWは既にインストール済み（package.jsonに`msw@^2.11.5`が含まれている）

**環境変数設定（.env.local）**

```bash
# 認証モード切り替え
NEXT_PUBLIC_AUTH_MODE=development  # development | production

# Azure AD設定（本番時のみ使用）
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**src/lib/auth/mockAuth.ts（モック認証）**

```typescript
// 開発用のモックユーザー
export const mockUser = {
  username: 'dev.user@example.com',
  name: 'Development User',
  localAccountId: 'dev-user-id',
  homeAccountId: 'dev-home-id',
  environment: 'login.windows.net',
  tenantId: 'dev-tenant-id',
  idTokenClaims: {
    oid: 'dev-azure-oid-12345',
    preferred_username: 'dev.user@example.com',
    name: 'Development User',
    roles: ['User'],
  },
};

export const mockAccessToken = 'mock-access-token-dev-12345';

// モック認証Hook
export function useMockAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ローカルストレージから認証状態を復元
    const authState = localStorage.getItem('mock-auth-state');
    setIsAuthenticated(authState === 'authenticated');
  }, []);

  const login = () => {
    localStorage.setItem('mock-auth-state', 'authenticated');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('mock-auth-state');
    setIsAuthenticated(false);
  };

  const getAccessToken = async () => {
    return isAuthenticated ? mockAccessToken : null;
  };

  return {
    user: isAuthenticated ? mockUser : null,
    isAuthenticated,
    isLoading: false,
    login,
    logout,
    getAccessToken,
  };
}
```

**src/lib/auth/hooks.ts（更新版：モード切り替え対応）**

```typescript
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';
import { useMockAuth } from './mockAuth';

const isDevelopment = process.env.NEXT_PUBLIC_AUTH_MODE === 'development';

export function useAuth() {
  const msalAuth = useMsal();
  const mockAuth = useMockAuth();

  // 開発モードの場合はモック認証を使用
  if (isDevelopment) {
    return mockAuth;
  }

  // 本番モードの場合はMSAL認証を使用
  const { instance, accounts, inProgress } = msalAuth;

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    instance.logoutRedirect();
  };

  const getAccessToken = async () => {
    if (accounts.length === 0) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      const response = await instance.acquireTokenRedirect(loginRequest);
      return response?.accessToken;
    }
  };

  return {
    user: accounts[0] || null,
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== 'none',
    login,
    logout,
    getAccessToken,
  };
}
```

**src/mocks/handlers.ts（MSWハンドラー）**

```typescript
import { http, HttpResponse } from 'msw';
import { mockAccessToken, mockUser } from '@/lib/auth/mockAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const handlers = [
  // 認証：ユーザー情報取得
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.includes(mockAccessToken)) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      id: 'dev-user-uuid',
      email: mockUser.username,
      display_name: mockUser.name,
      roles: ['User'],
      azure_info: {
        oid: mockUser.idTokenClaims.oid,
        name: mockUser.name,
      },
    });
  }),

  // プロジェクト一覧取得
  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json([
      {
        id: 'project-1',
        name: 'Development Project',
        code: 'DEV-001',
        description: 'Development test project',
        is_active: true,
        your_role: 'owner',
      },
    ]);
  }),

  // ファイル一覧取得
  http.get(`${API_URL}/projects/:projectId/files`, ({ params }) => {
    return HttpResponse.json([
      {
        id: 'file-1',
        filename: 'sample.txt',
        file_size: 1024,
        uploaded_by: mockUser.username,
        uploaded_at: new Date().toISOString(),
      },
    ]);
  }),

  // ファイルアップロード
  http.post(`${API_URL}/projects/:projectId/files/upload`, async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    return HttpResponse.json({
      id: 'new-file-id',
      filename: file.name,
      file_size: file.size,
      uploaded_by: mockUser.username,
      uploaded_at: new Date().toISOString(),
    }, { status: 201 });
  }),
];
```

**src/app/layout.tsx（条件付きMSAL Provider）**

```typescript
'use client';

import { AuthProvider } from '@/lib/auth/authProvider';
import { useEffect, useState } from 'react';

const isDevelopment = process.env.NEXT_PUBLIC_AUTH_MODE === 'development';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mswReady, setMswReady] = useState(!isDevelopment);

  useEffect(() => {
    if (isDevelopment) {
      // MSWの初期化
      async function initMsw() {
        const { worker } = await import('@/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        setMswReady(true);
      }
      initMsw();
    }
  }, []);

  if (!mswReady) {
    return <div>Initializing...</div>;
  }

  return (
    <html lang="ja">
      <body>
        {isDevelopment ? (
          // 開発モード：MSALProviderなし
          children
        ) : (
          // 本番モード：MSALProviderあり
          <AuthProvider>{children}</AuthProvider>
        )}
      </body>
    </html>
  );
}
```

**開発モードの使い方**

1. `.env.local`で`NEXT_PUBLIC_AUTH_MODE=development`を設定
2. アプリケーション起動
3. ログインページで自動的にモックユーザーでログイン
4. APIリクエストはMSWがインターセプトしてモックレスポンスを返す

---

## 5. バックエンド実装

### パッケージインストール

```bash
# pyproject.tomlに追加
fastapi-azure-auth>=4.3.0
```

### ディレクトリ構成

```
src/app/
├── core/
│   ├── config.py               # 環境変数設定
│   ├── security.py             # Azure AD認証設定
│   ├── permissions.py          # プロジェクトベース認可ロジック
│   └── database.py             # DB接続
├── models/
│   ├── user.py                 # Userモデル
│   ├── project.py              # Projectモデル
│   ├── project_member.py       # ProjectMemberモデル
│   └── file.py                 # ProjectFileモデル
├── api/
│   ├── auth.py                 # 認証エンドポイント
│   ├── projects.py             # プロジェクト管理API
│   └── files.py                # ファイル管理API
└── main.py
```

### 実装コード

**src/app/core/config.py**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Azure AD設定
    AZURE_TENANT_ID: str
    AZURE_CLIENT_ID: str
    AZURE_CLIENT_SECRET: str
    AZURE_OPENAPI_CLIENT_ID: str

    # アプリケーション設定
    APP_NAME: str = "CAMP Backend"
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

**src/app/core/security.py**
```python
from fastapi import Security
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer
from fastapi_azure_auth.user import User
from .config import settings

azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=settings.AZURE_CLIENT_ID,
    tenant_id=settings.AZURE_TENANT_ID,
    scopes={
        f'api://{settings.AZURE_CLIENT_ID}/access_as_user': 'Access API as user',
    },
    allow_guest_users=False,
)

async def get_current_user(
    user: User = Security(azure_scheme, scopes=['access_as_user'])
) -> User:
    """現在の認証済みユーザーを取得"""
    return user
```

**src/app/core/permissions.py**
```python
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi_azure_auth.user import User as AzureUser
from app.core.security import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.project_member import ProjectMember, ProjectRole
from typing import List
from uuid import UUID

async def get_db_user(azure_user: AzureUser, db: AsyncSession) -> User:
    """Azure UserからDBのUserを取得"""
    result = await db.execute(
        select(User).where(User.azure_oid == azure_user.oid)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in database"
        )
    return user

async def check_project_membership(
    project_id: UUID,
    user: User,
    db: AsyncSession,
    required_roles: List[ProjectRole] = None
) -> ProjectMember:
    """プロジェクトメンバーシップと権限をチェック"""
    # システム管理者は全プロジェクトにアクセス可能
    if 'SystemAdmin' in user.roles:
        result = await db.execute(
            select(ProjectMember).where(
                and_(
                    ProjectMember.project_id == project_id,
                    ProjectMember.user_id == user.id
                )
            )
        )
        membership = result.scalar_one_or_none()
        if membership:
            return membership
        # 仮想メンバーシップを返す
        return ProjectMember(
            project_id=project_id,
            user_id=user.id,
            role=ProjectRole.ADMIN
        )

    # メンバーシップチェック
    result = await db.execute(
        select(ProjectMember).where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user.id
            )
        )
    )
    membership = result.scalar_one_or_none()

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this project"
        )

    # ロールチェック
    if required_roles and membership.role not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions"
        )

    return membership

# 依存関数
async def require_project_member(
    project_id: UUID,
    azure_user: AzureUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> ProjectMember:
    """プロジェクトメンバーであることを要求"""
    user = await get_db_user(azure_user, db)
    return await check_project_membership(project_id, user, db)

async def require_project_upload_permission(
    project_id: UUID,
    azure_user: AzureUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> ProjectMember:
    """ファイルアップロード権限を要求（MEMBER以上）"""
    user = await get_db_user(azure_user, db)
    return await check_project_membership(
        project_id, user, db,
        required_roles=[ProjectRole.OWNER, ProjectRole.ADMIN, ProjectRole.MEMBER]
    )
```

**src/app/models/user.py**
```python
from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    azure_oid = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    display_name = Column(String, nullable=True)
    roles = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    project_memberships = relationship("ProjectMember", foreign_keys="ProjectMember.user_id")
```

**src/app/models/project.py**
```python
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), nullable=True)

    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    files = relationship("ProjectFile", back_populates="project")
```

**src/app/models/project_member.py**
```python
from sqlalchemy import Column, ForeignKey, DateTime, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.core.database import Base

class ProjectRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(SQLEnum(ProjectRole), nullable=False, default=ProjectRole.MEMBER)
    joined_at = Column(DateTime, default=datetime.utcnow)
    added_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    project = relationship("Project", back_populates="members")
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (UniqueConstraint('project_id', 'user_id', name='uq_project_user'),)
```

**src/app/models/file.py**
```python
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class ProjectFile(Base):
    __tablename__ = "project_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="files")
    uploader = relationship("User")
```

**src/app/api/files.py（ファイルAPI）**
```python
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.permissions import (
    get_db_user,
    require_project_member,
    require_project_upload_permission
)
from app.models.file import ProjectFile
from fastapi_azure_auth.user import User as AzureUser
from pydantic import BaseModel
from uuid import UUID
from typing import List

router = APIRouter(prefix="/projects/{project_id}/files", tags=["Files"])

class FileResponse(BaseModel):
    id: UUID
    filename: str
    file_size: int
    uploaded_by: str
    uploaded_at: str

@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    project_id: UUID,
    file: UploadFile = File(...),
    membership = Depends(require_project_upload_permission),
    azure_user: AzureUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """プロジェクトにファイルをアップロード（MEMBER以上）"""
    user = await get_db_user(azure_user, db)

    # ファイル保存処理（Azure Blob Storage等）
    file_path = f"projects/{project_id}/{file.filename}"

    project_file = ProjectFile(
        project_id=project_id,
        filename=file.filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=0,
        mime_type=file.content_type,
        uploaded_by=user.id
    )
    db.add(project_file)
    await db.commit()
    await db.refresh(project_file)

    return FileResponse(
        id=project_file.id,
        filename=project_file.filename,
        file_size=project_file.file_size,
        uploaded_by=user.email,
        uploaded_at=project_file.uploaded_at.isoformat()
    )

@router.get("/", response_model=List[FileResponse])
async def list_files(
    project_id: UUID,
    membership = Depends(require_project_member),
    db: AsyncSession = Depends(get_db)
):
    """プロジェクトのファイル一覧を取得（VIEWER以上）"""
    result = await db.execute(
        select(ProjectFile).where(ProjectFile.project_id == project_id)
    )
    files = result.scalars().all()

    from app.models.user import User
    user_ids = {f.uploaded_by for f in files}
    result = await db.execute(select(User).where(User.id.in_(user_ids)))
    users = {u.id: u for u in result.scalars().all()}

    return [
        FileResponse(
            id=f.id,
            filename=f.filename,
            file_size=f.file_size,
            uploaded_by=users[f.uploaded_by].email if f.uploaded_by in users else "unknown",
            uploaded_at=f.uploaded_at.isoformat()
        )
        for f in files
    ]

@router.get("/{file_id}/download")
async def download_file(
    project_id: UUID,
    file_id: UUID,
    membership = Depends(require_project_member),
    db: AsyncSession = Depends(get_db)
):
    """ファイルをダウンロード（VIEWER以上）"""
    result = await db.execute(
        select(ProjectFile).where(
            ProjectFile.id == file_id,
            ProjectFile.project_id == project_id
        )
    )
    project_file = result.scalar_one_or_none()

    if not project_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    return {
        "file_id": str(file_id),
        "filename": project_file.filename,
        "file_path": project_file.file_path,
        "status": "ready_for_download"
    }
```

**src/app/main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.security import azure_scheme
from app.api import auth, projects, files

app = FastAPI(
    title=settings.APP_NAME,
    swagger_ui_oauth2_redirect_url='/oauth2-redirect',
    swagger_ui_init_oauth={
        'usePkceWithAuthorizationCodeGrant': True,
        'clientId': settings.AZURE_OPENAPI_CLIENT_ID,
        'scopes': f'api://{settings.AZURE_CLIENT_ID}/access_as_user',
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(files.router)

@app.on_event("startup")
async def load_config() -> None:
    await azure_scheme.openid_config.load_config()
```

### 開発モード実装（簡易認証）

**環境変数設定（.env）**

```bash
# 認証モード切り替え
AUTH_MODE=development  # development | production

# Azure AD設定（本番時のみ使用）
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-backend-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_OPENAPI_CLIENT_ID=your-frontend-client-id

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/camp_db

# 開発モード用設定
DEV_MOCK_TOKEN=mock-access-token-dev-12345
DEV_MOCK_USER_EMAIL=dev.user@example.com
DEV_MOCK_USER_OID=dev-azure-oid-12345
```

**src/app/core/config.py（更新版）**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 認証モード
    AUTH_MODE: str = "production"  # development | production

    # Azure AD設定
    AZURE_TENANT_ID: str = ""
    AZURE_CLIENT_ID: str = ""
    AZURE_CLIENT_SECRET: str = ""
    AZURE_OPENAPI_CLIENT_ID: str = ""

    # 開発モード設定
    DEV_MOCK_TOKEN: str = "mock-access-token-dev-12345"
    DEV_MOCK_USER_EMAIL: str = "dev.user@example.com"
    DEV_MOCK_USER_OID: str = "dev-azure-oid-12345"
    DEV_MOCK_USER_NAME: str = "Development User"

    # アプリケーション設定
    APP_NAME: str = "CAMP Backend"
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

**src/app/core/dev_auth.py（開発モード認証）**

```python
from fastapi import Security, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()

class DevUser:
    """開発モード用のモックユーザークラス"""
    def __init__(self):
        self.oid = settings.DEV_MOCK_USER_OID
        self.preferred_username = settings.DEV_MOCK_USER_EMAIL
        self.email = settings.DEV_MOCK_USER_EMAIL
        self.name = settings.DEV_MOCK_USER_NAME
        self.roles = []

async def get_current_user_dev(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> DevUser:
    """開発モード用の認証（トークンチェックのみ）"""
    token = credentials.credentials

    # モックトークンと一致するかチェック
    if token != settings.DEV_MOCK_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid development token"
        )

    return DevUser()
```

**src/app/core/security.py（更新版：モード切り替え）**

```python
from fastapi import Security, Depends
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer
from fastapi_azure_auth.user import User
from app.core.config import settings
from app.core.dev_auth import get_current_user_dev, DevUser

# Azure AD認証スキーム（本番モードのみ初期化）
azure_scheme = None
if settings.AUTH_MODE == "production":
    azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
        app_client_id=settings.AZURE_CLIENT_ID,
        tenant_id=settings.AZURE_TENANT_ID,
        scopes={
            f'api://{settings.AZURE_CLIENT_ID}/access_as_user': 'Access API as user',
        },
        allow_guest_users=False,
    )

async def get_current_user(
    azure_user: User | None = Security(azure_scheme, scopes=['access_as_user']) if settings.AUTH_MODE == "production" else None,
    dev_user: DevUser | None = Depends(get_current_user_dev) if settings.AUTH_MODE == "development" else None
) -> User | DevUser:
    """
    現在の認証済みユーザーを取得

    環境変数AUTH_MODEによって本番認証/開発認証を切り替え
    """
    if settings.AUTH_MODE == "development":
        return dev_user
    else:
        return azure_user
```

**src/app/main.py（更新版：条件付き初期化）**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.security import azure_scheme
from app.api import auth, projects, files

app = FastAPI(
    title=settings.APP_NAME,
    swagger_ui_oauth2_redirect_url='/oauth2-redirect' if settings.AUTH_MODE == "production" else None,
    swagger_ui_init_oauth={
        'usePkceWithAuthorizationCodeGrant': True,
        'clientId': settings.AZURE_OPENAPI_CLIENT_ID,
        'scopes': f'api://{settings.AZURE_CLIENT_ID}/access_as_user',
    } if settings.AUTH_MODE == "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(files.router)

@app.on_event("startup")
async def load_config() -> None:
    """起動時の初期化"""
    if settings.AUTH_MODE == "production" and azure_scheme:
        await azure_scheme.openid_config.load_config()
        print("✅ Azure AD authentication enabled (Production mode)")
    else:
        print("⚠️  Development authentication enabled (Mock mode)")

@app.get("/")
async def root():
    return {
        "message": "CAMP Backend API",
        "auth_mode": settings.AUTH_MODE
    }

@app.get("/health")
async def health():
    """ヘルスチェックエンドポイント（認証不要）"""
    return {
        "status": "healthy",
        "auth_mode": settings.AUTH_MODE
    }
```

**開発モードの使い方**

1. `.env`で`AUTH_MODE=development`を設定
2. バックエンド起動: `uvicorn app.main:app --reload`
3. フロントエンドからのリクエストヘッダーに`Authorization: Bearer mock-access-token-dev-12345`を付与
4. トークンが一致すればモックユーザーとして認証される

**本番モードへの切り替え**

1. `.env`で`AUTH_MODE=production`に変更
2. Azure AD関連の環境変数を正しく設定
3. バックエンド再起動

---

## 6. データベースマイグレーション

**alembic/versions/xxx_add_project_based_auth.py**
```python
"""Add project-based authentication tables

Revision ID: xxx
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade() -> None:
    # usersテーブル
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('azure_oid', sa.String(), nullable=False, unique=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('roles', postgresql.JSON(), nullable=False, server_default='[]'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('last_login', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_users_azure_oid', 'users', ['azure_oid'])
    op.create_index('ix_users_email', 'users', ['email'])

    # projectsテーブル
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('code', sa.String(50), nullable=False, unique=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_index('ix_projects_code', 'projects', ['code'])

    # project_membersテーブル
    op.create_table(
        'project_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.Enum('owner', 'admin', 'member', 'viewer', name='projectrole'), nullable=False),
        sa.Column('joined_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('added_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['added_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('project_id', 'user_id', name='uq_project_user'),
    )
    op.create_index('ix_project_members_project_id', 'project_members', ['project_id'])
    op.create_index('ix_project_members_user_id', 'project_members', ['user_id'])

    # project_filesテーブル
    op.create_table(
        'project_files',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('original_filename', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(512), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('mime_type', sa.String(100), nullable=True),
        sa.Column('uploaded_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ondelete='RESTRICT'),
    )
    op.create_index('ix_project_files_project_id', 'project_files', ['project_id'])

def downgrade() -> None:
    op.drop_table('project_files')
    op.drop_table('project_members')
    op.drop_table('projects')
    op.drop_table('users')
    op.execute('DROP TYPE projectrole')
```

---

## 7. 環境変数設定

### フロントエンド（.env.local）

**開発モード**
```bash
# 認証モード
NEXT_PUBLIC_AUTH_MODE=development

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Azure AD設定（開発時は不要だが定義は必要）
NEXT_PUBLIC_AZURE_CLIENT_ID=
NEXT_PUBLIC_AZURE_TENANT_ID=
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
```

**本番モード**
```bash
# 認証モード
NEXT_PUBLIC_AUTH_MODE=production

# API URL
NEXT_PUBLIC_API_URL=https://your-api.example.com

# Azure AD設定
NEXT_PUBLIC_AZURE_CLIENT_ID=your-frontend-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=https://your-app.example.com
```

### バックエンド（.env）

**開発モード**
```bash
# 認証モード
AUTH_MODE=development

# 開発モード用設定
DEV_MOCK_TOKEN=mock-access-token-dev-12345
DEV_MOCK_USER_EMAIL=dev.user@example.com
DEV_MOCK_USER_OID=dev-azure-oid-12345
DEV_MOCK_USER_NAME=Development User

# Azure AD設定（開発時は不要だが定義は必要）
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_OPENAPI_CLIENT_ID=

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/camp_db
```

**本番モード**
```bash
# 認証モード
AUTH_MODE=production

# Azure AD設定
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-backend-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_OPENAPI_CLIENT_ID=your-frontend-client-id

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@prod-db.example.com:5432/camp_db
```

---

## 8. Azure Entra ID設定手順

### 1. フロントエンド用アプリ登録

1. Azure Portalで「アプリの登録」→「新規登録」
2. **アプリケーションの種類**: Single Page Application (SPA)
3. **リダイレクトURI**: `http://localhost:3000`
4. **トークン構成**: ID tokensを有効化
5. Client IDをコピー（フロントエンド用）

### 2. バックエンド用アプリ登録

1. Azure Portalで「アプリの登録」→「新規登録」
2. **アプリケーションの種類**: Web API
3. **APIの公開**: `api://{client-id}/access_as_user` スコープを作成
4. **承認済みクライアントアプリケーション**: フロントエンドのClient IDを追加
5. Client ID、Client Secretをコピー（バックエンド用）

### 3. ロール/グループ設定

1. **App Roles**または**Azure AD Groups**でロール管理
2. トークンに`roles`クレームを含める設定
3. ユーザーにロールを割り当て

---

## 9. 実装工数見積もり

### フロントエンド

| タスク | 工数 |
|--------|------|
| MSAL設定・プロバイダー実装 | 2-3時間 |
| 認証フック・ユーティリティ作成 | 2-3時間 |
| ログインページ・保護ルート実装 | 2-3時間 |
| axiosインターセプター設定 | 1-2時間 |
| **MSW開発モード実装** | **2-3時間** |
| テスト・デバッグ | 1-2時間 |
| **合計** | **10-16時間** |

### バックエンド

| タスク | 工数 |
|--------|------|
| fastapi-azure-auth設定 | 2-3時間 |
| DBモデル作成（User, Project, ProjectMember, ProjectFile） | 3-4時間 |
| マイグレーション作成・実行 | 1-2時間 |
| 認証エンドポイント実装 | 2-3時間 |
| プロジェクトベース認可ロジック実装 | 4-5時間 |
| プロジェクトAPI実装 | 3-4時間 |
| ファイルAPI実装（プロジェクトベース） | 4-5時間 |
| **開発モード認証実装** | **2-3時間** |
| テスト・デバッグ | 3-4時間 |
| **合計** | **24-33時間** |

### 統合テスト・調整

| タスク | 工数 |
|--------|------|
| フロント↔バック統合テスト（本番モード） | 3-4時間 |
| 開発モード動作確認 | 1-2時間 |
| エラーハンドリング改善 | 2-3時間 |
| ドキュメント作成 | 1-2時間 |
| **合計** | **7-11時間** |

### 総工数

**41-60時間**（5-7.5営業日、約1-1.5週間）

#### 内訳
- **フロントエンド**: 10-16時間
- **バックエンド**: 24-33時間
- **統合テスト**: 7-11時間

#### 開発モード対応による追加工数
- **フロントエンド（MSW）**: 2-3時間
- **バックエンド（簡易認証）**: 2-3時間
- **合計追加**: 4-6時間

---

## 10. まとめ

### 推奨実装方針

| 項目 | 推奨技術 | 理由 |
|------|---------|------|
| フロントエンド認証 | `@azure/msal-react` | Microsoft公式、React対応、自動トークン更新 |
| バックエンド認証 | `fastapi-azure-auth` | FastAPI専用、シンプルな実装、デコレーターベース |
| 開発モード（フロント） | MSW（Mock Service Worker） | 既存のMSWを活用、本番コードに影響なし |
| 開発モード（バック） | 簡易認証（トークンチェック） | 環境変数で切り替え、開発効率向上 |
| 権限管理 | 2層モデル | システムレベル + プロジェクトレベルの柔軟な制御 |
| 総実装工数 | **41-60時間** | 約1-1.5週間で完了可能 |

### 実装のメリット

1. **セキュリティ**
   - Microsoft公式ライブラリによる堅牢な認証
   - トークンベースの安全な通信
   - きめ細かい権限制御

2. **保守性**
   - シンプルで理解しやすいコード
   - 2層権限モデルによる柔軟な拡張性
   - 標準的なパターンの採用

3. **スケーラビリティ**
   - プロジェクト数の増加に対応
   - ユーザー数の増加に対応
   - ロールの追加が容易

4. **開発体験**
   - 環境変数で本番/開発モードを簡単に切り替え
   - 開発時は毎回Azure ADログイン不要
   - MSWによる高速なフロントエンド開発
   - バックエンドの簡易認証で迅速な動作確認

---

## 付録A: ライブラリ選択肢の詳細比較

### フロントエンドライブラリ

#### オプション A: @azure/msal-react + @azure/msal-browser ⭐推奨

**メリット**:
- Microsoft公式サポート、Azure Entra IDに完全対応
- トークンの自動更新、キャッシュ管理が組み込み
- React Hooksで簡単に統合可能
- Silent token renewal対応
- 詳細なドキュメントとサンプルコード

**デメリット**:
- Azure専用で他のIDプロバイダーには非対応
- 初期セットアップがやや複雑
- Next.jsのApp Routerとの統合に追加設定が必要

**実装工数**: 8-12時間

#### オプション B: NextAuth.js (Auth.js v5)

**メリット**:
- Next.js 15のApp Router完全対応
- Azure AD以外のプロバイダーも簡単に追加可能
- セッション管理が簡単
- コミュニティが大きく、情報が豊富

**デメリット**:
- Azure特有の機能（条件付きアクセス等）の制御が限定的
- MSALに比べてトークン管理の柔軟性が低い
- カスタマイズには深い理解が必要

**実装工数**: 6-10時間

#### オプション C: Auth0 + @auth0/nextjs-auth0

**メリット**:
- 最もシンプルな実装
- 多要素認証、ログ監視等の追加機能が豊富
- 管理画面でユーザー管理が簡単

**デメリット**:
- 追加のサービス契約が必要（コスト増）
- Azure → Auth0 → アプリという3層構造で複雑化
- レイテンシーの増加

**実装工数**: 4-8時間

### バックエンドライブラリ

#### オプション A: fastapi-azure-auth ⭐推奨

**メリット**:
- FastAPIとの統合が非常に簡単
- デコレーターベースで可読性が高い
- スコープベースの認可が簡単
- OpenAPI統合で自動ドキュメント生成
- トークン検証が自動化

**デメリット**:
- 比較的新しいライブラリ（コミュニティは小さめ）
- カスタマイズの余地が限定的

**実装工数**: 6-10時間

#### オプション B: msal + python-jose

**メリット**:
- Microsoft公式サポート
- 柔軟なカスタマイズが可能
- トークン取得/更新の完全制御
- 既存の`python-jose`と統合可能

**デメリット**:
- FastAPIとの統合を自前で実装
- 実装量が多い
- トークン検証のボイラープレートコードが必要

**実装工数**: 10-16時間

#### オプション C: authlib

**メリット**:
- 非常に柔軟で他のOAuthプロバイダーにも対応
- 豊富な機能セット
- アクティブなメンテナンス

**デメリット**:
- Azure特有の設定が必要
- ドキュメントがAzure特化ではない
- 実装の複雑さ

**実装工数**: 10-14時間
