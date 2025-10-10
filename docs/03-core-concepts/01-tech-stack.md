# 技術スタック

プロジェクトで使用している主要な技術とライブラリです。

## フレームワーク

### Next.js 15.5 + React 19

- **App Router**: ファイルベースのルーティング
- **Server Components**: サーバーサイドレンダリング
- **TypeScript 5.5+**: 型安全な開発

**公式**: [Next.js](https://nextjs.org/) | [React](https://react.dev/)

---

## UI・スタイリング

### Tailwind CSS v4

- **CSS-only設定**: JavaScriptの設定ファイル不要
- **@theme**: globals.cssでカスタムカラーを定義

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand-primary: hsl(220 91% 63%);
}
```

**公式**: [Tailwind CSS](https://tailwindcss.com/)

### shadcn/ui

- Radix UIベースのアクセシブルなコンポーネント
- コピー&ペーストで追加（npmパッケージではない）
- Tailwind CSSでスタイリング

**公式**: [shadcn/ui](https://ui.shadcn.com/)

### CVA (Class Variance Authority)

バリアント管理ライブラリ。shadcn/uiで使用。

```typescript
const buttonVariants = cva('rounded font-semibold', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
})
```

**公式**: [CVA](https://cva.style/)

---

## 状態管理

### TanStack Query

**サーバー状態**の管理（APIから取得するデータ）

- データフェッチング
- キャッシング
- バックグラウンド更新

**公式**: [TanStack Query](https://tanstack.com/query/latest)

### Zustand

**グローバル状態**の管理（クライアント側）

- 認証ユーザー情報
- テーマ設定
- サイドバーの開閉状態

**公式**: [Zustand](https://zustand-demo.pmnd.rs/)

### useState

**ローカル状態**の管理

- モーダルの開閉
- フォーム入力中の値
- タブの選択状態

---

## フォーム管理

### React Hook Form + Zod

- **React Hook Form**: パフォーマンスに優れたフォーム管理
- **Zod**: スキーマバリデーション

```typescript
const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('正しいメールアドレスを入力してください'),
})
```

**公式**: [React Hook Form](https://react-hook-form.com/) | [Zod](https://zod.dev/)

---

## データ取得

### Axios

HTTPクライアント

- リクエスト/レスポンスインターセプター
- 自動JSONデータ変換
- Cookie認証対応

**公式**: [Axios](https://axios-http.com/)

---

## 開発ツール

| ツール | 用途 |
|--------|------|
| **Vitest** | ユニットテスト |
| **Playwright** | E2Eテスト |
| **Storybook** | UIコンポーネント開発 |
| **ESLint** | コードの静的解析 |
| **Prettier** | コードフォーマット |
| **pnpm** | パッケージマネージャー |

---

## ライブラリ選定基準

1. **TypeScript対応** - 型安全性
2. **アクティブなメンテナンス** - 定期的な更新
3. **ドキュメントの充実** - 学習コストの低減
4. **コミュニティの規模** - 問題解決が容易
5. **bulletproof-react準拠** - アーキテクチャとの親和性

---

## 参考リンク

- [状態管理戦略](./02-state-management.md)
- [API統合](./08-api-integration.md)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
