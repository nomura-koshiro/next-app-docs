# 環境構築ガイド

開発環境のセットアップ手順を説明します。Windows、macOS、Linuxの各OS向けに、Node.js、pnpm、VSCodeの設定方法を解説します。

## 目次

1. [前提条件](#前提条件)
2. [Windows環境のセットアップ](#windows環境のセットアップ)
3. [macOS/Linux環境のセットアップ](#macoslinux環境のセットアップ)
4. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
5. [VSCode設定](#vscode設定)
6. [よく使うコマンド](#よく使うコマンド)
7. [トラブルシューティング](#トラブルシューティング)
8. [次のステップ](#次のステップ)

---

## 前提条件

- **OS**: Windows 10/11、macOS、Linux
- **Node.js**: v24.0.0 以上（推奨: v24.2.0）
- **pnpm**: v10.19.0 以上

---

## Windows環境のセットアップ

### 1. Chocolateyのインストール

PowerShell（管理者権限）で実行:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

確認:

```powershell
choco --version
```

### 2. fnmのインストール

```powershell
choco install fnm -y
```

PowerShellプロファイルに追加:

```powershell
notepad $PROFILE
```

以下を追加:

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

### 3. Node.jsのインストール

```powershell
fnm install 24.2.0
fnm default 24.2.0
node --version  # v24.2.0
```

### 4. pnpmのインストール

```powershell
npm install -g pnpm@latest
pnpm --version  # 10.19.0 以上
```

---

## macOS/Linux環境のセットアップ

### 1. fnmのインストール

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

### 2. Node.jsのインストール

```bash
fnm install 24.2.0
fnm default 24.2.0
node --version
```

### 3. pnpmのインストール

```bash
npm install -g pnpm@latest
pnpm --version
```

---

## プロジェクトのセットアップ

### 1. クローン

```bash
git clone <リポジトリURL>
cd next-app-docs
```

### 2. 依存関係インストール

```bash
pnpm install
```

### 3. 環境変数設定

```bash
cp .env.example .env.local
```

`.env.local` を編集:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

### 4. 開発サーバー起動

```bash
pnpm dev
```

<http://localhost:3000> にアクセス

---

## VSCode設定

### 推奨拡張機能

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Pretty TypeScript Errors

VSCodeでプロジェクトを開くと、自動的にインストールを促すメッセージが表示されます。

---

## よく使うコマンド

### 開発

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（Turbopack使用） |
| `pnpm build` | 本番ビルド（Turbopack使用） |
| `pnpm start` | 本番サーバー起動 |
| `pnpm storybook` | Storybook起動（port 6006） |

### コード品質

| コマンド | 説明 |
|---------|------|
| `pnpm typecheck` | 型チェック |
| `pnpm lint` | ESLintチェック |
| `pnpm lint:fix` | ESLint自動修正 |
| `pnpm stylelint` | StyleLintチェック |
| `pnpm stylelint:fix` | StyleLint自動修正 |
| `pnpm format` | Prettierで整形 |
| `pnpm format:check` | Prettierチェックのみ |
| `pnpm check` | すべてのチェックを一括実行 |
| `pnpm check:fix` | すべてのチェックと自動修正を一括実行 |

### テスト

| コマンド | 説明 |
|---------|------|
| `pnpm test` | Vitestユニットテスト実行 |
| `pnpm test:ui` | Vitest UIモード |
| `pnpm e2e` | Playwright E2Eテスト実行 |

### CI/CD

| コマンド | 説明 |
|---------|------|
| `pnpm ci` | CI用（check + build） |

---

## トラブルシューティング

### PowerShellでスクリプト実行がブロック

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### pnpm installでエラー

```bash
# Node.jsバージョン確認
node --version  # v22.20.0

# キャッシュクリア
pnpm store prune
pnpm install
```

### ポート3000が使用中

```bash
# 別のポートで起動
pnpm dev -- -p 3001
```

---

## 次のステップ

- [クイックスタート](./02-quick-start.md)
- [プロジェクト構造](../02-architecture/01-project-structure.md)
- [技術スタック](../03-core-concepts/01-tech-stack.md)
