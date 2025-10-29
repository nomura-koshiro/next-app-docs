# バックエンド実装詳細（既存構造に合わせた形）

このドキュメントは、既存のCAMP_backプロジェクト構造に合わせたAzure AD認証の実装詳細です。

---

## 既存構造の確認

```
既存の構造:
src/app/
├── core/
│   ├── config.py               # Pydantic設定（環境変数管理）
│   ├── app_factory.py          # FastAPIアプリファクトリ
│   ├── database.py             # SQLAlchemy非同期セッション
│   ├── lifespan.py             # アプリライフサイクル管理
│   ├── security/
│   │   ├── jwt.py              # JWT認証（既存）
│   │   ├── password.py         # パスワードハッシュ
│   │   └── api_key.py          # APIキー認証
│   └── exceptions.py           # カスタム例外
├── api/
│   ├── core/
│   │   └── dependencies.py     # 依存性注入（既存JWT認証）
│   ├── routes/
│   │   ├── system/             # システムルート
│   │   └── v1/                 # APIバージョン1
│   ├── middlewares/            # ミドルウェア
│   └── decorators/             # デコレーター
├── models/
│   ├── base.py                 # Base, Mixins
│   ├── sample_user.py          # ユーザーモデル（既存）
│   └── ...
├── repositories/               # リポジトリ層
├── services/                   # サービス層
└── schemas/                    # Pydanticスキーマ
```

**既存の認証方式**:
- JWT Bearer Token認証が実装済み
- `app/api/core/dependencies.py` に `get_current_user()` が存在
- `app/core/security/jwt.py` でトークン生成・検証

---

## 実装方針

### 統合アプローチ

既存のJWT認証インフラを活用し、Azure AD認証を**環境変数で切り替え可能**にします。

```
開発モード（AUTH_MODE=development）:
  - 既存のJWT認証（シンプルなトークン）
  - サンプルユーザーで自動ログイン

本番モード（AUTH_MODE=production）:
  - Azure AD Bearer Token検証
  - fastapi-azure-authを使用
```

---

## 1. 設定管理の更新

**src/app/core/config.py（更新）**

```python
"""アプリケーション設定管理モジュール。"""

import logging
import os
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

# ... 既存のget_env_file()はそのまま ...

class Settings(BaseSettings):
    """アプリケーション設定クラス。"""

    model_config = SettingsConfigDict(
        env_file=get_env_file(),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ================================================================================
    # 既存の設定（そのまま維持）
    # ================================================================================
    APP_NAME: str = "camp-backend"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: list[str] | None = None
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"

    # セキュリティ設定（既存）
    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production-must-be-32-chars-minimum",
        min_length=32,
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ... その他の既存設定 ...

    # ================================================================================
    # ✨ 追加: Azure AD認証設定
    # ================================================================================

    # 認証モード切り替え
    AUTH_MODE: Literal["development", "production"] = Field(
        default="development",
        description="Authentication mode: development (JWT) or production (Azure AD)",
    )

    # Azure AD設定（本番モード用）
    AZURE_TENANT_ID: str | None = Field(
        default=None,
        description="Azure AD Tenant ID",
    )
    AZURE_CLIENT_ID: str | None = Field(
        default=None,
        description="Azure AD Application (client) ID for backend",
    )
    AZURE_CLIENT_SECRET: str | None = Field(
        default=None,
        description="Azure AD Client Secret (optional for token validation)",
    )
    AZURE_OPENAPI_CLIENT_ID: str | None = Field(
        default=None,
        description="Azure AD Application (client) ID for Swagger UI",
    )

    # 開発モード設定
    DEV_MOCK_TOKEN: str = Field(
        default="mock-access-token-dev-12345",
        description="Development mode mock token",
    )
    DEV_MOCK_USER_EMAIL: str = Field(
        default="dev.user@example.com",
        description="Development mode mock user email",
    )
    DEV_MOCK_USER_OID: str = Field(
        default="dev-azure-oid-12345",
        description="Development mode mock Azure Object ID",
    )
    DEV_MOCK_USER_NAME: str = Field(
        default="Development User",
        description="Development mode mock user name",
    )

    # ================================================================================
    # バリデーション（既存の__init__に追加）
    # ================================================================================

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # 既存のバリデーション...
        # ALLOWED_ORIGINS設定
        if self.ALLOWED_ORIGINS is None:
            if self.ENVIRONMENT == "production":
                raise ValueError("本番環境ではALLOWED_ORIGINSを明示的に設定する必要があります")
            elif self.ENVIRONMENT == "staging":
                self.ALLOWED_ORIGINS = ["https://staging.example.com"]
            else:
                self.ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]

        # ✨ 追加: Azure AD設定の検証（本番モードのみ）
        if self.AUTH_MODE == "production":
            if not self.AZURE_TENANT_ID:
                raise ValueError("AUTH_MODE=productionの場合、AZURE_TENANT_IDが必要です")
            if not self.AZURE_CLIENT_ID:
                raise ValueError("AUTH_MODE=productionの場合、AZURE_CLIENT_IDが必要です")

            logger.info("✅ Azure AD認証が有効化されました（本番モード）")
        else:
            logger.info("⚠️  開発モード認証が有効化されました（モック認証）")

settings = Settings()
```

---

## 2. Azure AD認証モジュールの追加

**src/app/core/security/azure_ad.py（新規）**

```python
"""Azure AD Bearer Token検証モジュール。

本番環境でAzure ADのBearerトークンを検証します。
"""

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

# fastapi-azure-authが必要（本番モードのみ）
try:
    from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer
    from fastapi_azure_auth.user import User as AzureUser
    AZURE_AUTH_AVAILABLE = True
except ImportError:
    AZURE_AUTH_AVAILABLE = False
    AzureUser = None

# Azure AD認証スキーム（本番モードのみ初期化）
azure_scheme = None

if settings.AUTH_MODE == "production":
    if not AZURE_AUTH_AVAILABLE:
        raise ImportError(
            "AUTH_MODE=productionの場合、fastapi-azure-authが必要です。\n"
            "インストール: uv add fastapi-azure-auth"
        )

    azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
        app_client_id=settings.AZURE_CLIENT_ID,
        tenant_id=settings.AZURE_TENANT_ID,
        scopes={
            f'api://{settings.AZURE_CLIENT_ID}/access_as_user': 'Access API as user',
        },
        allow_guest_users=False,
    )


async def get_current_azure_user(
    user: AzureUser = Security(azure_scheme, scopes=['access_as_user'])
) -> AzureUser:
    """Azure ADから認証済みユーザーを取得（本番モードのみ）。

    Args:
        user: Azure ADから取得されたユーザー情報

    Returns:
        AzureUser: Azure ADユーザー情報

    Raises:
        HTTPException: 認証失敗時
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Azure AD authentication failed"
        )
    return user


async def initialize_azure_scheme():
    """Azure AD認証スキームを初期化（アプリ起動時に実行）。"""
    if settings.AUTH_MODE == "production" and azure_scheme:
        await azure_scheme.openid_config.load_config()
        print("✅ Azure AD authentication initialized")
    else:
        print("⚠️  Development authentication mode (Azure AD disabled)")
```

**src/app/core/security/dev_auth.py（新規）**

```python
"""開発モード用のモック認証。

開発環境で簡易的な認証を提供します。
"""

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

security = HTTPBearer()


class DevUser:
    """開発モード用のモックユーザークラス。

    Azure AD Userと互換性のある構造を持ちます。
    """

    def __init__(self):
        self.oid = settings.DEV_MOCK_USER_OID
        self.preferred_username = settings.DEV_MOCK_USER_EMAIL
        self.email = settings.DEV_MOCK_USER_EMAIL
        self.name = settings.DEV_MOCK_USER_NAME
        self.roles = []

    def __repr__(self):
        return f"<DevUser {self.email}>"


async def get_current_dev_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> DevUser:
    """開発モード用の認証（トークンチェックのみ）。

    Args:
        credentials: Bearerトークン

    Returns:
        DevUser: モックユーザー情報

    Raises:
        HTTPException: トークンが一致しない場合
    """
    token = credentials.credentials

    # モックトークンと一致するかチェック
    if token != settings.DEV_MOCK_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid development token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return DevUser()
```

---

## 3. 依存性注入の更新

**src/app/api/core/dependencies.py（更新）**

```python
"""FastAPI依存性注入（Dependency Injection）システムの定義。"""

from typing import Annotated

from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.models.sample_user import SampleUser
from app.services.sample_user import SampleUserService

# ================================================================================
# 既存の依存性（そのまま維持）
# ================================================================================

DatabaseDep = Annotated[AsyncSession, Depends(get_db)]

def get_user_service(db: DatabaseDep) -> SampleUserService:
    return SampleUserService(db)

UserServiceDep = Annotated[SampleUserService, Depends(get_user_service)]

# ... その他のサービス依存性 ...

# ================================================================================
# ✨ 追加: Azure AD / 開発モード認証
# ================================================================================

# 認証モードに応じてインポート
if settings.AUTH_MODE == "production":
    from app.core.security.azure_ad import get_current_azure_user, AzureUser
    AuthUserType = AzureUser
else:
    from app.core.security.dev_auth import get_current_dev_user, DevUser
    AuthUserType = DevUser


async def get_authenticated_user(
    user_service: UserServiceDep,
    azure_user: AuthUserType = Depends(
        get_current_azure_user if settings.AUTH_MODE == "production" else get_current_dev_user
    ),
) -> SampleUser:
    """認証されたユーザーを取得し、DBのUserモデルと紐付け。

    環境変数AUTH_MODEに応じて以下を切り替え:
    - production: Azure ADトークン検証
    - development: モックトークン検証

    Args:
        user_service: ユーザーサービス
        azure_user: Azure ADまたはDevユーザー

    Returns:
        SampleUser: データベースのユーザーモデル

    Raises:
        HTTPException: ユーザーが見つからない場合
    """
    # Azure OIDでユーザーを検索（または作成）
    user = await user_service.get_or_create_by_azure_oid(
        azure_oid=azure_user.oid,
        email=azure_user.email or azure_user.preferred_username,
        full_name=azure_user.name,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found or could not be created"
        )

    return user


async def get_current_active_user(
    current_user: Annotated[SampleUser, Depends(get_authenticated_user)],
) -> SampleUser:
    """認証されたユーザーのアクティブ状態を検証。"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# ================================================================================
# 依存性型アノテーション
# ================================================================================

CurrentUserDep = Annotated[SampleUser, Depends(get_current_active_user)]
"""認証済みアクティブユーザーの依存性型。"""

# 既存のCurrentSuperuserDep, CurrentUserOptionalDep等はそのまま維持
# ...
```

---

## 4. ユーザーサービスの更新

**src/app/services/sample_user.py（更新）**

```python
"""ユーザーサービス層。"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.sample_user import SampleUser
from app.repositories.sample_user import SampleUserRepository


class SampleUserService:
    """ユーザー関連のビジネスロジック。"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = SampleUserRepository(db)

    # ... 既存のメソッド ...

    async def get_or_create_by_azure_oid(
        self,
        azure_oid: str,
        email: str,
        full_name: str | None = None,
    ) -> SampleUser:
        """Azure OIDでユーザーを取得、または新規作成。

        Args:
            azure_oid: Azure AD Object ID
            email: メールアドレス
            full_name: フルネーム（オプション）

        Returns:
            SampleUser: ユーザーモデル
        """
        # Azure OIDで検索
        stmt = select(SampleUser).where(SampleUser.azure_oid == azure_oid)
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            # 既存ユーザーの情報を更新（メール/名前が変わった場合）
            if user.email != email:
                user.email = email
            if full_name and user.full_name != full_name:
                user.full_name = full_name
            await self.db.commit()
            await self.db.refresh(user)
            return user

        # 新規ユーザーを作成
        new_user = SampleUser(
            azure_oid=azure_oid,
            email=email,
            username=email.split('@')[0],  # メールの@前をユーザー名に
            full_name=full_name,
            is_active=True,
            is_superuser=False,
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        return new_user
```

---

## 5. ユーザーモデルの更新

**src/app/models/sample_user.py（更新）**

```python
"""ユーザーモデル定義。"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, PrimaryKeyMixin, TimestampMixin


class SampleUser(Base, PrimaryKeyMixin, TimestampMixin):
    """ユーザーモデル。"""

    __tablename__ = "sample_users"

    # 既存のフィールド
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)  # 開発モード用
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)

    # ✨ 追加: Azure AD連携用フィールド
    azure_oid: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True,
        comment="Azure AD Object ID",
    )

    def __repr__(self):
        return f"<SampleUser {self.username}>"
```

---

## 6. マイグレーション

**alembic/versions/xxx_add_azure_oid.py（新規）**

```python
"""Add azure_oid to sample_users table

Revision ID: xxx
Revises: previous_revision
Create Date: 2025-01-XX XX:XX:XX.XXXXXX
"""
from alembic import op
import sqlalchemy as sa

revision = 'xxx'
down_revision = 'previous_revision'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # azure_oidカラムを追加
    op.add_column(
        'sample_users',
        sa.Column(
            'azure_oid',
            sa.String(length=255),
            nullable=True,
            comment='Azure AD Object ID'
        )
    )

    # インデックスとユニーク制約を追加
    op.create_index('ix_sample_users_azure_oid', 'sample_users', ['azure_oid'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_sample_users_azure_oid', table_name='sample_users')
    op.drop_column('sample_users', 'azure_oid')
```

---

## 7. アプリファクトリの更新

**src/app/core/app_factory.py（更新）**

```python
"""FastAPIアプリケーション生成ファクトリー。"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.core import register_exception_handlers
from app.api.middlewares import (
    ErrorHandlerMiddleware,
    LoggingMiddleware,
    PrometheusMetricsMiddleware,
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
)
from app.api.routes.system import health, metrics, root
from app.api.routes.v1 import sample_agents, sample_files, sample_sessions, sample_users
from app.core.config import settings
from app.core.lifespan import lifespan


def create_app() -> FastAPI:
    """FastAPIアプリケーションインスタンスを作成。"""

    # ✨ 追加: Swagger UIのOAuth設定（本番モードのみ）
    swagger_ui_init_oauth = None
    if settings.AUTH_MODE == "production":
        swagger_ui_init_oauth = {
            'usePkceWithAuthorizationCodeGrant': True,
            'clientId': settings.AZURE_OPENAPI_CLIENT_ID,
            'scopes': f'api://{settings.AZURE_CLIENT_ID}/access_as_user',
        }

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description=f"""
    # AIエージェントアプリケーション API

    ## 認証モード: {settings.AUTH_MODE}

    {"### Azure AD認証が有効です" if settings.AUTH_MODE == "production" else "### 開発モード認証（モック）"}

    ## 主な機能
    - AIエージェントとのチャット
    - セッション管理
    - ファイル処理
    - 認証・認可（Azure AD / 開発モック）
        """,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        swagger_ui_oauth2_redirect_url='/oauth2-redirect' if settings.AUTH_MODE == "production" else None,
        swagger_ui_init_oauth=swagger_ui_init_oauth,
    )

    # 例外ハンドラーを登録
    register_exception_handlers(app)

    # ミドルウェア登録（既存のまま）
    app.add_middleware(PrometheusMetricsMiddleware)
    app.add_middleware(ErrorHandlerMiddleware)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(
        RateLimitMiddleware,
        calls=settings.RATE_LIMIT_CALLS,
        period=settings.RATE_LIMIT_PERIOD,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS or [],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["Accept", "Content-Type", "Authorization", "X-API-Key"],
    )
    app.add_middleware(SecurityHeadersMiddleware)

    # ルーター登録（既存のまま）
    app.include_router(sample_users.router, prefix="/api/v1/sample-users", tags=["sample-users"])
    app.include_router(sample_agents.router, prefix="/api/v1/sample-agents", tags=["sample-agents"])
    app.include_router(sample_sessions.router, prefix="/api/v1/sample-sessions", tags=["sample-sessions"])
    app.include_router(sample_files.router, prefix="/api/v1/sample-files", tags=["sample-files"])
    app.include_router(root.router, tags=["root"])
    app.include_router(health.router, tags=["health"])
    app.include_router(metrics.router, tags=["metrics"])

    return app
```

**src/app/core/lifespan.py（更新）**

```python
"""アプリケーションライフサイクル管理。"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.database import close_db, init_db
from app.core.logging import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリケーションのライフサイクル管理。"""
    # 起動時
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.VERSION}")
    logger.info(f"📌 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🔐 Auth Mode: {settings.AUTH_MODE}")

    await init_db()

    # ✨ 追加: Azure AD初期化（本番モードのみ）
    if settings.AUTH_MODE == "production":
        from app.core.security.azure_ad import initialize_azure_scheme
        await initialize_azure_scheme()

    yield

    # 終了時
    logger.info("Shutting down application...")
    await close_db()
```

---

## 8. 環境変数設定

**.env.local（開発モード）**

```bash
# 環境設定
ENVIRONMENT=development
DEBUG=True

# 認証モード
AUTH_MODE=development

# 開発モック認証設定
DEV_MOCK_TOKEN=mock-access-token-dev-12345
DEV_MOCK_USER_EMAIL=dev.user@example.com
DEV_MOCK_USER_OID=dev-azure-oid-12345
DEV_MOCK_USER_NAME=Development User

# データベース
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/app_db

# Azure AD（開発時は不要）
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_OPENAPI_CLIENT_ID=

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]
```

**.env.production（本番モード）**

```bash
# 環境設定
ENVIRONMENT=production
DEBUG=False

# 認証モード
AUTH_MODE=production

# Azure AD設定
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-backend-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_OPENAPI_CLIENT_ID=your-frontend-client-id

# データベース
DATABASE_URL=postgresql+asyncpg://prod-db:5432/app_db

# セキュリティ
SECRET_KEY=<32文字以上のランダム文字列>

# CORS
ALLOWED_ORIGINS=["https://app.example.com"]
```

---

## 9. 使い方

### 開発モード

```bash
# 環境変数設定
export AUTH_MODE=development

# アプリ起動
uv run uvicorn app.main:app --reload

# APIテスト（モックトークンを使用）
curl -H "Authorization: Bearer mock-access-token-dev-12345" \
  http://localhost:8000/api/v1/sample-users/me
```

### 本番モード

```bash
# 環境変数設定
export AUTH_MODE=production
export AZURE_TENANT_ID=your-tenant-id
export AZURE_CLIENT_ID=your-client-id

# マイグレーション実行
alembic upgrade head

# アプリ起動
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Swagger UIでAzure ADログイン
# → http://localhost:8000/docs
```

---

## 10. 既存構造との統合ポイント

| 既存機能 | 統合方法 |
|---------|---------|
| `core/config.py` | Azure AD環境変数を追加 |
| `core/security/jwt.py` | 既存のまま（開発モード用） |
| `api/core/dependencies.py` | `get_authenticated_user()`を追加、認証モード切り替え |
| `models/sample_user.py` | `azure_oid`フィールドを追加 |
| `services/sample_user.py` | `get_or_create_by_azure_oid()`メソッド追加 |
| `core/app_factory.py` | Swagger OAuthサポート追加 |
| `core/lifespan.py` | Azure AD初期化処理追加 |

---

## 11. パッケージインストール

**pyproject.toml（追加）**

```toml
[project]
dependencies = [
    # 既存の依存関係...
    "fastapi-azure-auth>=4.3.0",  # ✨ 追加
]
```

**インストール**

```bash
uv add fastapi-azure-auth
```

---

## まとめ

既存の構造を最大限活用しながら、Azure AD認証を統合しました：

✅ **既存のJWT認証を保持**（開発モード用）
✅ **環境変数で認証モード切り替え**（`AUTH_MODE`）
✅ **既存の依存性注入パターンを活用**
✅ **Repository/Serviceパターンを維持**
✅ **Alembicマイグレーションで段階的導入**

これにより、開発効率を保ちながら、本番環境でAzure AD認証を使用できます。
