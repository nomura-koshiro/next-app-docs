# ベストプラクティス

このガイドでは、カスタムフック実装における推奨される実装方法とアンチパターンを説明します。

## 目次

- [エラーハンドリング](#エラーハンドリング)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [テスト](#テスト)
- [セキュリティ](#セキュリティ)
- [アクセシビリティ](#アクセシビリティ)
- [コードレビューチェックリスト](#コードレビューチェックリスト)

---

## エラーハンドリング

### 1. フォームエラーはsetErrorを使用

```typescript
// ✅ Good: フォームエラーとして管理
await createUserMutation.mutateAsync(data).catch((error) => {
  setError("root", {
    message: "ユーザーの作成に失敗しました。もう一度お試しください。",
  });
});

// ❌ Bad: console.errorのみ
await createUserMutation.mutateAsync(data).catch((error) => {
  console.error(error);
});
```

### 2. エラーメッセージは日本語でユーザーフレンドリーに

```typescript
// ✅ Good
setError("root", {
  message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
});

// ❌ Bad
setError("root", {
  message: error.message, // "Authentication failed"
});
```

### 3. エラー型の判定

```typescript
// ✅ Good: エラー型で適切なメッセージ
await mutation.mutateAsync(data).catch((error) => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      setError("root", { message: "認証に失敗しました" });
    } else if (error.status === 400) {
      setError("root", { message: "入力内容に誤りがあります" });
    } else {
      setError("root", { message: "サーバーエラーが発生しました" });
    }
  } else {
    setError("root", { message: "予期しないエラーが発生しました" });
  }
});
```

### 4. エラー時のロールバック通知

```typescript
// ✅ Good: ユーザーに通知
catch (error) {
  console.error("削除に失敗しました:", error);
  alert("ユーザーの削除に失敗しました。");
}

// ❌ Bad: 何も通知しない
catch (error) {
  console.error(error);
}
```

---

## パフォーマンス最適化

### 1. データ変換はフック内で1回のみ

```typescript
// ✅ Good: フック内で変換
export const useUsers = () => {
  const { data } = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const users = useMemo(
    () =>
      data?.map((user) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
      })) ?? [],
    [data]
  );

  return { users };
};

// ❌ Bad: コンポーネント内で毎回変換
const Component = () => {
  const { users: rawUsers } = useUsers();
  const users = rawUsers.map(/* 変換 */); // 毎レンダリング実行
};
```

### 2. useMemoで重い計算をメモ化

```typescript
// ✅ Good: メモ化
const sortedUsers = useMemo(() => {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// ❌ Bad: 毎回ソート
const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
```

### 3. useCallbackでハンドラーを安定化

```typescript
// ✅ Good: useCallback使用
const handleDelete = useCallback(
  async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);
  },
  [deleteUserMutation]
);

// ❌ Bad: 毎回新しい関数
const handleDelete = async (userId: string) => {
  await deleteUserMutation.mutateAsync(userId);
};
```

### 4. デバウンスで無駄な処理を削減

```typescript
// ✅ Good: デバウンス使用
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery) {
    searchUsers(debouncedQuery);
  }
}, [debouncedQuery]);

// ❌ Bad: 毎回検索
useEffect(() => {
  searchUsers(query);
}, [query]);
```

---

## テスト

### 1. フックのテスト

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useLogin } from "./login.hook";

describe("useLogin", () => {
  it("ログイン成功時にユーザー一覧ページに遷移する", async () => {
    const { result } = renderHook(() => useLogin());

    await result.current.onSubmit({
      email: "test@example.com",
      password: "password123",
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/sample-users");
    });
  });

  it("ログイン失敗時にエラーメッセージを表示する", async () => {
    const { result } = renderHook(() => useLogin());

    await result.current.onSubmit({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    await waitFor(() => {
      expect(result.current.errors.root).toBeDefined();
    });
  });
});
```

### 2. モックの活用

```typescript
// API層のモック
vi.mock("../../api/create-user", () => ({
  useCreateUser: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ data: mockUser }),
    isPending: false,
  }),
}));

// Router のモック
const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));
```

### 3. エッジケースのテスト

```typescript
describe("useUsers - エッジケース", () => {
  it("データが空の場合", () => {
    const { result } = renderHook(() => useUsers());
    expect(result.current.users).toEqual([]);
  });

  it("エラーが発生した場合", async () => {
    // エラーをモック
    vi.mocked(useUsersQuery).mockReturnValue({
      data: undefined,
      error: new Error("Failed to fetch"),
    });

    const { result } = renderHook(() => useUsers());
    expect(result.current.error).toBeDefined();
  });
});
```

---

## セキュリティ

### 1. トークン管理

```typescript
// ✅ Good: httpOnlyクッキー（推奨）
// サーバー側でセット

// ✅ Good: localStorageの場合はXSS対策必須
const token = localStorage.getItem("token");
if (token) {
  // トークン検証
  validateToken(token);
}

// ❌ Bad: トークンをstateに保存
const [token, setToken] = useState(localStorage.getItem("token"));
```

### 2. 入力値のサニタイゼーション

```typescript
// ✅ Good: Zodでバリデーション
export const userFormSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
});

// ✅ Good: DOMPurifyでサニタイズ
import DOMPurify from "dompurify";

const sanitizedContent = DOMPurify.sanitize(userInput);
```

### 3. CSRF対策

```typescript
// ✅ Good: CSRFトークンをヘッダーに追加（自動処理）
// src/lib/api-client.ts で実装済み
import { getCsrfHeaderName, getCsrfToken } from "@/lib/csrf";

api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken(); // Cookieから取得
  if (csrfToken) {
    config.headers[getCsrfHeaderName()] = csrfToken; // X-CSRF-Token
  }
  return config;
});

// 📝 開発者が意識する必要なし
// api-client.tsで自動的にCSRFトークンが送信される
```

---

## アクセシビリティ

### 1. エラーメッセージのaria-live

```tsx
// ✅ Good: スクリーンリーダー対応
{
  errors.root && (
    <div role="alert" aria-live="polite" className="error-message">
      {errors.root.message}
    </div>
  );
}
```

### 2. ローディング状態の通知

```tsx
// ✅ Good: ローディング状態を明示
<Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
  {isSubmitting ? "送信中..." : "送信"}
</Button>
```

### 3. フォームのラベル

```tsx
// ✅ Good: labelとinputを関連付け
<label htmlFor="email">メールアドレス</label>
<input id="email" type="email" {...register("email")} />

// ❌ Bad: labelなし
<input type="email" placeholder="メールアドレス" />
```

---

## コードレビューチェックリスト

### フック実装

- [ ] JSDocコメントを追加
- [ ] セクションコメントで区切り
- [ ] TypeScript型を明示
- [ ] 必要なプロパティのみを返す
- [ ] `onSubmit`で送信処理をラップ
- [ ] エラーハンドリングを実装
- [ ] ローディング状態を返す
- [ ] 適切な命名規則に従う

### React 19機能

- [ ] useOptimistic: ベース状態を成功時のみ更新
- [ ] useTransition: すべてのナビゲーションでstartTransitionを使用
- [ ] use: Suspense + ErrorBoundaryで囲む
- [ ] pending状態を統合

### パフォーマンス

- [ ] useMemoで重い計算をメモ化
- [ ] useCallbackでハンドラーを安定化
- [ ] 不要な再レンダリングを防止
- [ ] デバウンス処理を適用

### エラーハンドリング

- [ ] ユーザーフレンドリーなエラーメッセージ
- [ ] エラー型の判定
- [ ] ロールバック時の通知
- [ ] エラーログの記録

### セキュリティ

- [ ] 入力値のバリデーション
- [ ] トークン管理の適切性
- [ ] CSRF対策
- [ ] XSS対策

### アクセシビリティ

- [ ] aria属性の適切な使用
- [ ] ローディング状態の通知
- [ ] フォームラベルの関連付け
- [ ] キーボード操作対応

### テスト

- [ ] 正常系のテスト
- [ ] 異常系のテスト
- [ ] エッジケースのテスト
- [ ] モックの適切な使用

---

## アンチパターン集

### 1. フック内でコンポーネントを返す

```typescript
// ❌ Bad
export const useDialog = () => {
  return <Dialog>...</Dialog>;
};

// ✅ Good: 状態とハンドラーを返す
export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};
```

### 2. 無限ループの依存配列

```typescript
// ❌ Bad: オブジェクトを毎回生成
useEffect(() => {
  fetchData({ filter: { name: query } });
}, [{ filter: { name: query } }]);

// ✅ Good: プリミティブ値を依存配列に
useEffect(() => {
  fetchData({ filter: { name: query } });
}, [query]);
```

### 3. 非同期処理のuseEffect

```typescript
// ❌ Bad: useEffectで非同期処理
useEffect(async () => {
  await fetchData();
}, []);

// ✅ Good: 内部で非同期関数を定義
useEffect(() => {
  const fetchDataAsync = async () => {
    await fetchData();
  };
  fetchDataAsync();
}, []);
```

---

## まとめ

### 優先度

| 優先度    | 項目                             |
| --------- | -------------------------------- |
| 🔴 **高** | エラーハンドリング、セキュリティ |
| 🟡 **中** | パフォーマンス、アクセシビリティ |
| 🟢 **低** | コメント、命名規則               |

---

## 関連ドキュメント

- [実装パターン](../03-patterns/)
- [React 19機能](../05-react19-features/)
- [リファレンス](../07-reference/)
