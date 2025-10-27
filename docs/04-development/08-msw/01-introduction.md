# MSWの紹介

MSW (Mock Service Worker) の概要と導入メリットについて説明します。

---

## MSWとは

**Mock Service Worker (MSW)** は、Service Worker APIを利用してネットワークリクエストをインターセプトし、モックレスポンスを返すライブラリです。

### 公式サイト

<https://mswjs.io/>

---

## 特徴

| 特徴                       | 説明                                       |
| -------------------------- | ------------------------------------------ |
| **ブラウザ/Node.js両対応** | 開発環境とテスト環境で同じモック定義を使用 |
| **Service Worker活用**     | 実際のHTTPリクエストをインターセプト       |
| **型安全**                 | TypeScriptによる型定義サポート             |
| **デバッグ容易**           | Network Tabでリクエストを確認可能          |

---

## 導入メリット

### 1. 開発効率向上

バックエンドAPIが未完成でもフロントエンド開発を進められます。

```typescript
// バックエンド未完成でもフロントエンド開発可能
const { data } = useQuery({
  queryKey: ['trainings'],
  queryFn: () => api.get('/trainings'), // MSWがモックを返す
});
```

**メリット:**

- バックエンドの開発を待たずにフロントエンド開発を進行できる
- APIの仕様が確定していれば、先行して実装可能
- デモ環境の構築が容易

---

### 2. テスト品質向上

異なるAPIレスポンスパターンを簡単にテストできます。

```typescript
// 異なるAPIレスポンスパターンを簡単にテスト
describe('TrainingList', () => {
  it('空データを表示', async () => {
    server.use(http.get('/trainings', () => HttpResponse.json([])));
    // テストコード...
  });

  it('エラー時の表示', async () => {
    server.use(http.get('/trainings', () => HttpResponse.error()));
    // テストコード...
  });
});
```

**メリット:**

- 正常系・異常系の両方をテスト可能
- ネットワークエラー、タイムアウト、404などのエッジケースを再現
- テストの実行速度が速い（実際のAPIを呼ばない）

---

### 3. Storybookとの統合

コンポーネント単位でAPIレスポンスをモックできます。

```typescript
// Storyで異なるデータパターンを簡単に作成
export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/sample/users', () => HttpResponse.json([]))],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sample/users', async () => {
          await delay('infinite');
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};
```

**メリット:**

- データの状態（空、エラー、ローディング）をStoryで簡単に再現
- デザインレビューが容易
- コンポーネントの動作確認が簡単

---

### 4. 本番環境との整合性

Service Workerを使用するため、実際のHTTPリクエストをインターセプトします。

```typescript
// 実際のHTTPリクエストと同じように動作
fetch('/api/sample/users'); // MSWがインターセプト
axios.get('/api/sample/users'); // MSWがインターセプト
api.get('/sample/users'); // MSWがインターセプト
```

**メリット:**

- 本番環境と同じコードでテスト可能
- APIクライアントライブラリに依存しない
- モックのコードを本番に含める必要がない

---

## このプロジェクトでの使用目的

### 開発環境

- バックエンドAPIのモック
- API仕様の確認と検証
- フロントエンドの先行開発

### Storybook

- コンポーネント開発時のAPIモック
- 異なるデータパターンの表示確認
- デザインレビュー用のデモ

### E2Eテスト（Playwright）

- 統合テストでのAPIモック
- エンドツーエンドのシナリオテスト
- エッジケースの再現

### 統合テスト（Vitest）

- コンポーネントの統合テスト
- APIレスポンスのパターンテスト
- エラーハンドリングのテスト

---

## MSWを使わない場合の問題

### 問題1: バックエンド依存

```typescript
// ❌ Bad: バックエンドが完成するまで開発できない
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users'), // バックエンドが必要
});
```

### 問題2: テストが不安定

```typescript
// ❌ Bad: 実際のAPIを呼ぶため不安定
test('ユーザー一覧を表示', async () => {
  render(<UserList />)
  // ネットワークに依存、データが変わると失敗
})
```

### 問題3: エッジケースの再現が困難

```typescript
// ❌ Bad: エラーケースをテストしにくい
// サーバーエラーやネットワークエラーを意図的に発生させるのは困難
```

---

## MSWを使った場合の解決

### 解決1: バックエンド非依存

```typescript
// ✅ Good: MSWがモックを返す
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users'), // MSWがレスポンス
});
```

### 解決2: 安定したテスト

```typescript
// ✅ Good: MSWで安定したレスポンス
test('ユーザー一覧を表示', async () => {
  server.use(
    http.get('/users', () => HttpResponse.json([...]))
  )
  render(<UserList />)
  // 常に同じデータでテスト可能
})
```

### 解決3: エッジケースの再現

```typescript
// ✅ Good: エラーケースを簡単に再現
server.use(
  http.get('/users', () => {
    return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  })
);
```

---

## 次のステップ

1. **[インストール](./02-installation.md)** - MSWのセットアップ
2. **[基本設定](./03-basic-configuration.md)** - ディレクトリ構造とハンドラー作成

---

## 関連リンク

- [MSW公式ドキュメント](https://mswjs.io/) - 公式ドキュメント
- [API統合](../05-api-integration.md) - TanStack Queryとの連携
- [Storybook](../06-storybook.md) - Storybookの設定
