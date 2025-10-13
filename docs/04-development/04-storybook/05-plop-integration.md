# Plop統合 - Storybookの自動生成

plopを使用してStorybookストーリーを自動生成する方法

## 📋 目次

- [概要](#概要)
- [セットアップ確認](#セットアップ確認)
- [基本的な使い方](#基本的な使い方)
- [コンポーネント生成](#コンポーネント生成)
- [Feature/Route生成](#featureroute生成)
- [生成されるファイル](#生成されるファイル)
- [カスタマイズ](#カスタマイズ)

---

## 概要

plopは、コード生成を自動化するツールです。本プロジェクトでは、コンポーネントやFeatureを生成する際に、Storybookストーリーも自動的に生成されます。

### メリット

- ✅ **時間の節約** - ストーリーファイルを手動で作成する必要がない
- ✅ **一貫性** - すべてのストーリーが同じ構造
- ✅ **ベストプラクティス** - テンプレートに組み込み済み
- ✅ **エラー削減** - タイポや構文エラーを防止
- ✅ **即座に使える** - 生成後すぐにStorybookで確認可能

---

## セットアップ確認

plopは既にプロジェクトにセットアップされています。

### インストール確認

```bash
# package.jsonでplopの確認
cat package.json | grep plop

# plopfile.jsの確認
ls plopfile.js

# テンプレートの確認
ls plop-templates/
```

### 利用可能なジェネレーター

```bash
# 対話型メニューを表示
pnpm generate

# 表示されるオプション:
# - feature: 新しいfeatureを作成
# - route: 既存feature内に新しいrouteを追加
# - component: 汎用UIコンポーネントを作成
```

---

## 基本的な使い方

### 対話型メニュー

```bash
pnpm generate
```

選択肢が表示されます：

```
? [PLOP] Please choose a generator.
❯ feature - 新しいfeatureを作成します
  route - 既存のfeature内に新しいrouteを追加します
  component - 汎用UIコンポーネントを作成します
```

### 直接実行

```bash
# コンポーネント生成
pnpm generate:component

# Feature生成
pnpm generate:feature

# Route生成
pnpm generate:route
```

---

## コンポーネント生成

### UIコンポーネントの生成

```bash
pnpm generate:component
```

**プロンプト:**

```
? コンポーネントのタイプを選択してください:
❯ ui
  layout

? コンポーネント名を入力してください (例: modal, dropdown):
> modal
```

**生成されるファイル:**

```
src/components/ui/modal/
├── modal.tsx                    # コンポーネント本体
├── modal.stories.tsx            # ストーリーファイル（自動生成！）
└── index.ts                     # エクスポートファイル
```

**modal.stories.tsx の内容:**

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { Modal } from "./modal";

/**
 * Modalのストーリー
 *
 * TODO: コンポーネントの説明を記載してください
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/ui/Modal",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Modal,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // ================================================================================
    layout: "centered",

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          "TODO: コンポーネントの詳細な説明をここに記載\n\n" +
          "**主な機能:**\n" +
          "- 機能1の説明\n" +
          "- 機能2の説明\n\n" +
          "**使用例:**\n" +
          "```tsx\n" +
          "<Modal>\n" +
          "  コンテンツ\n" +
          "</Modal>\n" +
          "```",
      },
    },

    // ================================================================================
    // 背景色のテストオプション
    // ================================================================================
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
        { name: "gray", value: "#f3f4f6" },
      ],
    },

    // ================================================================================
    // アクション設定
    // ================================================================================
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],

  // ================================================================================
  // コントロールパネルの設定
  // ================================================================================
  argTypes: {
    children: {
      control: "text",
      description: "コンポーネントの子要素（テキストまたはReactNode）",
      table: {
        type: { summary: "ReactNode" },
        category: "コンテンツ",
      },
    },
    className: {
      control: "text",
      description: "追加のCSSクラス名",
      table: {
        type: { summary: "string" },
        category: "スタイリング",
      },
    },
  },

  // ================================================================================
  // デフォルトの args 値
  // ================================================================================
  args: {
    children: "Modalのサンプルコンテンツ",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ================================================================================
// ストーリー定義
// ================================================================================

/**
 * デフォルト状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    children: "Modal",
  },
  parameters: {
    docs: {
      description: {
        story: "デフォルト状態のModalコンポーネント",
      },
    },
  },
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
  name: "カスタムスタイル",
  args: {
    children: "カスタムスタイル",
    className: "bg-blue-100 p-4 rounded-md",
  },
  parameters: {
    docs: {
      description: {
        story: "classNameプロパティでカスタムスタイルを適用できます",
      },
    },
  },
};

/**
 * ダークモード表示
 */
export const DarkMode: Story = {
  name: "ダークモード",
  args: {
    children: "ダークモード",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
    docs: {
      description: {
        story: "ダークモードでの表示例",
      },
    },
  },
};
```

### レイアウトコンポーネントの生成

```bash
pnpm generate:component
```

**プロンプト:**

```
? コンポーネントのタイプを選択してください:
  ui
❯ layout

? コンポーネント名を入力してください:
> sidebar
```

**生成されるファイル:**

```
src/components/layout/sidebar/
├── sidebar.tsx
├── sidebar.stories.tsx          # レイアウト用テンプレート
└── index.ts
```

**sidebar.stories.tsx の特徴:**

- `layout: "fullscreen"` が設定済み
- viewport設定（mobile/tablet/desktop）が含まれる
- レスポンシブ対応のストーリー例が含まれる

---

## Feature/Route生成

### 新しいFeatureの生成

```bash
pnpm generate:feature
```

**プロンプト:**

```
? Feature名を入力してください (例: blog, product):
> product

? Route名を入力してください (例: list, detail) [デフォルト: featureName]:
> [Enter] # デフォルトで "product"
```

**生成されるファイル:**

```
src/features/product/
├── schemas/
│   └── product.schema.ts
├── routes/
│   └── product/
│       ├── product.tsx
│       ├── product.hook.ts
│       ├── product.stories.tsx       # 自動生成！
│       ├── components/
│       │   └── product-form.tsx
│       └── index.ts
└── index.ts
```

**product.stories.tsx の内容:**

MSW統合、ローディング、エラー、空状態のストーリーが含まれます。

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import ProductPage from "./product";

const meta = {
  title: "features/product/routes/product/Product",
  component: ProductPage,

  parameters: {
    layout: "fullscreen",

    nextjs: {
      appDirectory: true,
    },

    msw: {
      handlers: [
        http.get("/api/v1/product", () => {
          return HttpResponse.json({
            data: [
              { id: "1", name: "サンプル1" },
              { id: "2", name: "サンプル2" },
            ],
          });
        }),
      ],
    },
  },

  tags: ["autodocs"],
} satisfies Meta<typeof ProductPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト状態
export const Default: Story = {
  name: "デフォルト",
  play: async ({ canvasElement }) => {
    // TODO: テストを実装
  },
};

// ローディング状態
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/product", async () => {
          await delay(5000);
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};

// エラー状態
export const WithError: Story = {
  name: "エラー",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/product", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

// 空の状態
export const EmptyState: Story = {
  name: "空の状態",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/product", () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};
```

### 既存Feature内に新しいRouteを追加

```bash
pnpm generate:route
```

**プロンプト:**

```
? 既存のFeature名を入力してください:
> product

? 新しいRoute名を入力してください (例: list, detail):
> detail
```

**生成されるファイル:**

```
src/features/product/routes/detail/
├── detail.tsx
├── detail.hook.ts
├── detail.stories.tsx           # 自動生成！
├── components/
│   └── detail-form.tsx
└── index.ts
```

---

## 生成されるファイル

### 自動生成されるストーリーの特徴

#### 1. コンポーネント名が自動設定

```typescript
// modal を生成した場合
title: "components/ui/Modal",
component: Modal,

// product feature を生成した場合
title: "features/product/routes/product/Product",
component: ProductPage,
```

#### 2. 詳細なコメント

```typescript
// ================================================================================
// Storybookのナビゲーション階層
// ================================================================================
title: "components/ui/Modal",
```

すべてのパラメータに説明コメントが付いています。

#### 3. TODOマーカー

```typescript
// TODO: コンポーネントの説明を記述してください
// TODO: 実際のAPIエンドポイントに合わせて修正してください
// TODO: モックデータを定義してください
```

開発者が次に何をすべきか明確になっています。

#### 4. 複数のストーリー例

- デフォルト状態
- カスタムスタイル（UIコンポーネント）
- ダークモード（UIコンポーネント）
- レスポンシブ表示（レイアウトコンポーネント）
- ローディング/エラー/空状態（ページコンポーネント）

#### 5. ベストプラクティス

- `parameters.docs.description.component`
- `parameters.backgrounds`
- `parameters.actions`
- `argTypes` のカテゴリ分類
- `tags: ["autodocs"]`

---

## カスタマイズ

### plopテンプレートのカスタマイズ

プロジェクト固有のニーズに合わせて、plopテンプレートをカスタマイズできます。

#### 1. テンプレートファイルの場所

```
plop-templates/
├── component/
│   ├── component.hbs            # コンポーネント本体
│   ├── stories-ui.hbs          # UIコンポーネント用ストーリー
│   ├── stories-layout.hbs      # レイアウト用ストーリー
│   └── index.hbs               # エクスポートファイル
├── feature/
│   └── route-stories.hbs       # Feature用ストーリー
└── route/
    └── route-stories.hbs       # Route用ストーリー
```

#### 2. テンプレートの編集

```bash
# UIコンポーネント用ストーリーテンプレートを編集
code plop-templates/component/stories-ui.hbs
```

**例: デフォルトのストーリーを追加**

```handlebars
// ================================================================================
// ストーリー定義
// ================================================================================

/**
 * デフォルト状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    children: "{{pascalCase componentName}}",
  },
};

// ⬇️ 新しいストーリーを追加
/**
 * ホバー状態
 */
export const Hover: Story = {
  name: "ホバー",
  args: {
    children: "ホバーしてください",
  },
  parameters: {
    pseudo: { hover: true },
  },
};
```

#### 3. plopfile.js の編集

```bash
code plopfile.js
```

**例: 新しいテンプレートタイプを追加**

```javascript
plop.setGenerator("component", {
  actions: (data) => {
    // 条件分岐を追加
    const storiesTemplate =
      data.componentType === "layout"
        ? "plop-templates/component/stories-layout.hbs"
        : data.componentType === "form"
        ? "plop-templates/component/stories-form.hbs"  // 新規追加
        : "plop-templates/component/stories-ui.hbs";

    return [
      // ... 生成アクション
    ];
  },
});
```

### Handlebars変数

テンプレート内で使用できる変数：

| 変数 | 説明 | 例 |
|------|------|-----|
| `{{componentName}}` | 入力されたコンポーネント名 | `modal` |
| `{{pascalCase componentName}}` | PascalCase形式 | `Modal` |
| `{{camelCase componentName}}` | camelCase形式 | `modal` |
| `{{kebabCase componentName}}` | kebab-case形式 | `modal` |
| `{{componentType}}` | コンポーネントタイプ | `ui` または `layout` |
| `{{featureName}}` | フィーチャー名 | `product` |
| `{{routeName}}` | ルート名 | `detail` |

**使用例:**

```handlebars
import { {{pascalCase componentName}} } from "./{{kebabCase componentName}}";

const meta = {
  title: "components/{{componentType}}/{{pascalCase componentName}}",
  component: {{pascalCase componentName}},
} satisfies Meta<typeof {{pascalCase componentName}}>;
```

---

## 実践例

### 実際の開発フロー

#### 1. モーダルコンポーネントを作成

```bash
pnpm generate:component
# componentType: ui
# componentName: modal
```

#### 2. 生成されたファイルを確認

```bash
ls src/components/ui/modal/
# modal.tsx
# modal.stories.tsx  ← 自動生成された！
# index.ts
```

#### 3. Storybookで確認

```bash
pnpm storybook
```

ブラウザで http://localhost:6006 を開く

`components/ui/Modal` が表示される

#### 4. コンポーネントを実装

```typescript
// modal.tsx
export const Modal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white p-4 rounded">
        {children}
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};
```

#### 5. ストーリーを更新

```typescript
// modal.stories.tsx

// TODO コメントを実装に置き換え
argTypes: {
  isOpen: {
    control: "boolean",
    description: "モーダルの表示状態",
    table: {
      type: { summary: "boolean" },
      defaultValue: { summary: "false" },
      category: "状態",
    },
  },
  onClose: {
    action: "closed",
    description: "モーダルを閉じる関数",
    table: {
      category: "イベント",
    },
  },
},

// 新しいストーリーを追加
export const Open: Story = {
  name: "開いた状態",
  args: {
    isOpen: true,
    children: "モーダルのコンテンツ",
  },
};

export const Closed: Story = {
  name: "閉じた状態",
  args: {
    isOpen: false,
    children: "表示されない",
  },
};
```

#### 6. Storybookで動作確認

リロードすると、新しいストーリーが表示される

---

## トラブルシューティング

### Q: 生成されたストーリーでエラーが出る

**A:** 以下を確認してください：

```bash
# 1. Storybookが最新か確認
pnpm storybook --version

# 2. 型エラーを確認
npx tsc --noEmit

# 3. Storybookを再起動
pnpm storybook
```

### Q: テンプレートが古い

**A:** テンプレートを最新版に更新：

```bash
# 最新のテンプレートを確認
ls -la .storybook/templates/

# plop-templatesを確認
ls -la plop-templates/

# 必要に応じて再生成
pnpm generate:component
```

### Q: カスタムテンプレートが反映されない

**A:** plopfile.jsの設定を確認：

```javascript
// plopfile.js
const storiesTemplate =
  data.componentType === "layout"
    ? "plop-templates/component/stories-layout.hbs"  // パスが正しいか確認
    : "plop-templates/component/stories-ui.hbs";
```

---

## 次のステップ

- **[Storybookテンプレート](./04-templates.md)** - テンプレートの詳細
- **[ベストプラクティス](./07-best-practices.md)** - Storybookの効果的な使い方
- **[コード生成ガイド](../05-code-generation.md)** - plopの全体像

---

## 参考リンク

- [plopfile.js](../../../plopfile.js)
- [plop-templates/](../../../plop-templates/)
- [.storybook/templates/](../../../.storybook/templates/)
- [Plop公式ドキュメント](https://plopjs.com/)
