# アドオンの活用

Storybookアドオンを使用してコンポーネント開発を効率化する方法

## 📋 目次

- [Controls](#controls)
- [Actions](#actions)
- [Viewport](#viewport)
- [Backgrounds](#backgrounds)
- [Accessibility](#accessibility)

---

## Controls

Controlsアドオンは、Storybookのコントロールパネルでpropsを動的に変更できる機能です。

### 基本的な使い方

`argTypes`でコントロールの種類を指定します：

```typescript
const meta = {
  title: "components/ui/Button",
  component: Button,
  argTypes: {
    // テキスト入力
    children: {
      control: "text",
      description: "ボタンのテキスト",
    },
    // セレクトボックス
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description: "ボタンのバリアント",
    },
    // ラジオボタン
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "ボタンのサイズ",
    },
    // 真偽値
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
  },
} satisfies Meta<typeof Button>;
```

### コントロールの種類

| コントロール | 用途 | 例 |
|------------|------|-----|
| `text` | 文字列入力 | ボタンテキスト |
| `number` | 数値入力 | カウント、サイズ |
| `boolean` | チェックボックス | disabled, loading |
| `select` | ドロップダウン | バリアント、サイズ |
| `radio` | ラジオボタン | 少ない選択肢 |
| `color` | カラーピッカー | 背景色、文字色 |
| `date` | 日付選択 | 日付フィールド |
| `object` | JSONエディタ | 複雑なオブジェクト |
| `array` | 配列エディタ | リスト項目 |

### カテゴリ分類

`table.category`でコントロールをグループ化できます：

```typescript
argTypes: {
  // コンテンツカテゴリ
  children: {
    control: "text",
    table: {
      category: "コンテンツ",
    },
  },
  // スタイリングカテゴリ
  variant: {
    control: "select",
    options: ["primary", "secondary"],
    table: {
      category: "スタイリング",
    },
  },
  className: {
    control: "text",
    table: {
      category: "スタイリング",
    },
  },
  // イベントカテゴリ
  onClick: {
    action: "clicked",
    table: {
      category: "イベント",
    },
  },
}
```

### デフォルト値の設定

```typescript
const meta = {
  title: "components/ui/Button",
  component: Button,
  args: {
    // すべてのストーリーのデフォルト値
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

// 個別のストーリーで上書き
export const Small: Story = {
  args: {
    size: "sm", // デフォルトのmdを上書き
  },
};
```

---

## Actions

Actionsアドオンは、イベントハンドラーの呼び出しを記録・表示します。

### 基本的な使い方

```typescript
import { fn } from "@storybook/test";

const meta = {
  title: "components/ui/Button",
  component: Button,
  args: {
    // fn()で関数をモック
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof Button>;
```

### 自動Actionsの設定

正規表現で自動的にActionsを設定：

```typescript
const meta = {
  title: "components/ui/Button",
  component: Button,
  parameters: {
    actions: {
      // on から始まるpropsを自動的にActions化
      argTypesRegex: "^on[A-Z].*",
    },
  },
} satisfies Meta<typeof Button>;
```

### カスタムアクション名

```typescript
argTypes: {
  onClick: {
    action: "button clicked", // カスタム名
  },
  onSubmit: {
    action: "form submitted",
  },
}
```

### アクションデータの確認

Actionsタブで以下の情報を確認できます：

- 呼び出された関数名
- 呼び出し回数
- 引数の内容
- 呼び出しタイムスタンプ

---

## Viewport

Viewportアドオンは、異なる画面サイズでコンポーネントをテストできます。

### プリセットViewport

```typescript
export const Responsive: Story = {
  parameters: {
    viewport: {
      // プリセットのViewportを使用
      defaultViewport: "iphone12",
    },
  },
};
```

### 利用可能なプリセット

| プリセット | サイズ | 説明 |
|----------|--------|------|
| `iphone12` | 390×844 | iPhone 12/13/14 |
| `ipad` | 768×1024 | iPad |
| `ipadpro` | 1024×1366 | iPad Pro |
| `desktop` | 1440×900 | デスクトップ |

### カスタムViewport

```typescript
export const CustomSize: Story = {
  parameters: {
    viewport: {
      viewports: {
        custom: {
          name: "カスタムサイズ",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
      },
      defaultViewport: "custom",
    },
  },
};
```

### レイアウトコンポーネントでの使用

```typescript
const meta = {
  title: "components/layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen", // フルスクリーン表示
    viewport: {
      defaultViewport: "iphone12",
    },
  },
} satisfies Meta<typeof Header>;

export const Mobile: Story = {
  name: "モバイル表示",
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

export const Tablet: Story = {
  name: "タブレット表示",
  parameters: {
    viewport: {
      defaultViewport: "ipad",
    },
  },
};

export const Desktop: Story = {
  name: "デスクトップ表示",
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
```

---

## Accessibility

Accessibilityアドオン（A11y）は、アクセシビリティの問題を検出します。

### 基本的な使い方

デフォルトで有効化されています。A11yタブで自動チェック結果を確認できます。

```typescript
const meta = {
  title: "components/ui/Button",
  component: Button,
  parameters: {
    // A11yチェックは自動で実行される
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof Button>;
```

### チェック項目

A11yアドオンは以下をチェックします：

- **色のコントラスト**: テキストと背景の色コントラスト比
- **フォームラベル**: input要素に適切なlabelが付いているか
- **ボタンアクセシビリティ**: button要素に適切なテキストやaria-labelがあるか
- **画像の代替テキスト**: img要素にalt属性があるか
- **見出しの階層**: h1, h2, h3の順序が正しいか
- **ARIAラベル**: ARIA属性が正しく使用されているか

### 違反の例と修正

#### ❌ Bad: ラベルがない

```typescript
<input type="text" />
```

#### ✅ Good: ラベルがある

```typescript
<label htmlFor="name">名前</label>
<input id="name" type="text" />
```

#### ❌ Bad: コントラスト不足

```typescript
<button style={{ color: "#ccc", background: "#fff" }}>
  Button
</button>
```

#### ✅ Good: 十分なコントラスト

```typescript
<button style={{ color: "#000", background: "#fff" }}>
  Button
</button>
```

### A11yストーリーの例

```typescript
export const Accessible: Story = {
  name: "アクセシブル",
  args: {
    children: "送信",
    "aria-label": "フォームを送信",
  },
  parameters: {
    a11y: {
      element: "#root",
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
        ],
      },
    },
  },
};
```

---

## アドオンの組み合わせ

複数のアドオンを組み合わせて使用できます：

```typescript
export const Complete: Story = {
  name: "完全な例",
  args: {
    children: "Button",
    variant: "primary",
    onClick: fn(),
  },
  parameters: {
    // Viewport
    viewport: {
      defaultViewport: "iphone12",
    },
    // A11y
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  // インタラクションテスト
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

---

## ベストプラクティス

### 1. デフォルト値を設定

```typescript
// ✅ Good: metaレベルでデフォルト値
const meta = {
  args: {
    variant: "primary",
    size: "md",
  },
};
```

### 2. カテゴリで整理

```typescript
// ✅ Good: 関連するpropsをグループ化
argTypes: {
  variant: {
    table: { category: "スタイリング" },
  },
  onClick: {
    table: { category: "イベント" },
  },
}
```

### 3. アクセシビリティを常にチェック

```typescript
// ✅ Good: A11yアドオンを有効化
parameters: {
  a11y: {
    config: {
      rules: [
        { id: "color-contrast", enabled: true },
        { id: "button-name", enabled: true },
      ],
    },
  },
}
```

---

## 次のステップ

- **[Storybookテンプレート](./04-templates.md)** - アドオンが組み込まれたテンプレート
- **[Next.js特有の機能](./06-nextjs-features.md)** - Next.jsコンポーネントとの統合
- **[ベストプラクティス](./07-best-practices.md)** - アドオンを活用した効率的な開発

---

## 参考リンク

- [Storybook公式: Essential Addons](https://storybook.js.org/docs/essentials)
- [Storybook公式: Actions](https://storybook.js.org/docs/essentials/actions)
- [Storybook公式: Viewport](https://storybook.js.org/docs/essentials/viewport)
- [axe-core: Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
