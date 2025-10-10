# 環境構築ガイド

このドキュメントでは、本プロジェクトの開発環境を構築する手順を説明します。

## 目次

1. [前提条件](#前提条件)
2. [Chocolateyのインストール](#chocolateyのインストール)
3. [fnmのインストール](#fnmのインストール)
4. [Node.jsのインストール](#nodejsのインストール)
5. [pnpmのインストール](#pnpmのインストール)
6. [VSCodeのインストールと設定](#vscodeのインストールと設定)
7. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
8. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

- **OS**: Windows 10/11、macOS、Linux
- **Node.js**: v22.20.0（必須）
- **pnpm**: v10.18.1（必須）
- **メモリ**: 8GB以上推奨
- **ディスク空き容量**: 5GB以上

---

## Chocolateyのインストール

Chocolatey（チョコラティ）は、Windowsのパッケージマネージャーです。コマンドラインからソフトウェアを簡単にインストール・管理できます。

### PowerShellを管理者権限で起動

1. Windowsキーを押して「PowerShell」と入力
2. 「Windows PowerShell」を右クリック → **「管理者として実行」** を選択

### Chocolateyのインストール

以下のコマンドをPowerShellに貼り付けて実行します：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### インストール確認

```powershell
choco --version
```

バージョン番号が表示されればインストール成功です。

---

## fnmのインストール

fnm（Fast Node Manager）は、Node.jsのバージョン管理ツールです。複数のNode.jsバージョンを簡単に切り替えられます。

### Chocolateyでfnmをインストール

PowerShell（管理者権限）で以下を実行：

```powershell
choco install fnm -y
```

### 環境変数の設定

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

### インストール確認

```powershell
fnm --version
```

---

## Node.jsのインストール

アプリでは **Node.js v22.20.0** が必要です。

### fnmでNode.jsをインストール

```powershell
fnm install 22.20.0
```

### デフォルトバージョンに設定

```powershell
fnm default 22.20.0
```

### インストール確認

```powershell
node --version
# v22.20.0 と表示されればOK
```

---

## pnpmのインストール

pnpmは、高速で効率的なパッケージマネージャーです。このプロジェクトでは **pnpm v10.18.1** を使用します。

### npmでpnpmをインストール

```powershell
npm install -g pnpm@10.18.1
```

### インストール確認

```powershell
pnpm --version
# 10.18.1 と表示されればOK
```

---

## VSCodeのインストールと設定

### VSCodeのインストール

[公式サイト](https://code.visualstudio.com/)からインストーラーをダウンロードしてインストールします。

1. https://code.visualstudio.com/ にアクセス
2. 「Download for Windows」をクリック
3. ダウンロードした `VSCodeUserSetup-x64-x.x.x.exe` を実行
4. インストールウィザードに従ってインストール

### 推奨拡張機能のインストール

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

### VSCodeの設定

プロジェクトの `.vscode/settings.json` に以下の設定が含まれています：

- ファイル保存時に自動フォーマット（Prettier）
- ファイル保存時にESLintの自動修正
- TypeScript設定

**※ 設定は自動的に適用されます**

---

## プロジェクトのセットアップ

### プロジェクトのクローン

```bash
git clone <リポジトリURL>
cd CAMP_front
```

### 依存パッケージのインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認できます。

### VSCodeでデバッグ

1. VSCodeでプロジェクトを開く
2. `F5` キーを押す
3. 開発サーバーが自動起動し、Chromeでデバッグモードが起動します

---

## トラブルシューティング

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

```bash
node --version
# v22.20.0 であることを確認
```

**キャッシュをクリア：**

```bash
pnpm store prune
pnpm install
```

### ポート3000が既に使用されている

```bash
# 別のポートで起動
pnpm dev -- -p 3001
```

### VSCodeでESLintが動作しない

1. VSCodeを再起動
2. `Ctrl + Shift + P` → `ESLint: Restart ESLint Server` を実行
3. `.vscode/settings.json` が正しく読み込まれているか確認

---

## よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm build` | 本番用ビルドを作成 |
| `pnpm typecheck` | TypeScriptの型チェック |
| `pnpm lint` | ESLintでコードをチェック |
| `pnpm lint:fix` | ESLintでコードを自動修正 |
| `pnpm format` | Prettierでコードを整形 |
| `pnpm test` | テストを実行 |

---

## 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

- **[プロジェクト構成](../02-architecture/01-project-structure.md)** - ディレクトリ構造とアーキテクチャの理解
- **[技術スタック](../03-core-concepts/01-tech-stack.md)** - 使用している技術スタックの把握
- **[クイックスタート](./02-quick-start.md)** - すぐに開発を始める

---

## 参考リンク

- [Chocolatey公式サイト](https://chocolatey.org/)
- [fnm公式ドキュメント](https://github.com/Schniz/fnm)
- [pnpm公式ドキュメント](https://pnpm.io/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [VSCode公式サイト](https://code.visualstudio.com/)
