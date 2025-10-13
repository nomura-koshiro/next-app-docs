# インストール

MSWのインストールとセットアップ手順を説明します。

---

## 1. 依存関係の追加

```bash
# MSW本体をインストール
pnpm add -D msw@latest
```

---

## 2. Service Workerファイル生成

MSWはService Workerを使用してリクエストをインターセプトします。以下のコマンドでService Workerファイルを生成します。

```bash
# publicディレクトリにService Worker生成
npx msw init public/ --save
```

**生成されるファイル:**

```text
CAMP_front/
└── public/
    └── mockServiceWorker.js  # ← MSWのService Worker
```

**注意:**
- `mockServiceWorker.js`は自動生成されるファイルです
- MSWのバージョンアップ時に再生成が必要な場合があります
- 本番環境では使用されません

---

## 3. .gitignoreに追加

`mockServiceWorker.js`は自動生成されるため、Gitで管理する必要はありません。

```bash
# .gitignoreに追加
echo "public/mockServiceWorker.js" >> .gitignore
```

または、`.gitignore`を直接編集：

```gitignore
# MSW
public/mockServiceWorker.js
```

---

## 4. 環境変数の設定

MSWを有効にするための環境変数を設定します。

### .env.local

```bash
# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

### env.tsでの検証

```typescript
// src/config/env.ts
import { z } from 'zod'

const EnvSchema = z.object({
  ENABLE_API_MOCKING: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
  // その他の環境変数...
})

export const env = EnvSchema.parse({
  ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
  // その他の環境変数...
})
```

---

## 5. MSWの有効/無効切り替え

環境変数を変更してMSWの有効/無効を切り替えられます。

```bash
# MSWを有効化
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# MSWを無効化（実際のAPIを呼ぶ）
NEXT_PUBLIC_ENABLE_API_MOCKING=false
```

**使い分け:**
- `true`: バックエンドが未完成、またはモックデータで開発したい場合
- `false`: 実際のAPIで動作確認したい場合

---

## 6. セットアップの確認

インストールが完了したら、以下を確認してください：

- [ ] `pnpm add -D msw@latest`を実行
- [ ] `npx msw init public/ --save`を実行
- [ ] `public/mockServiceWorker.js`が生成されている
- [ ] `.gitignore`に`public/mockServiceWorker.js`を追加
- [ ] `.env.local`に`NEXT_PUBLIC_ENABLE_API_MOCKING=true`を設定
- [ ] `src/config/env.ts`でENABLE_API_MOCKINGを定義

---

## トラブルシューティング

### Service Workerが生成されない

**症状:**
```bash
npx msw init public/ --save
# エラーが出る
```

**解決策:**
```bash
# publicディレクトリが存在するか確認
ls public/

# ディレクトリがない場合は作成
mkdir public

# 再度実行
npx msw init public/ --save
```

### MSWが動作しない

**症状:**
ブラウザコンソールに`[MSW] Mock Service Worker initialized`が表示されない

**解決策:**

1. 環境変数を確認

   ```bash
   # .env.local
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. 開発サーバーを再起動

   ```bash
   # サーバーを停止（Ctrl+C）して再起動
   pnpm dev
   ```

3. ブラウザのキャッシュをクリア

   ```
   Chrome: Ctrl+Shift+Delete → キャッシュをクリア
   ```

---

## 次のステップ

インストールが完了したら、次はMSWの基本設定を行います。

1. **[基本設定](./03-basic-configuration.md)** - ディレクトリ構造とハンドラー作成
2. **[ハンドラーの作成](./04-creating-handlers.md)** - APIモックの定義

---

## 関連リンク

- [環境変数管理](../03-core-concepts/05-environment-variables.md) - 環境変数の詳細
- [MSW公式 - Getting Started](https://mswjs.io/docs/getting-started) - 公式セットアップガイド
