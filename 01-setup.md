# Windows開発環境セットアップ手順

このドキュメントでは、Windows環境でこのプロジェクトの開発環境を構築する手順を説明します。

## 目次

1. [Chocolateyのインストール](#1-chocolateyのインストール)
2. [fnmのインストール](#2-fnmのインストール)
3. [Node.jsのインストール](#3-nodejsのインストール)
4. [pnpmのインストール](#4-pnpmのインストール)
5. [VSCodeのインストールと設定](#5-vscodeのインストールと設定)
6. [プロジェクトのセットアップ](#6-プロジェクトのセットアップ)
7. [トラブルシューティング](#7-トラブルシューティング)

---

## 1. Chocolateyのインストール

Chocolatey（チョコラティ）は、Windowsのパッケージマネージャーです。コマンドラインからソフトウェアを簡単にインストール・管理できます。

### 1-1. PowerShellを管理者権限で起動

1. Windowsキーを押して「PowerShell」と入力
2. 「Windows PowerShell」を右クリック → **「管理者として実行」** を選択

### 1-2. Chocolateyのインストール

以下のコマンドをPowerShellに貼り付けて実行します：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 1-3. インストール確認

```powershell
choco --version
```

バージョン番号が表示されればインストール成功です。

---

## 2. fnmのインストール

fnm（Fast Node Manager）は、Node.jsのバージョン管理ツールです。複数のNode.jsバージョンを簡単に切り替えられます。

### 2-1. Chocolateyでfnmをインストール

PowerShell（管理者権限）で以下を実行：

```powershell
choco install fnm -y
```

### 2-2. 環境変数の設定

PowerShellを再起動後、以下のコマンドで環境変数を設定します：

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

**永続的に設定する場合：**

PowerShellプロファイルに追加します：

```powershell
# プロファイルを開く
notepad $PROFILE
```

以下の行を追加して保存：

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

### 2-3. インストール確認

```powershell
fnm --version
```

---

## 3. Node.jsのインストール

このプロジェクトでは **Node.js 22.20.0以上** が必要です。

### 3-1. fnmでNode.jsをインストール

```powershell
fnm install 22.20.0
```

### 3-2. デフォルトバージョンに設定

```powershell
fnm default 22.20.0
```

### 3-3. インストール確認

```powershell
node --version
# v22.20.0 と表示されればOK
```

---

## 4. pnpmのインストール

pnpmは、高速で効率的なパッケージマネージャーです。

### 4-1. npmでpnpmをインストール

```powershell
npm install -g pnpm@10.18.1
```

### 4-2. インストール確認

```powershell
pnpm --version
# 10.18.1 と表示されればOK
```

---

## 5. VSCodeのインストールと設定

### 5-1. VSCodeのインストール

[公式サイト](https://code.visualstudio.com/)からインストーラーをダウンロードしてインストールします。

1. https://code.visualstudio.com/ にアクセス
2. 「Download for Windows」をクリック
3. ダウンロードした `VSCodeUserSetup-x64-x.x.x.exe` を実行
4. インストールウィザードに従ってインストール

### 5-2. 推奨拡張機能のインストール

VSCodeでこのプロジェクトを開くと、推奨拡張機能のインストールを促すメッセージが表示されます。

**手動でインストールする場合：**

1. VSCodeを開く
2. `Ctrl + Shift + P` → `Extensions: Show Recommended Extensions` を選択
3. 表示された拡張機能をすべてインストール

**主な拡張機能：**

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Pretty TypeScript Errors
- Error Lens
- GitLens

### 5-3. VSCodeの設定

プロジェクトの `.vscode/settings.json` に以下の設定が含まれています：

- ファイル保存時に自動フォーマット（Prettier）
- ファイル保存時にESLintの自動修正
- TypeScript設定

**※ 設定は自動的に適用されます**

---

## 6. プロジェクトのセットアップ

### 6-1. プロジェクトのクローン

```powershell
git clone <リポジトリURL>
cd CAMP_front
```

### 6-2. 依存パッケージのインストール

```powershell
pnpm install
```

### 6-3. 開発サーバーの起動

```powershell
pnpm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認できます。

### 6-4. VSCodeでデバッグ

1. VSCodeでプロジェクトを開く
2. `F5` キーを押す
3. 開発サーバーが自動起動し、Chromeでデバッグモードが起動します

---

## 7. トラブルシューティング

### PowerShellでスクリプト実行がブロックされる

**エラー例：**

```
このシステムではスクリプトの実行が無効になっているため、ファイル xxx.ps1 を読み込むことができません。
```

**解決方法：**

PowerShell（管理者権限）で以下を実行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### fnmコマンドが見つからない

Chocolateyでインストール後、PowerShellを再起動してください。

```powershell
# PowerShellを閉じて再度開く
fnm --version
```

### pnpm installでエラーが発生する

**Node.jsのバージョンを確認：**

```powershell
node --version
# v22.20.0以上であることを確認
```

**キャッシュをクリア：**

```powershell
pnpm store prune
pnpm install
```

### ポート3000が既に使用されている

```powershell
# 別のポートで起動
pnpm run dev -- -p 3001
```

### VSCodeでESLintが動作しない

1. VSCodeを再起動
2. `Ctrl + Shift + P` → `ESLint: Restart ESLint Server` を実行
3. `.vscode/settings.json` が正しく読み込まれているか確認

---

## よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm run dev` | 開発サーバーを起動（Turbopack使用） |
| `pnpm run build` | 本番用ビルドを作成 |
| `pnpm run start` | ビルドしたアプリを起動 |
| `pnpm run typecheck` | TypeScriptの型チェック |
| `pnpm run lint` | ESLintでコードをチェック |
| `pnpm run lint:fix` | ESLintでコードを自動修正 |
| `pnpm run format` | Prettierでコードを整形 |
| `pnpm run format:check` | コード整形が必要かチェック |
| `pnpm run ci` | CI用のチェック（型・lint・format・build） |

---

## 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

- **[プロジェクト構成](./02-project-structure.md)** - ディレクトリ構造とアーキテクチャの理解
- **[使用ライブラリ一覧](./03-libraries.md)** - 使用している技術スタックの把握
- **[状態管理戦略](./04-state-management.md)** - useState/Zustand/TanStack Queryの使い分け
- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧

---

## 参考リンク

- [Chocolatey公式サイト](https://chocolatey.org/)
- [fnm公式ドキュメント](https://github.com/Schniz/fnm)
- [pnpm公式ドキュメント](https://pnpm.io/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [VSCode公式サイト](https://code.visualstudio.com/)
