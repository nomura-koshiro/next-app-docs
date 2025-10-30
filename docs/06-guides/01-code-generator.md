# コード生成ツール（Plop）の使い方

このプロジェクトでは、[Plop](https://plopjs.com/)を使用してコードを自動生成できます。

## 概要

Plopは、一貫性のあるコードを素早く生成するためのツールです。以下の4つのジェネレーターが利用可能です：

- **Feature Generator**: 新しいfeatureを完全に作成
- **Route Generator**: 既存のfeature内にrouteを追加
- **Component Generator**: 汎用UIコンポーネントを作成
- **App Page Generator**: Next.js App Routerのページファイルを作成

## 利用可能なジェネレーター

### 1. Feature Generator

新しいfeatureを完全に作成します。以下のファイルが生成されます：

- `src/features/{feature-name}/api/` - API関連ファイル
  - `get-{feature-name}s.ts` - 一覧取得API + フック
  - `get-{feature-name}.ts` - 単体取得API + フック
  - `create-{feature-name}.ts` - 作成API + フック
  - `update-{feature-name}.ts` - 更新API + フック
  - `delete-{feature-name}.ts` - 削除API + フック
  - `index.ts` - APIエクスポート
- `src/features/{feature-name}/types/index.ts` - 型定義
- `src/features/{feature-name}/schemas/{feature-name}.schema.ts` - Zodバリデーションスキーマ
- `src/features/{feature-name}/components/` - Feature共有コンポーネント
  - `{feature-name}-form.tsx` - 共有フォームコンポーネント
  - `{feature-name}-form.stories.tsx` - フォームのストーリー
- `src/features/{feature-name}/routes/{route-name}/` - ルートディレクトリ
  - `{route-name}.tsx` - ページコンポーネント
  - `{route-name}.hook.ts` - カスタムフック
  - `{route-name}.stories.tsx` - Storybookストーリー
  - `index.ts` - エクスポートファイル
- `src/features/{feature-name}/index.ts` - Featureのメインエクスポートファイル

**使用方法:**

```bash
# 対話形式で作成
pnpm generate:feature

# または
pnpm generate
# -> "feature" を選択
```

**入力例:**

```text
Feature名を入力してください: blog
Route名を入力してください: list
```

**生成されるファイル構造:**

```text
src/features/blog/
├── api/
│   ├── get-blogs.ts
│   ├── get-blog.ts
│   ├── create-blog.ts
│   ├── update-blog.ts
│   ├── delete-blog.ts
│   └── index.ts
├── types/
│   └── index.ts
├── schemas/
│   └── blog.schema.ts
├── components/
│   ├── blog-form.tsx
│   └── blog-form.stories.tsx
├── routes/
│   └── list/
│       ├── list.tsx
│       ├── list.hook.ts
│       ├── list.stories.tsx
│       └── index.ts
└── index.ts
```

### 2. Route Generator

既存のfeature内に新しいrouteを追加します。

**使用方法:**

```bash
pnpm generate:route
```

**入力例:**

```text
既存のFeature名を入力してください: blog
新しいRoute名を入力してください: detail
```

**生成されるファイル構造:**

```text
src/features/blog/routes/detail/
├── detail.tsx
├── detail.hook.ts
├── detail.stories.tsx
└── index.ts
```

**注意:** Route生成ではfeature直下の共有コンポーネント（`components/blog-form.tsx`）を使用することを想定しています。ルート固有のコンポーネントが必要な場合は、手動で`components/`ディレクトリを作成してください。

### 3. Component Generator

汎用UIコンポーネントを作成します。

**使用方法:**

```bash
pnpm generate:component
```

**入力例:**

```text
コンポーネントのタイプを選択してください: ui (または layout)
コンポーネント名を入力してください: modal
```

**生成されるファイル構造:**

UIコンポーネント（サブディレクトリ構造）:

```text
src/components/sample-ui/modal/
├── modal.tsx
├── modal.stories.tsx
└── index.ts
```

レイアウトコンポーネント（フラット構造）:

```text
src/components/layout/
├── sidebar.tsx
└── sidebar.stories.tsx
```

**注意:** レイアウトコンポーネントはindex.tsを生成しません。直接インポートして使用します。

### 4. App Page Generator

Next.js App Routerのページファイルを作成します。既存のfeatureとrouteを参照してApp Routerのページを追加します。

**注意:** 先にfeatureとrouteを作成してから、このジェネレーターを使用してください。

**使用方法:**

```bash
pnpm generate:app-page
```

**入力例:**

```text
既存のFeature名を入力してください: blog
既存のRoute名を入力してください: list
App Routerのパスを入力してください: blog
ページタイトルを入力してください: ブログ一覧
ページ説明を入力してください: ブログ記事の一覧ページです
loading.tsxを作成しますか? Yes
```

**生成されるファイル構造:**

```text
src/app/(sample)/blog/
├── page.tsx (metadata + feature export)
└── loading.tsx (オプション)
```

**生成されるpage.tsx:**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ブログ一覧 | Sample App',
  description: 'ブログ記事の一覧ページです',
};

export { default } from '@/features/blog/routes/list';
```

## 命名規則

### Feature名 / Route名 / Component名

- **kebab-case** (小文字とハイフン) を使用
- 例: `blog-post`, `user-profile`, `modal-dialog`

### 自動変換

Plopは入力された名前を自動的に以下の形式に変換します：

- **PascalCase**: `BlogPost`, `UserProfile` (コンポーネント名、型名)
- **camelCase**: `blogPost`, `userProfile` (変数名、関数名)
- **kebab-case**: `blog-post`, `user-profile` (ファイル名、ディレクトリ名)

## 生成後の作業

生成されたファイルには `TODO:` コメントが含まれています。以下の作業を行ってください：

### Feature Generator

1. **API ファイル** (`api/*.ts`)
   - APIエンドポイントを実際のパスに修正
   - 必要に応じてリクエスト/レスポンス型を調整

2. **Types ファイル** (`types/index.ts`)
   - 必要なフィールドを追加
   - 型定義を完成させる

3. **Schema ファイル** (`schemas/*.schema.ts`)
   - 必要なフィールドを追加
   - バリデーションルールを設定

4. **Hook ファイル** (`*.hook.ts`)
   - フォームのデフォルト値を設定
   - 送信処理を実装

5. **Form コンポーネント** (`components/*-form.tsx`)
   - 必要なフォームフィールドを追加
   - UIをカスタマイズ

### Route Generator

1. **Hook ファイル** - 既存のAPI、schema、共有コンポーネントをインポート
2. **Container コンポーネント** - ページロジックを実装
3. **Stories ファイル** - ストーリーを追加、カスタマイズ

**注意:** 必要に応じて、feature直下の共有コンポーネントを編集するか、ルート固有の`components/`ディレクトリを手動で作成してください。

### Component Generator

1. **Component ファイル** - propsを追加、実装を完成させる
2. **Stories ファイル** - ストーリーを追加、カスタマイズ

### App Page Generator

1. **Metadata** - タイトルと説明が適切か確認
2. **Export** - featureとrouteのパスが正しいか確認
3. **Loading** - 必要に応じてローディング状態をカスタマイズ

## プロジェクト構造の確認

生成されたコードは以下のプロジェクト構造に従います：

```text
src/
├── features/           # Feature単位の機能
│   ├── {feature}/
│   │   ├── api/       # API通信
│   │   ├── routes/    # ルート（ページ）
│   │   ├── schemas/   # Feature固有のバリデーションスキーマ
│   │   ├── stores/    # 状態管理
│   │   └── index.ts
│   └── ...
├── components/        # 汎用コンポーネント
│   ├── ui/           # UIコンポーネント
│   └── layout/       # レイアウトコンポーネント
└── schemas/          # 共通バリデーションスキーマ（再利用可能）
    └── fields/       # フィールド単位のスキーマ (email, password, etc.)
```

## トラブルシューティング

### ファイルが生成されない

- Feature名やRoute名に使用できない文字が含まれていないか確認
- 既に同じ名前のディレクトリが存在しないか確認

### 生成されたコードがエラーになる

- `TODO:` コメントを確認し、必要な実装を追加
- TypeScriptの型エラーを解決
- インポートパスが正しいか確認

## 参考

- [Plop公式ドキュメント](https://plopjs.com/)
- [Handlebars公式ドキュメント](https://handlebarsjs.com/)
