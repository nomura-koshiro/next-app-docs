# クイックリファレンス

このガイドでは、よく使うコードスニペット、FAQ、トラブルシューティングをまとめています。

## 目次

- [チートシート](#チートシート)
- [よくある質問（FAQ）](#よくある質問faq)
- [トラブルシューティング](#トラブルシューティング)
- [API仕様一覧](#api仕様一覧)
- [関連リンク](#関連リンク)

---

## チートシート

### フック選択ガイド

| やりたいこと | 使うフック | ファイル例 |
|------------|----------|----------|
| **ログイン** | useForm + useMutation + useTransition | [authentication.md](./03-use-cases/01-authentication.md) |
| **ユーザー作成** | useForm + useMutation + useTransition | [crud-operations.md](./03-use-cases/02-crud-operations.md) |
| **ユーザー編集** | use + useForm + useMutation + useTransition | [crud-operations.md](./03-use-cases/02-crud-operations.md) |
| **ユーザー削除** | use + useOptimistic + useMutation | [crud-operations.md](./03-use-cases/02-crud-operations.md) |
| **ユーザー一覧** | useSuspenseQuery | [crud-operations.md](./03-use-cases/02-crud-operations.md) |
| **チャット送信** | useOptimistic + useMutation | [realtime-updates.md](./03-use-cases/03-realtime-updates.md) |
| **検索ボックス** | useTransition + useState | [search-filter.md](./03-use-cases/04-search-filter.md) |
| **ファイルアップロード** | useOptimistic + useState | [file-operations.md](./03-use-cases/05-file-operations.md) |

### コードスニペット

#### 基本フォームフック

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useBasicForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { /* ... */ },
  });

  const onSubmit = handleSubmit(async (data) => {
    // 処理
  });

  return { control, onSubmit, errors };
};
```

#### API連携フォーム

```typescript
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const useApiForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mutation = useMutation({ mutationFn: createItem });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      startTransition(() => router.push("/items"));
    } catch (error) {
      setError("root", { message: "エラーが発生しました" });
    }
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: mutation.isPending || isPending,
  };
};
```

#### 楽観的更新

```typescript
import { useOptimistic } from "react";

const [items, setItems] = useState<Item[]>([]);
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (state, newItem: Item) => [...state, newItem]
);

const handleAdd = async (data: CreateInput) => {
  const tempItem = { id: `temp-${Date.now()}`, ...data };
  addOptimisticItem(tempItem);

  try {
    const response = await createItem(data);
    setItems((prev) => [...prev, response.data]);
  } catch (error) {
    console.error(error);
  }
};
```

#### Next.js 15 params解決

```typescript
import { use } from "react";

export const useEditItem = (itemId: string) => {
  const { data } = useItem({ itemId });

  return { data, itemId };
};
```

---

## よくある質問（FAQ）

### Q1: どのフックを使えばいいかわからない

**A:** [全体像ガイド](./01-overview.md#フック選択フローチャート)のフローチャートを使用してください。

### Q2: useOptimisticのロールバックが効かない

**A:** ベース状態を楽観的更新と同時に更新していないか確認してください。

```typescript
// ❌ Bad
addOptimisticItem(newItem);
setItems((prev) => [...prev, newItem]); // 即座に更新

// ✅ Good
addOptimisticItem(newItem);
try {
  await mutation.mutateAsync(data);
  setItems((prev) => [...prev, newItem]); // 成功時のみ更新
} catch (error) {
  // 自動ロールバック
}
```

### Q3: useTransitionはどこで使う?

**A:** 以下のケースで使用します:

- ページ遷移 (`router.push`)
- タブ切り替え
- 検索・フィルタリング
- 大量データの処理

### Q4: Suspenseエラーが出る

**A:** `use`フックを使う場合、必ずSuspenseで囲んでください。

```typescript
<Suspense fallback={<Loading />}>
  <ComponentUsingUse />
</Suspense>
```

### Q5: フォームのデフォルト値が反映されない

**A:** `useEffect`でデータ取得後にresetを使用してください。

```typescript
useEffect(() => {
  if (data?.data) {
    reset({
      name: data.data.name,
      email: data.data.email,
    });
  }
}, [data, reset]);
```

### Q6: エラーメッセージが表示されない

**A:** `setError("root", { message: "..." })`を使用し、UIで`errors.root`を表示してください。

```typescript
{errors.root && (
  <div className="error-message">{errors.root.message}</div>
)}
```

### Q7: ローディング状態を統合したい

**A:** MutationとTransitionのpendingをOR演算子で統合してください。

```typescript
return {
  isSubmitting: mutation.isPending || isPending,
};
```

### Q8: TanStack QueryとuseOptimisticの併用方法は?

**A:** API層でuseSuspenseQueryを使い、ページ層でuseOptimisticを追加してください。

```typescript
// API層
export const useUsers = () => {
  return useSuspenseQuery({ queryKey: ["users"], queryFn: getUsers });
};

// ページ層
export const useUsersPage = () => {
  const { data } = useUsers();
  const users = data?.data ?? [];

  const [optimisticUsers, removeUser] = useOptimistic(
    users,
    (state, id: string) => state.filter((u) => u.id !== id)
  );

  return { users: optimisticUsers, removeUser };
};
```

---

## トラブルシューティング

### エラー: "use() called outside of Suspense"

**原因**: `use`フックをSuspenseで囲んでいない

**解決策**:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <ComponentUsingUse />
</Suspense>
```

### エラー: "Cannot update a component while rendering a different component"

**原因**: レンダリング中に状態更新している

**解決策**: useEffectまたはイベントハンドラー内で更新

```typescript
// ❌ Bad
if (condition) {
  setState(newValue);
}

// ✅ Good
useEffect(() => {
  if (condition) {
    setState(newValue);
  }
}, [condition]);
```

### エラー: "Maximum update depth exceeded"

**原因**: 無限ループの依存配列

**解決策**: 依存配列を正しく設定

```typescript
// ❌ Bad: オブジェクトを毎回生成
useEffect(() => {
  fetchData({ filter: { name: query } });
}, [{ filter: { name: query } }]);

// ✅ Good
useEffect(() => {
  fetchData({ filter: { name: query } });
}, [query]);
```

### useTransitionでpending状態が常にfalse

**原因**: startTransition内で非同期処理を実行している

**解決策**: 非同期処理はstartTransitionの外で実行

```typescript
// ❌ Bad
startTransition(async () => {
  await mutation.mutateAsync(data);
  router.push("/users");
});

// ✅ Good
await mutation.mutateAsync(data);
startTransition(() => {
  router.push("/users");
});
```

### TanStack Queryのキャッシュが更新されない

**原因**: invalidateQueriesを実行していない

**解決策**: onSuccessでキャッシュを無効化

```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

---

## API仕様一覧

### React Hooks

| フック | 戻り値 | 主な用途 |
|-------|-------|---------|
| `useOptimistic` | `[state, addOptimistic]` | 楽観的UI更新 |
| `useTransition` | `[isPending, startTransition]` | ノンブロッキング更新 |
| `use` | `T` | Promise/Context読み取り |
| `useState` | `[state, setState]` | 状態管理 |
| `useEffect` | `void` | 副作用 |
| `useMemo` | `T` | メモ化 |
| `useCallback` | `Function` | 関数メモ化 |

### React Hook Form

| フック/関数 | 戻り値 | 主な用途 |
|-----------|-------|---------|
| `useForm` | `FormMethods` | フォーム管理 |
| `control` | `Control` | フィールド制御 |
| `handleSubmit` | `(data) => void` | 送信処理 |
| `setError` | `void` | エラー設定 |
| `reset` | `void` | フォームリセット |

### TanStack Query

| フック | 戻り値 | 主な用途 |
|-------|-------|---------|
| `useSuspenseQuery` | `{ data, refetch }` | データ取得（Suspense） |
| `useQuery` | `{ data, isLoading, error }` | データ取得 |
| `useMutation` | `{ mutate, isPending }` | データ更新 |
| `useQueryClient` | `QueryClient` | キャッシュ操作 |

### Next.js

| フック | 戻り値 | 主な用途 |
|-------|-------|---------|
| `useRouter` | `Router` | ナビゲーション |
| `useParams` | `Params` | URLパラメータ |
| `useSearchParams` | `SearchParams` | クエリパラメータ |

---

## 関連リンク

### 公式ドキュメント

- [React 19 Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### プロジェクトドキュメント

- [全体像](../02-overview/)
- [実装パターン](../03-patterns/)
- [React 19機能](../05-react19-features/)
- [ベストプラクティス](../06-best-practices/)

### ユースケース

- [認証機能](./03-use-cases/01-authentication.md)
- [CRUD操作](./03-use-cases/02-crud-operations.md)
- [リアルタイム更新](./03-use-cases/03-realtime-updates.md)
- [検索・フィルター](./03-use-cases/04-search-filter.md)
- [ファイル操作](./03-use-cases/05-file-operations.md)

---

## サポート

### 問題が解決しない場合

1. [トラブルシューティング](#トラブルシューティング)を確認
2. [FAQ](#よくある質問faq)を確認
3. チーム内でレビュー依頼
4. GitHub Issuesで質問

### ドキュメントの改善提案

ドキュメントの改善提案は、Pull Requestで受け付けています。

---

## 更新履歴

| 日付 | 変更内容 |
|-----|---------|
| 2025-10-26 | 初版作成 |
