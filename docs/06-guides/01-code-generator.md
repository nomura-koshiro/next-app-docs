# コード生成ツール（Plop）の使い方

このプロジェクトでは、[Plop](https://plopjs.com/)を使用してコードを自動生成できます。

## 概要

Plopは、一貫性のあるコードを素早く生成するためのツールです。以下の3つのジェネレーターが利用可能です：

- **Feature Generator**: 新しいfeatureを完全に作成
- **Route Generator**: 既存のfeature内にrouteを追加
- **Component Generator**: 汎用UIコンポーネントを作成

## 利用可能なジェネレーター

### 1. Feature Generator

新しいfeatureを完全に作成します。以下のファイルが生成されます：

- `src/features/{feature-name}/schemas/{feature-name}.schema.ts` - Zodバリデーションスキーマ
- `src/features/{feature-name}/routes/{route-name}/` - ルートディレクトリ
  - `{route-name}.tsx` - コンテナコンポーネント
  - `{route-name}.hook.ts` - カスタムフック
  - `components/{route-name}-form.tsx` - プレゼンテーションコンポーネント
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

```
Feature名を入力してください: blog
Route名を入力してください: list
```

**生成されるファイル構造:**

```
src/features/blog/
├── schemas/
│   └── blog.schema.ts
├── routes/
│   └── list/
│       ├── list.tsx (コンテナ)
│       ├── list.hook.ts (フック)
│       ├── components/
│       │   └── list-form.tsx (プレゼンテーション)
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

```
既存のFeature名を入力してください: blog
新しいRoute名を入力してください: detail
```

**生成されるファイル構造:**

```
src/features/blog/routes/detail/
├── detail.tsx
├── detail.hook.ts
├── components/
│   └── detail-form.tsx
└── index.ts
```

### 3. Component Generator

汎用UIコンポーネントを作成します。

**使用方法:**

```bash
pnpm generate:component
```

**入力例:**

```
コンポーネントのタイプを選択してください: ui (または layout)
コンポーネント名を入力してください: modal
```

**生成されるファイル構造:**

```
src/components/ui/modal/
├── modal.tsx
├── modal.stories.tsx
└── index.ts
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

1. **Schema ファイル** (`schemas/*.schema.ts`)
   - 必要なフィールドを追加
   - バリデーションルールを設定

2. **Hook ファイル** (`*.hook.ts`)
   - フォームのデフォルト値を設定
   - 送信処理を実装

3. **Form コンポーネント** (`components/*-form.tsx`)
   - 必要なフォームフィールドを追加
   - UIをカスタマイズ

### Route Generator

1. **Hook ファイル** - 既存のschemaをインポート
2. **Form コンポーネント** - 型定義とフィールドを追加

### Component Generator

1. **Component ファイル** - propsを追加、実装を完成させる
2. **Stories ファイル** - ストーリーを追加、カスタマイズ

## プロジェクト構造の確認

生成されたコードは以下のプロジェクト構造に従います：

```
src/
├── features/           # Feature単位の機能
│   ├── {feature}/
│   │   ├── api/       # API通信
│   │   ├── routes/    # ルート（ページ）
│   │   ├── schemas/   # バリデーションスキーマ
│   │   ├── stores/    # 状態管理
│   │   └── index.ts
│   └── ...
└── components/        # 汎用コンポーネント
    ├── ui/           # UIコンポーネント
    └── layout/       # レイアウトコンポーネント
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
