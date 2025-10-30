# Plop テンプレート

このディレクトリには、Plopによるコード生成用のテンプレートファイルが含まれています。

## ディレクトリ構成

```
plop-templates/
├── feature/                    # Feature生成用テンプレート
│   ├── api-get-list.hbs       # API: 一覧取得
│   ├── api-get-single.hbs     # API: 単体取得
│   ├── api-create.hbs         # API: 作成
│   ├── api-update.hbs         # API: 更新
│   ├── api-delete.hbs         # API: 削除
│   ├── api-index.hbs          # API: index
│   ├── types-index.hbs        # 型定義
│   ├── schema.hbs             # バリデーションスキーマ
│   ├── feature-form.hbs       # Feature共有フォーム
│   ├── feature-form-stories.hbs # Feature共有フォームのストーリー
│   ├── route-container.hbs    # ルートコンテナ
│   ├── route-hook.hbs         # ルートフック
│   ├── route-stories.hbs      # ルートストーリー
│   ├── route-index.hbs        # ルートindex
│   └── feature-index.hbs      # Featureindex
├── route/                      # Route生成用テンプレート
│   ├── route-container.hbs
│   ├── route-hook.hbs
│   ├── route-stories.hbs
│   └── route-index.hbs
├── component/                  # Component生成用テンプレート
│   ├── component.hbs
│   ├── stories-ui.hbs
│   ├── stories-layout.hbs
│   └── index.hbs              # UIコンポーネント用のみ
└── app-page/                   # App Routerページ生成用テンプレート
    ├── page.hbs
    └── loading.hbs
```

## 使用方法

### Feature生成

新しいfeatureを作成します。

```bash
pnpm generate:feature
```

**生成されるファイル:**
- `api/get-{{featureName}}s.ts` - 一覧取得API
- `api/get-{{featureName}}.ts` - 単体取得API
- `api/create-{{featureName}}.ts` - 作成API
- `api/update-{{featureName}}.ts` - 更新API
- `api/delete-{{featureName}}.ts` - 削除API
- `api/index.ts` - APIエクスポート
- `types/index.ts` - 型定義
- `schemas/{{featureName}}.schema.ts` - Zodバリデーションスキーマ
- `components/{{featureName}}-form.tsx` - Feature共有フォームコンポーネント
- `components/{{featureName}}-form.stories.tsx` - Feature共有フォームのストーリー
- `routes/{{routeName}}/{{routeName}}.tsx` - ページコンポーネント
- `routes/{{routeName}}/{{routeName}}.hook.ts` - カスタムフック
- `routes/{{routeName}}/{{routeName}}.stories.tsx` - Storybookストーリー
- `routes/{{routeName}}/index.ts` - エクスポート
- `index.ts` - Featureエクスポート

### Route生成

既存のfeature内に新しいrouteを追加します。

```bash
pnpm generate:route
```

**生成されるファイル:**
- `routes/{{routeName}}/{{routeName}}.tsx` - ページコンポーネント
- `routes/{{routeName}}/{{routeName}}.hook.ts` - カスタムフック
- `routes/{{routeName}}/{{routeName}}.stories.tsx` - Storybookストーリー
- `routes/{{routeName}}/index.ts` - エクスポート

**注意:** Route生成ではfeature直下の共有コンポーネント（`components/{{featureName}}-form.tsx`）を使用することを想定しています。ルート固有のコンポーネントが必要な場合は、手動で`components/`ディレクトリを作成してください。

### Component生成

汎用UIコンポーネントまたはレイアウトコンポーネントを作成します。

```bash
pnpm generate:component
```

**コンポーネントタイプ:**
- `ui` - 汎用UIコンポーネント（ボタン、インプットなど）
- `layout` - レイアウトコンポーネント（ヘッダー、フッターなど）

**生成されるファイル:**

UIコンポーネント（サブディレクトリ構造）:
- `components/sample-ui/{{componentName}}/{{componentName}}.tsx` - コンポーネント本体
- `components/sample-ui/{{componentName}}/{{componentName}}.stories.tsx` - Storybookストーリー
- `components/sample-ui/{{componentName}}/index.ts` - エクスポート

レイアウトコンポーネント（フラット構造）:
- `components/layout/{{componentName}}.tsx` - コンポーネント本体（直接配置）
- `components/layout/{{componentName}}.stories.tsx` - Storybookストーリー（直接配置）

**注意:** レイアウトコンポーネントはindex.tsを生成しません。直接インポートして使用します。

### App Routerページ生成

Next.js App Routerのページファイルを作成します。既存のfeature/routeを参照してApp Routerのページを追加します。

```bash
pnpm generate:app-page
```

**注意:** 先にfeatureとrouteを作成してから、このジェネレーターを使用してください。

**プロンプト:**
- Feature名（既存のfeatureを指定）
- Route名（既存のrouteを指定）
- App Routerのパス（例: `sample-users`, `sample-users/[id]/edit`）
- ページタイトル（例: ユーザー一覧）
- ページ説明
- loading.tsxを作成するか（オプション）

**生成されるファイル:**
- `app/(sample)/{{appPath}}/page.tsx` - ページファイル（metadataとfeature export）
- `app/(sample)/{{appPath}}/loading.tsx` - ローディング状態（オプション）

## テンプレートの特徴

### コメントブロック

すべてのテンプレートには、コードの可読性を向上させるセクション区切りコメントブロックが含まれています。

```typescript
// ================================================================================
// Hooks
// ================================================================================
```

**注意:** 使用しないコメントブロックは削除してください。

### 含まれるセクション

#### カスタムフック (.hook.ts)
- `Hooks` - フックの使用
- `Form` - フォームの定義（必要に応じて）
- `Handlers` - イベントハンドラー

#### ページコンポーネント (.tsx)
- `Hooks` - カスタムフックの呼び出し
- `Conditional Rendering` - ローディング・エラー処理

#### プレゼンテーショナルコンポーネント
- `Variables` - 計算された変数

## 命名規則

- **Feature名/Route名/Component名**: kebab-case（例: `user-list`, `blog-post`）
- **生成されるコンポーネント名**: PascalCase（例: `UserList`, `BlogPost`）
- **生成される関数名**: camelCase（例: `useUserList`, `useBlogPost`）

## カスタマイズ

テンプレートをカスタマイズする場合は、このディレクトリ内の`.hbs`ファイルを編集してください。

### Handlebarsヘルパー

`plopfile.js`で定義されているヘルパー関数:

- `{{pascalCase text}}` - PascalCaseに変換
- `{{camelCase text}}` - camelCaseに変換
- `{{kebabCase text}}` - kebab-caseに変換

## 関連ドキュメント

- [Plopドキュメント](https://plopjs.com/)
- [プロジェクトガイド](../docs/06-guides/01-create-component.md)
