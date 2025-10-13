# Plop Templates

このディレクトリには、コード生成を自動化するためのHandlebarsテンプレートが含まれています。

## 📋 目次

- [概要](#概要)
- [使用方法](#使用方法)
- [テンプレート一覧](#テンプレート一覧)
- [ジェネレーター](#ジェネレーター)
- [Storybookテンプレート](#storybookテンプレート)
- [カスタマイズ](#カスタマイズ)

---

## 概要

Plopは、プロジェクト内でコードを一貫性を持って生成するためのツールです。このディレクトリ内のテンプレートは、新しいコンポーネント、フィーチャー、ルートを作成する際に使用されます。

## 使用方法

### 基本コマンド

```bash
# 対話型メニューを表示
pnpm generate

# または特定のジェネレーターを直接実行
pnpm generate:feature    # 新しいfeatureを作成
pnpm generate:route      # 既存feature内に新しいrouteを追加
pnpm generate:component  # 汎用UIコンポーネントを作成
```

### 実行例

#### 1. UIコンポーネントの作成

```bash
pnpm generate:component

# プロンプト:
# ? コンポーネントのタイプを選択してください: ui
# ? コンポーネント名を入力してください: modal

# 生成されるファイル:
# - src/components/ui/modal/modal.tsx
# - src/components/ui/modal/modal.stories.tsx (UIコンポーネント用)
# - src/components/ui/modal/index.ts
```

#### 2. レイアウトコンポーネントの作成

```bash
pnpm generate:component

# プロンプト:
# ? コンポーネントのタイプを選択してください: layout
# ? コンポーネント名を入力してください: sidebar

# 生成されるファイル:
# - src/components/layout/sidebar/sidebar.tsx
# - src/components/layout/sidebar/sidebar.stories.tsx (レイアウトコンポーネント用)
# - src/components/layout/sidebar/index.ts
```

#### 3. 新しいFeatureの作成

```bash
pnpm generate:feature

# プロンプト:
# ? Feature名を入力してください: product
# ? Route名を入力してください: [デフォルト: product]

# 生成されるファイル:
# - src/features/product/schemas/product.schema.ts
# - src/features/product/routes/product/product.tsx
# - src/features/product/routes/product/product.hook.ts
# - src/features/product/routes/product/product.stories.tsx
# - src/features/product/routes/product/components/product-form.tsx
# - src/features/product/routes/product/index.ts
# - src/features/product/index.ts
```

#### 4. 既存Feature内に新しいRouteを追加

```bash
pnpm generate:route

# プロンプト:
# ? 既存のFeature名を入力してください: product
# ? 新しいRoute名を入力してください: detail

# 生成されるファイル:
# - src/features/product/routes/detail/detail.tsx
# - src/features/product/routes/detail/detail.hook.ts
# - src/features/product/routes/detail/detail.stories.tsx
# - src/features/product/routes/detail/components/detail-form.tsx
# - src/features/product/routes/detail/index.ts
```

---

## テンプレート一覧

### Component Templates (`component/`)

| ファイル名 | 説明 | 用途 |
|----------|------|------|
| `component.hbs` | コンポーネント本体 | UIコンポーネント、レイアウトコンポーネント |
| `stories-ui.hbs` | UIコンポーネント用ストーリー | 基本的なUIコンポーネント（ボタン、入力など） |
| `stories-layout.hbs` | レイアウトコンポーネント用ストーリー | レイアウト構造を定義するコンポーネント |
| `stories.hbs` | ⚠️ 非推奨（後方互換性のため残存） | 旧バージョンのストーリーテンプレート |
| `index.hbs` | エクスポートファイル | コンポーネントのエクスポート |

### Feature Templates (`feature/`)

| ファイル名 | 説明 |
|----------|------|
| `schema.hbs` | バリデーションスキーマ（Zod） |
| `route-container.hbs` | ルートコンテナコンポーネント |
| `route-hook.hbs` | カスタムフック（ビジネスロジック） |
| `route-form.hbs` | プレゼンテーショナルコンポーネント |
| `route-stories.hbs` | ストーリーファイル（MSW付き） |
| `route-index.hbs` | ルートのエクスポートファイル |
| `feature-index.hbs` | フィーチャーのエクスポートファイル |

### Route Templates (`route/`)

| ファイル名 | 説明 |
|----------|------|
| `route-container.hbs` | ルートコンテナコンポーネント |
| `route-hook.hbs` | カスタムフック（ビジネスロジック） |
| `route-form.hbs` | プレゼンテーショナルコンポーネント |
| `route-stories.hbs` | ストーリーファイル（MSW付き） |
| `route-index.hbs` | ルートのエクスポートファイル |

---

## ジェネレーター

### 1. Feature Generator

**コマンド:** `pnpm generate:feature`

**説明:** 新しいfeatureを完全に作成します。

**プロンプト:**
- Feature名 (例: blog, product)
- Route名 (例: list, detail) ※省略可、デフォルトはFeature名

**生成されるファイル:**
```
src/features/{featureName}/
├── schemas/
│   └── {featureName}.schema.ts
├── routes/
│   └── {routeName}/
│       ├── {routeName}.tsx
│       ├── {routeName}.hook.ts
│       ├── {routeName}.stories.tsx
│       ├── components/
│       │   └── {routeName}-form.tsx
│       └── index.ts
└── index.ts
```

### 2. Route Generator

**コマンド:** `pnpm generate:route`

**説明:** 既存のfeature内に新しいrouteを追加します。

**プロンプト:**
- 既存のFeature名
- 新しいRoute名

**生成されるファイル:**
```
src/features/{featureName}/routes/{routeName}/
├── {routeName}.tsx
├── {routeName}.hook.ts
├── {routeName}.stories.tsx
├── components/
│   └── {routeName}-form.tsx
└── index.ts
```

### 3. Component Generator

**コマンド:** `pnpm generate:component`

**説明:** 汎用UIコンポーネントを作成します。

**プロンプト:**
- コンポーネントのタイプ (ui / layout)
- コンポーネント名

**生成されるファイル:**
```
src/components/{componentType}/{componentName}/
├── {componentName}.tsx
├── {componentName}.stories.tsx  # タイプに応じたテンプレートを使用
└── index.ts
```

**ストーリーテンプレートの選択:**
- `componentType === "layout"` → `stories-layout.hbs`
- `componentType === "ui"` → `stories-ui.hbs`

---

## Storybookテンプレート

### UI Component Stories (`stories-ui.hbs`)

**用途:** 基本的なUIコンポーネント（ボタン、入力、カードなど）

**特徴:**
- レイアウト: `centered`
- 詳細なコメント付き meta 属性
- 背景色テストオプション
- アクション設定
- デフォルト、カスタムスタイル、ダークモードのストーリー

**含まれるパラメータ:**
```typescript
{
  layout: "centered",
  docs: { description: { component: "..." } },
  backgrounds: { ... },
  actions: { argTypesRegex: "^on[A-Z].*" },
}
```

### Layout Component Stories (`stories-layout.hbs`)

**用途:** レイアウト構造を定義するコンポーネント

**特徴:**
- レイアウト: `fullscreen`
- レスポンシブテスト用ビューポート設定
- 複数のレイアウトパターン例
- モバイル、タブレット、デスクトップ表示のストーリー

**含まれるパラメータ:**
```typescript
{
  layout: "fullscreen",
  docs: { description: { component: "..." } },
  backgrounds: { ... },
  viewport: {
    viewports: { mobile, tablet, desktop },
    defaultViewport: "desktop"
  },
}
```

### Route Stories (`route-stories.hbs`)

**用途:** ページコンポーネント（API通信を含む）

**特徴:**
- レイアウト: `fullscreen`
- MSW（Mock Service Worker）統合
- Next.js App Router 設定
- ローディング、エラー、空状態のストーリー
- play関数によるインタラクティブテスト

**含まれるパラメータ:**
```typescript
{
  layout: "fullscreen",
  nextjs: { appDirectory: true },
  docs: { description: { component: "..." } },
  msw: { handlers: [...] },
  backgrounds: { ... },
}
```

**ストーリー例:**
- Default: 正常状態
- Loading: ローディング状態（delay使用）
- WithError: エラー状態（500エラー）
- EmptyState: 空状態

---

## カスタマイズ

### 新しいテンプレートを追加する

1. **テンプレートファイルを作成**
   ```bash
   touch plop-templates/component/stories-form.hbs
   ```

2. **Handlebars形式でテンプレートを記述**
   ```handlebars
   import type { Meta, StoryObj } from "@storybook/nextjs-vite";
   import { {{pascalCase componentName}} } from "./{{kebabCase componentName}}";

   const meta = {
     title: "components/{{componentType}}/{{pascalCase componentName}}",
     component: {{pascalCase componentName}},
     // ... その他の設定
   } satisfies Meta<typeof {{pascalCase componentName}}>;
   ```

3. **plopfile.jsを更新**
   ```javascript
   plop.setGenerator("component", {
     actions: (data) => {
       const storiesTemplate =
         data.componentType === "form"
           ? "plop-templates/component/stories-form.hbs"
           : "plop-templates/component/stories-ui.hbs";

       return [
         {
           type: "add",
           path: "src/components/{{componentType}}/{{kebabCase componentName}}/{{kebabCase componentName}}.stories.tsx",
           templateFile: storiesTemplate,
         },
       ];
     },
   });
   ```

### 使用可能なヘルパー関数

Handlebarsテンプレート内で使用できるヘルパー関数：

| ヘルパー | 説明 | 入力例 | 出力例 |
|---------|------|--------|--------|
| `pascalCase` | PascalCaseに変換 | `user-form` | `UserForm` |
| `camelCase` | camelCaseに変換 | `user-form` | `userForm` |
| `kebabCase` | kebab-caseに変換 | `UserForm` | `user-form` |

**使用例:**
```handlebars
{{pascalCase componentName}}  // UserForm
{{camelCase componentName}}   // userForm
{{kebabCase componentName}}   // user-form
```

### テンプレート変数

テンプレート内で使用できる変数：

#### Component Generator
- `componentType`: "ui" | "layout"
- `componentName`: コンポーネント名（入力値）

#### Feature Generator
- `featureName`: フィーチャー名（入力値）
- `routeName`: ルート名（入力値またはデフォルト）

#### Route Generator
- `featureName`: フィーチャー名（入力値）
- `routeName`: ルート名（入力値）

---

## ベストプラクティス

### 1. テンプレートにコメントを追加

生成されるコードにTODOコメントを含めて、開発者が次に何をすべきか明確にします。

```handlebars
/**
 * {{pascalCase componentName}}コンポーネント
 *
 * TODO: コンポーネントの説明を記述してください
 */
```

### 2. 条件分岐を活用

Handlebarsの条件分岐を使用して、柔軟なテンプレートを作成します。

```handlebars
{{#if (eq componentType "layout")}}
  layout: "fullscreen",
{{else}}
  layout: "centered",
{{/if}}
```

### 3. 一貫性を保つ

すべてのテンプレートで一貫したコーディングスタイルとパターンを維持します。

### 4. ドキュメントを更新

新しいテンプレートや変更を加えた際は、このREADMEも更新してください。

---

## トラブルシューティング

### Q: テンプレートが見つからないエラー

**A:** テンプレートファイルのパスが正しいか確認してください。plopfile.jsの`templateFile`パスは、プロジェクトルートからの相対パスです。

### Q: 変数が展開されない

**A:** Handlebarsの構文が正しいか確認してください。変数は `{{variableName}}` の形式で記述します。

### Q: 生成されたファイルが期待と異なる

**A:** テンプレートファイルを確認し、必要に応じて修正してください。変更後は再度ジェネレーターを実行してください。

---

## 追加リソース

- [Plop公式ドキュメント](https://plopjs.com/)
- [Handlebars公式ドキュメント](https://handlebarsjs.com/)
- [プロジェクト内のStorybookテンプレート](./.storybook/templates/)

---

**最終更新日:** 2025-10-13
