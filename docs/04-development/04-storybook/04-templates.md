# Storybookテンプレート

充実したStorybookストーリーを簡単に作成するためのテンプレートシステム

## 📋 目次

- [概要](#概要)
- [テンプレートの種類](#テンプレートの種類)
- [マニュアルコピー用テンプレート](#マニュアルコピー用テンプレート)
- [meta属性の詳細解説](#meta属性の詳細解説)
- [テンプレートの使い方](#テンプレートの使い方)
- [カスタマイズ](#カスタマイズ)

---

## 概要

本プロジェクトでは、Storybookのベストプラクティスを組み込んだテンプレートシステムを提供しています。テンプレートを使用することで、以下のメリットがあります：

### メリット

- ✅ **一貫性の保証** - すべてのストーリーで統一された構造
- ✅ **時間の節約** - ゼロから書く必要がない
- ✅ **ベストプラクティス** - meta属性の推奨設定が組み込み済み
- ✅ **学習リソース** - 詳細なコメントで学習できる
- ✅ **メンテナンス性** - テンプレート更新で一括改善

### 2つのアプローチ

| アプローチ | 用途 | 場所 |
|----------|------|------|
| **自動生成** | plopで自動生成 | `plop-templates/` |
| **マニュアルコピー** | 手動でコピー＆編集 | `.storybook/templates/` |

---

## テンプレートの種類

### 1. 基本的なUIコンポーネント用

**用途:** ボタン、入力、カード、バッジなど

**特徴:**

- レイアウト: `centered`
- 背景色テストオプション
- アクション設定
- デフォルト、カスタムスタイル、ダークモードのストーリー

**ファイル:**

- `.storybook/templates/basic-ui-component.stories.template.tsx` (マニュアル用)
- `plop-templates/component/stories-ui.hbs` (plop用)

### 2. レイアウトコンポーネント用

**用途:** ヘッダー、サイドバー、ページレイアウトなど

**特徴:**

- レイアウト: `fullscreen`
- レスポンシブテスト設定（mobile/tablet/desktop）
- 複数のレイアウトパターン例
- ビューポート切り替えストーリー

**ファイル:**

- `.storybook/templates/layout-component.stories.template.tsx` (マニュアル用)
- `plop-templates/component/stories-layout.hbs` (plop用)

### 3. フォームコンポーネント用

**用途:** React Hook Form + Zod を使用したフォーム

**特徴:**

- レイアウト: `padded`
- バリデーション例
- エラー状態、送信中状態のストーリー
- 編集モード・新規作成モードの切り替え

**ファイル:**

- `.storybook/templates/form-component.stories.template.tsx` (マニュアル用)

### 4. ページコンポーネント用（MSW付き）

**用途:** API通信を含むページコンポーネント

**特徴:**

- レイアウト: `fullscreen`
- MSW統合（API通信モック）
- ローディング、エラー、空状態のストーリー
- play関数によるテスト例

**ファイル:**

- `.storybook/templates/page-component-with-msw.stories.template.tsx` (マニュアル用)
- `plop-templates/feature/route-stories.hbs` (plop用)
- `plop-templates/route/route-stories.hbs` (plop用)

---

## マニュアルコピー用テンプレート

`.storybook/templates/` には、完全な実装例とコメントを含むテンプレートがあります。

### ディレクトリ構造

```text
.storybook/templates/
├── basic-ui-component.stories.template.tsx
├── form-component.stories.template.tsx
├── page-component-with-msw.stories.template.tsx
├── layout-component.stories.template.tsx
└── README.md
```

### 使い方

#### 1. テンプレートをコピー

```bash
# UIコンポーネントの場合
cp .storybook/templates/basic-ui-component.stories.template.tsx \
   src/components/sample-ui/modal/modal.stories.tsx

# レイアウトコンポーネントの場合
cp .storybook/templates/layout-component.stories.template.tsx \
   src/components/layout/sidebar/sidebar.stories.tsx
```

#### 2. コンポーネントをインポート

```typescript
// 修正前（テンプレート）
// import { YourComponent } from "./your-component";

// 修正後
import { Modal } from "./modal";
```

#### 3. meta オブジェクトを編集

```typescript
const meta = {
  // タイトルを変更
  title: "components/sample-ui/Modal",

  // コンポーネントを指定
  component: Modal,

  // 説明を記載
  parameters: {
    docs: {
      description: {
        component: "モーダルダイアログコンポーネント...",
      },
    },
  },

  // argTypes を編集
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "モーダルの表示状態",
    },
    // ...
  },
} satisfies Meta<typeof Modal>;
```

### テンプレートの特徴

#### 詳細なコメント

すべてのパラメータにコメントが付いています：

```typescript
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // 形式: "category/subcategory/ComponentName"
  // 例: "components/sample-ui/Button", "features/auth/LoginForm"
  // ================================================================================
  title: "components/sample-ui/ComponentName",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: undefined, // YourComponent,

  // ...
};
```

#### 実装例

複数のストーリー例が含まれています：

```typescript
// デフォルト状態
export const Default: Story = { ... }

// バリエーション例
export const VariantExample: Story = { ... }

// 無効化状態
export const Disabled: Story = { ... }

// カスタムレンダリング例
export const CustomRender: Story = { ... }

// インタラクティブテスト例
export const WithInteraction: Story = { ... }

// ダークモード表示
export const DarkMode: Story = { ... }
```

---

## meta属性の詳細解説

### 必須パラメータ

#### title

Storybookのナビゲーション階層を定義します。

```typescript
title: "components/sample-ui/Button"
// カテゴリ: components
// サブカテゴリ: ui
// コンポーネント名: Button
```

**命名規則:**

- `components/ui/[ComponentName]` - 基本的なUIコンポーネント
- `components/layout/[ComponentName]` - レイアウトコンポーネント
- `features/[feature-name]/components/[ComponentName]` - フィーチャー固有のコンポーネント
- `features/[feature-name]/routes/[route-name]/[PageName]` - ページコンポーネント

#### component

表示するコンポーネントを指定します。

```typescript
component: Button
```

### 推奨パラメータ

#### parameters.layout

コンポーネントのレイアウト方法を指定します。

```typescript
parameters: {
  layout: "centered" | "padded" | "fullscreen"
}
```

- **centered**: 小さなコンポーネント（ボタン、入力など）
- **padded**: 中サイズのコンポーネント（フォーム、カードなど）
- **fullscreen**: ページ全体、レイアウトコンポーネント

#### parameters.docs.description.component

コンポーネントの詳細説明を記載します。Markdown形式で記述可能です。

```typescript
parameters: {
  docs: {
    description: {
      component:
        "ボタンコンポーネントの詳細説明\n\n" +
        "**主な機能:**\n" +
        "- 機能1\n" +
        "- 機能2\n\n" +
        "**使用例:**\n" +
        "```tsx\n" +
        "<Button variant=\"primary\">クリック</Button>\n" +
        "```"
    }
  }
}
```

#### tags

ドキュメント自動生成を有効化します。

```typescript
tags: ["autodocs"]
```

#### argTypes

コントロールパネルの設定を定義します。

```typescript
argTypes: {
  variant: {
    // コントロールタイプ
    control: "select",
    // 選択肢
    options: ["default", "primary", "secondary"],
    // 説明文
    description: "ボタンのバリエーション",
    // テーブル情報
    table: {
      type: { summary: "string" },
      defaultValue: { summary: "default" },
      category: "外観", // カテゴリでグループ化
    },
  },
}
```

**コントロールタイプ一覧:**

- `select` - セレクトボックス
- `radio` - ラジオボタン
- `inline-radio` - インラインラジオボタン
- `check` - チェックボックス
- `inline-check` - インラインチェックボックス
- `text` - テキスト入力
- `number` - 数値入力
- `boolean` - トグルスイッチ
- `range` - スライダー
- `color` - カラーピッカー
- `date` - 日付ピッカー
- `object` - オブジェクト入力
- `array` - 配列入力

#### args

デフォルトの args 値を設定します。

```typescript
args: {
  variant: "default",
  size: "md",
  disabled: false,
}
```

### オプションパラメータ

#### parameters.actions

イベントハンドラを自動的にアクションパネルに表示します。

```typescript
parameters: {
  actions: {
    argTypesRegex: "^on[A-Z].*",
  }
}
```

#### parameters.viewport

レスポンシブテスト用のビューポート設定です。

```typescript
parameters: {
  viewport: {
    viewports: {
      mobile: {
        name: "Mobile",
        styles: { width: "375px", height: "667px" },
      },
      tablet: {
        name: "Tablet",
        styles: { width: "768px", height: "1024px" },
      },
    },
    defaultViewport: "desktop",
  }
}
```

#### parameters.msw

MSW（Mock Service Worker）のハンドラを設定します。

```typescript
parameters: {
  msw: {
    handlers: [
      http.get("/api/v1/users", () => {
        return HttpResponse.json({ data: mockUsers });
      }),
    ],
  }
}
```

#### parameters.chromatic

Chromaticのビジュアルリグレッションテスト設定です。

```typescript
parameters: {
  chromatic: {
    disableSnapshot: false,
    delay: 300,
  }
}
```

---

## テンプレートの使い方

### テンプレート選択フローチャート

```text
コンポーネントの種類は？
├─ API通信を含むページ
│  └─ → page-component-with-msw.stories.template.tsx
│
├─ フォーム（React Hook Form使用）
│  └─ → form-component.stories.template.tsx
│
├─ レイアウト構造を定義
│  └─ → layout-component.stories.template.tsx
│
└─ 基本的なUIコンポーネント
   └─ → basic-ui-component.stories.template.tsx
```

### 判断基準

| テンプレート | 使用条件 |
|------------|----------|
| **基本的なUIコンポーネント** | 小さくて再利用可能、API通信なし |
| **フォームコンポーネント** | React Hook Form + Zod を使用 |
| **ページコンポーネント（MSW付き）** | API通信あり、データフェッチング |
| **レイアウトコンポーネント** | ページ構造、レスポンシブ対応が重要 |

### 実践例

#### UIコンポーネントの場合

```bash
# 1. テンプレートをコピー
cp .storybook/templates/basic-ui-component.stories.template.tsx \
   src/components/sample-ui/badge/badge.stories.tsx

# 2. エディタで開いて編集
code src/components/sample-ui/badge/badge.stories.tsx

# 3. 主な修正ポイント:
# - import文を修正
# - title を "components/sample-ui/Badge" に変更
# - component を Badge に変更
# - argTypes を Badge の props に合わせる
# - 不要なストーリーを削除
```

#### ページコンポーネントの場合

```bash
# 1. テンプレートをコピー
cp .storybook/templates/page-component-with-msw.stories.template.tsx \
   src/features/products/routes/products/products.stories.tsx

# 2. エディタで開いて編集
code src/features/products/routes/products/products.stories.tsx

# 3. 主な修正ポイント:
# - import文を修正
# - title を "features/products/routes/products/Products" に変更
# - MSWハンドラのエンドポイントを実際のAPIに合わせる
# - モックデータを実際のデータ構造に合わせる
# - play関数のテストを実装
```

---

## カスタマイズ

### プロジェクト固有のテンプレートを作成

既存のテンプレートをベースに、プロジェクト固有のテンプレートを作成できます。

#### 1. 新しいテンプレートファイルを作成

```bash
cp .storybook/templates/basic-ui-component.stories.template.tsx \
   .storybook/templates/chart-component.stories.template.tsx
```

#### 2. テンプレートをカスタマイズ

```typescript
// .storybook/templates/chart-component.stories.template.tsx

// プロジェクト固有のimportを追加
import { ResponsiveContainer, LineChart } from "recharts";

const meta = {
  title: "components/charts/[ChartName]",
  component: undefined,

  parameters: {
    layout: "padded", // チャートに適したレイアウト

    // チャート固有のドキュメント
    docs: {
      description: {
        component:
          "データ可視化用のチャートコンポーネント\n\n" +
          "**サポートするチャートタイプ:**\n" +
          "- ラインチャート\n" +
          "- バーチャート\n" +
          "- エリアチャート\n\n" +
          "**データフォーマット:**\n" +
          "```typescript\n" +
          "{ x: number; y: number }[]\n" +
          "```",
      },
    },
  },

  // チャート固有のargTypes
  argTypes: {
    data: {
      control: "object",
      description: "チャートデータ",
    },
    width: {
      control: "number",
      description: "チャートの幅",
    },
    height: {
      control: "number",
      description: "チャートの高さ",
    },
  },
};
```

#### 3. READMEを更新

```markdown
## カスタムテンプレート

### Chart Component Template

**用途:** データ可視化用のチャートコンポーネント

**ファイル:** `.storybook/templates/chart-component.stories.template.tsx`

**使用例:**
\`\`\`bash
cp .storybook/templates/chart-component.stories.template.tsx \\
   src/components/charts/line-chart/line-chart.stories.tsx
\`\`\`
```

### テンプレートのベストプラクティス

#### 1. コメントを充実させる

```typescript
// ✅ Good: 明確なコメント
// ================================================================================
// Storybookのナビゲーション階層
// 形式: "category/subcategory/ComponentName"
// ================================================================================
title: "components/sample-ui/ComponentName",

// ❌ Bad: コメントなし
title: "components/sample-ui/ComponentName",
```

#### 2. TODO コメントを活用

```typescript
// TODO: コンポーネントの説明を記述してください
// TODO: 実際のAPIエンドポイントに合わせて修正してください
// TODO: モックデータを定義してください
```

#### 3. 実装例を含める

```typescript
// 例:
// variant: {
//   control: "select",
//   options: ["default", "primary", "secondary"],
//   description: "コンポーネントのバリエーション",
//   table: {
//     type: { summary: "string" },
//     defaultValue: { summary: "default" },
//     category: "外観",
//   },
// },
```

---

## よくある質問

### Q1: テンプレートを修正してもいいですか？

A: はい、プロジェクトのニーズに応じて自由に修正してください。ただし、修正した場合は、このドキュメントとテンプレートのREADMEも更新することをお勧めします。

### Q2: すべてのストーリーを作成する必要がありますか？

A: いいえ、コンポーネントに関連するストーリーのみを作成してください。テンプレートは網羅的な例を提供していますが、必要なものだけを使用してください。

### Q3: plop自動生成と手動コピーのどちらを使うべきですか？

A: **推奨: plop自動生成**

自動生成のほうが効率的で、一貫性も保たれます。手動コピーは以下の場合に使用してください：

- plopに対応していない特殊なケース
- 学習目的でテンプレートを詳しく確認したい場合
- カスタムテンプレートを作成する際の参考にしたい場合

詳細は [Plop統合](./05-plop-integration.md) を参照してください。

### Q4: 既存のストーリーをテンプレート化するには？

A: 既存のストーリーファイルから、再利用可能な部分を抽出して新しいテンプレートを作成してください。その際、コメントを充実させることが重要です。

```bash
# 既存のストーリーをテンプレートとして保存
cp src/components/sample-ui/badge/badge.stories.tsx \
   .storybook/templates/badge-like-component.stories.template.tsx

# TODO コメントを追加
# コンポーネント名を変数化
# 不要な部分を削除
```

---

## 次のステップ

- **[Plop統合](./05-plop-integration.md)** - 自動コード生成の詳細
- **[ベストプラクティス](./07-best-practices.md)** - Storybookの効果的な使い方
- **[概要とセットアップ](./01-overview.md)** - Storybookの基礎に戻る

---

## 参考リンク

- [テンプレートREADME](../../../.storybook/templates/README.md)
- [PlopテンプレートREADME](../../../plop-templates/README.md)
- [Storybook公式ドキュメント](https://storybook.js.org/docs)
