# Storybook

UIコンポーネントの開発・ドキュメント化・デバッグのためのStorybookガイド

## 📚 目次

### 基礎知識

1. **[概要とセットアップ](./01-overview.md)**
   - Storybookとは
   - セットアップ方法
   - Next.js統合
   - 開発サーバー起動

2. **[ストーリーの作成](./02-creating-stories.md)**
   - 基本的なStoryの書き方
   - コンポーネント階層
   - 複数バリアントの表示
   - フォームコンポーネント
   - インタラクションテスト

3. **[アドオンの活用](./03-addons.md)**
   - Controls
   - Actions
   - Viewport
   - Backgrounds
   - Accessibility

### テンプレートとツール

1. **[Storybookテンプレート](./04-templates.md)** ⭐ NEW
   - テンプレート一覧
   - 基本的なUIコンポーネント用
   - レイアウトコンポーネント用
   - フォームコンポーネント用
   - ページコンポーネント用（MSW付き）
   - meta属性の詳細解説
   - 使い方とカスタマイズ

2. **[Plop統合](./05-plop-integration.md)** ⭐ NEW
   - 自動コード生成
   - コンポーネント生成
   - ストーリーの自動生成
   - カスタムテンプレート
   - 実践例

### 実践・応用

1. **[Next.js特有の機能](./06-nextjs-features.md)**
   - Image コンポーネント
   - Link コンポーネント
   - Router のモック
   - Server Components の扱い
   - フォント設定
   - AppProvider設定
   - MSW統合

2. **[ベストプラクティス](./07-best-practices.md)**
   - ファイル配置
   - 様々な状態のカバー
   - モックデータの作成
   - アクセシビリティ
   - ドキュメント生成
   - デコレーター活用

---

## 🚀 クイックスタート

### Storybookを起動

```bash
pnpm storybook
```

ブラウザで <http://localhost:6006> を開く

### 新しいコンポーネントとストーリーを生成

```bash
# UIコンポーネント（ボタン、入力など）
pnpm generate:component
# → componentType: ui
# → componentName: modal

# レイアウトコンポーネント（ヘッダー、サイドバーなど）
pnpm generate:component
# → componentType: layout
# → componentName: sidebar

# 生成されるファイル:
# ✓ src/components/ui/modal/modal.tsx
# ✓ src/components/ui/modal/modal.stories.tsx (自動生成！)
# ✓ src/components/ui/modal/index.ts
```

詳細は [Plop統合](./05-plop-integration.md) を参照

---

## 📖 主要機能

### 1. コンポーネントカタログ

すべてのUIコンポーネントを一箇所で確認できます。

- ✅ コンポーネントを隔離して開発
- ✅ 様々なPropsパターンを簡単に確認
- ✅ レスポンシブデザインの検証
- ✅ 自動ドキュメント生成

### 2. インタラクションテスト

play関数でユーザーインタラクションを自動テストできます。

```typescript
export const ClickTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await expect(button).toBeInTheDocument();
  },
};
```

### 3. MSW統合

APIモックを使用してリアルな環境を再現できます。

```typescript
parameters: {
  msw: {
    handlers: [
      http.get("/api/users", () => {
        return HttpResponse.json({ data: mockUsers });
      }),
    ],
  },
}
```

### 4. テンプレートシステム

plopで自動生成されるストーリーには、ベストプラクティスが組み込まれています。

- 詳細なコメント付きmeta属性
- parameters.docs.description
- parameters.backgrounds
- argTypes（カテゴリ分類）
- 複数のストーリー例

詳細は [Storybookテンプレート](./04-templates.md) を参照

---

## 🎯 よく使うコマンド

```bash
# 開発
pnpm storybook                    # Storybook起動
pnpm storybook -p 6007            # 特定のポートで起動

# ビルド
pnpm build-storybook              # 本番ビルド
pnpm build-storybook -o dist      # 出力ディレクトリ指定

# コード生成
pnpm generate:component           # UIコンポーネント生成
pnpm generate:feature             # Feature生成（ストーリー付き）
pnpm generate:route               # Route生成（ストーリー付き）
```

---

## 📂 ディレクトリ構造

```text
.storybook/
├── main.ts                       # Storybook設定
├── preview.tsx                   # グローバル設定
└── templates/                    # マニュアルコピー用テンプレート
    ├── basic-ui-component.stories.template.tsx
    ├── form-component.stories.template.tsx
    ├── page-component-with-msw.stories.template.tsx
    ├── layout-component.stories.template.tsx
    └── README.md

plop-templates/
├── component/
│   ├── stories-ui.hbs           # plop用UIコンポーネントテンプレート
│   └── stories-layout.hbs       # plop用レイアウトテンプレート
├── feature/
│   └── route-stories.hbs        # plop用ページテンプレート
└── route/
    └── route-stories.hbs        # plop用ページテンプレート

src/
└── components/
    └── ui/
        └── button/
            ├── button.tsx
            └── button.stories.tsx   # ストーリーファイル
```

---

## 🔗 関連リンク

### 内部ドキュメント

- [コンポーネント設計](../03-component-design/index.md)
- [コーディング規約](../01-coding-standards/index.md)
- [テスト戦略](../../05-testing/01-testing-strategy.md)
- [コード生成ガイド](../../06-guides/01-code-generator.md)

### 外部リソース

- [Storybook公式ドキュメント](https://storybook.js.org/docs)
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/nextjs)
- [Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Visual Testing](https://storybook.js.org/docs/writing-tests/visual-testing)

---

## 💡 ヒント

### テンプレートから始める

新しいコンポーネントを作成する際は、plopを使用して自動生成することをお勧めします。テンプレートにはベストプラクティスが組み込まれており、一貫性のあるストーリーを簡単に作成できます。

```bash
pnpm generate:component
```

### 手動でストーリーを作成する場合

`.storybook/templates/` にある完全なテンプレートを参考にしてください。詳細なコメントと実装例が含まれています。

```bash
cp .storybook/templates/basic-ui-component.stories.template.tsx \
   src/components/ui/your-component/your-component.stories.tsx
```

### カスタマイズ

プロジェクト固有のニーズに合わせて、テンプレートをカスタマイズできます。詳細は [Storybookテンプレート](./04-templates.md) と [Plop統合](./05-plop-integration.md) を参照してください。

---

**次のステップ:** [概要とセットアップ](./01-overview.md) から始めましょう
