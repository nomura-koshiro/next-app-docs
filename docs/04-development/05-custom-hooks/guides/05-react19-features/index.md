# React 19の新機能

このガイドでは、React 19で導入された3つの新しいフック（`useOptimistic`、`useTransition`、`use`）の詳細な使い方を説明します。

> ⚠️ **重要**: このプロジェクトでは**useTransitionとuse()フックの使用を推奨しません**。実務での推奨パターンは [learning/06-react19.md](../../learning/06-react19.md#実務での推奨事項) を参照してください。

## 目次

- [useOptimistic](#useoptimistic) ✅ 推奨
- [useTransition](#usetransition) ❌ 非推奨
- [use](#use) ❌ 非推奨
- [TanStack Queryとの統合](#tanstack-queryとの統合)
- [トラブルシューティング](#トラブルシューティング)

---

## useOptimistic

### 概要

`useOptimistic`は、非同期処理の完了を待たずにUIを楽観的に更新するフックです。

### 基本構文

```typescript
const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, optimisticValue) => {
  // 楽観的更新のロジック
  return newState;
});
```

### パラメータ

| パラメータ | 型                          | 説明             |
| ---------- | --------------------------- | ---------------- |
| `state`    | `T`                         | ベースとなる状態 |
| `updateFn` | `(state: T, value: U) => T` | 楽観的更新の関数 |

### 戻り値

| 値                | 型                   | 説明                     |
| ----------------- | -------------------- | ------------------------ |
| `optimisticState` | `T`                  | 楽観的更新を含む状態     |
| `addOptimistic`   | `(value: U) => void` | 楽観的更新を追加する関数 |

### 実装パターン

#### パターン1: リストへの追加

```typescript
const [items, setItems] = useState<Item[]>([]);
const [optimisticItems, addOptimisticItem] = useOptimistic(items, (state, newItem: Item) => [...state, newItem]);

const handleAdd = async (data: CreateItemInput) => {
  const tempItem = { id: `temp-${Date.now()}`, ...data };

  // 楽観的更新
  addOptimisticItem(tempItem);

  try {
    const response = await createItem(data);
    // 成功時: 実際のデータで更新
    setItems((prev) => [...prev, response.data]);
  } catch (error) {
    // エラー時: 自動ロールバック
    console.error(error);
  }
};
```

#### パターン2: リストからの削除

```typescript
const [optimisticItems, removeOptimisticItem] = useOptimistic(items, (state, deletedId: string) =>
  state.filter((item) => item.id !== deletedId)
);

const handleDelete = async (id: string) => {
  // 楽観的削除
  removeOptimisticItem(id);

  try {
    await deleteItem(id);
  } catch (error) {
    // 自動ロールバック
    console.error(error);
  }
};
```

#### パターン3: アイテムの更新

```typescript
const [optimisticItems, updateOptimisticItem] = useOptimistic(items, (state, updated: Partial<Item> & { id: string }) =>
  state.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
);

const handleUpdate = async (id: string, data: UpdateInput) => {
  // 楽観的更新
  updateOptimisticItem({ id, ...data });

  try {
    await updateItem(id, data);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  } catch (error) {
    // 自動ロールバック
    console.error(error);
  }
};
```

### ベストプラクティス

1. **一時IDの使用**: `temp-${Date.now()}-${Math.random()}` で一意性を確保
2. **エラーハンドリング**: catch節でユーザーに通知
3. **型安全性**: TypeScriptの型パラメータを明示
4. **ベース状態の更新タイミング**: 成功時のみ更新

---

## useTransition

> ⚠️ **非推奨**: このプロジェクトでは**useTransitionの使用を推奨しません**。Next.js App Routerの`router.push()`は既に最適化されており、useTransitionによる視覚的な違いはありません。推奨パターンは [learning/06-react19.md](../../learning/06-react19.md#usetransition-ノンブロッキング更新) を参照してください。

### 概要

`useTransition`は、状態更新を非緊急としてマークし、UIのブロッキングを防ぐフックです。

### 基本構文

```typescript
const [isPending, startTransition] = useTransition();
```

### 戻り値

| 値                | 型                               | 説明                     |
| ----------------- | -------------------------------- | ------------------------ |
| `isPending`       | `boolean`                        | トランジション中かどうか |
| `startTransition` | `(callback: () => void) => void` | トランジションを開始     |

### 実装パターン

#### パターン1: ページ遷移

```typescript
const router = useRouter();
const [isPending, startTransition] = useTransition();

const handleNavigate = () => {
  startTransition(() => {
    router.push("/users");
  });
};

return (
  <Button onClick={handleNavigate} disabled={isPending}>
    {isPending ? "遷移中..." : "ユーザー一覧へ"}
  </Button>
);
```

#### パターン2: タブ切り替え

```typescript
const [activeTab, setActiveTab] = useState("overview");
const [isPending, startTransition] = useTransition();

const handleTabChange = (tab: string) => {
  startTransition(() => {
    setActiveTab(tab);
  });
};

return (
  <>
    {isPending && <LoadingIndicator />}
    <Tabs value={activeTab} onValueChange={handleTabChange} />
  </>
);
```

#### パターン3: 検索・フィルタリング

```typescript
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [isPending, startTransition] = useTransition();

const handleSearch = (newQuery: string) => {
  // 入力は即座に反映
  setQuery(newQuery);

  // フィルタリングはノンブロッキング
  startTransition(() => {
    const filtered = items.filter((item) => item.name.toLowerCase().includes(newQuery.toLowerCase()));
    setResults(filtered);
  });
};
```

### ベストプラクティス

1. **pending状態の統合**: `mutation.isPending || isPending`
2. **すべてのナビゲーションでstartTransitionを使用**
3. **適切なローディング表示**
4. **エラー時はナビゲーションしない**

---

## use

> ⚠️ **非推奨**: このプロジェクトでは**use()フックの使用を推奨しません**。Next.js 15の`params`は`await`で簡単に解決でき、use()を使うとSuspense境界とError Boundaryが必須になり、複雑さが増します。推奨パターンは [learning/06-react19.md](../../learning/06-react19.md#use-promisecontextの読み取り) を参照してください。

### 概要

`use`は、Promise、Context、その他の値を読み取るための統一的なフックです。

### 基本構文

```typescript
// Promiseの読み取り
const data = use(promise);

// Contextの読み取り
const theme = use(ThemeContext);
```

### 特徴

- **条件付き呼び出し可能**: if文の中でも使用可能
- **Suspenseとの統合**: Promiseが解決されるまで待機
- **ErrorBoundaryとの連携**: エラー時にキャッチ

### 実装パターン

#### パターン1: Next.js 15 paramsの解決

```typescript
export const useEditUser = (userId: string) => {

  const { data } = useUser({ userId });

  return { data, userId };
};
```

#### パターン2: 条件付きPromise読み取り

```typescript
const Component = ({
  dataPromise,
  shouldFetch,
}: {
  dataPromise: Promise<Data>;
  shouldFetch: boolean;
}) => {
  // 条件付きでPromiseを読み取る
  const data = shouldFetch ? use(dataPromise) : null;

  if (!data) {
    return <div>データなし</div>;
  }

  return <div>{data.name}</div>;
};
```

#### パターン3: Contextの読み取り

```typescript
const Component = ({ useTheme }: { useTheme: boolean }) => {
  // 条件付きでContextを読み取る
  const theme = useTheme ? use(ThemeContext) : null;

  return <div style={{ color: theme?.color }}>コンテンツ</div>;
};
```

### ベストプラクティス

1. **型定義を明示**: `params: Promise<{ id: string }>`
2. **SuspenseとErrorBoundaryで囲む**
3. **分割代入で必要な値だけ取得**
4. **JSDocでuseの使用を明記**

---

## TanStack Queryとの統合

### Suspenseパターン

```typescript
// API層
export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};

// ページ層（必要に応じて）
export const useUsersPage = () => {
  const { data } = useUsers();
  const users = data?.data ?? [];

  return { users };
};
```

### Mutationとの統合

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      startTransition(() => {
        router.push('/users');
      });
    },
  });

  return {
    ...mutation,
    isPending: mutation.isPending || isPending,
  };
};
```

### useOptimisticとの統合

```typescript
export const useUsersWithOptimistic = () => {
  const { data } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const users = data?.data ?? [];

  const [optimisticUsers, removeOptimisticUser] = useOptimistic(users, (state, deletedUserId: string) =>
    state.filter((user) => user.id !== deletedUserId)
  );

  const handleDelete = async (userId: string) => {
    removeOptimisticUser(userId);

    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      console.error(error);
    }
  };

  return { users: optimisticUsers, handleDelete };
};
```

---

## トラブルシューティング

### useOptimistic

**問題**: ロールバックが効かない

**原因**: ベース状態を楽観的更新と同時に更新している

**解決策**:

```typescript
// ❌ Bad
addOptimisticItem(newItem);
setItems((prev) => [...prev, newItem]);

// ✅ Good
addOptimisticItem(newItem);
try {
  await mutation.mutateAsync(data);
  setItems((prev) => [...prev, newItem]);
} catch (error) {
  // 自動ロールバック
}
```

### useTransition

**問題**: pending状態が正しく反映されない

**原因**: MutationとTransitionのpendingを統合していない

**解決策**:

```typescript
return {
  isSubmitting: createUserMutation.isPending || isPending,
};
```

### use

**問題**: "Uncaught Error: use() called outside of Suspense"

**原因**: Suspenseで囲んでいない

**解決策**:

```typescript
<Suspense fallback={<Loading />}>
  <ComponentUsingUse />
</Suspense>
```

---

## まとめ

### フック選択ガイド

| ユースケース      | フック        | 理由                 |
| ----------------- | ------------- | -------------------- |
| チャット、削除    | useOptimistic | 即座のフィードバック |
| ページ遷移、検索  | useTransition | UIをブロックしない   |
| Next.js 15 params | use           | Promise型の解決      |
| 全機能統合        | 3つ併用       | 最高のUX             |

---

## 関連ドキュメント

- [useOptimistic詳細](../04-use-optimistic.md)
- [useTransition詳細](../05-use-transition.md)
- [use詳細](../06-use-hook.md)
- [実装パターン](../03-patterns/)
