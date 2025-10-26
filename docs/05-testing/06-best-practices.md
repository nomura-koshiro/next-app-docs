# テストのベストプラクティス

効果的で保守しやすいテストを書くためのベストプラクティスについて説明します。AAAパターン、テストデータ管理、可読性向上のテクニックを解説します。

## 目次

1. [AAAパターン](#aaaパターン)
2. [テストの独立性](#テストの独立性)
3. [ユーザー視点でのテスト](#ユーザー視点でのテスト)
4. [テストの可読性](#テストの可読性)
5. [テストデータ管理](#テストデータ管理)
6. [モックのベストプラクティス](#モックのベストプラクティス)
7. [カバレッジの適切な設定](#カバレッジの適切な設定)
8. [テストの保守性](#テストの保守性)
9. [やってはいけないこと](#やってはいけないこと)

---

## AAAパターン

### Arrange-Act-Assertパターン

AAAパターンは、テストを3つの明確なフェーズに分けることで、可読性と保守性を向上させます。

```typescript
it('トレーニングを作成する', async () => {
  // Arrange: テストの準備
  const newTraining = {
    name: 'ベンチプレス',
    weight: 80,
    sets: 3,
    reps: 10,
  }

  // Act: 実行
  const result = await createTraining(newTraining)

  // Assert: 検証
  expect(result).toMatchObject({
    id: expect.any(String),
    ...newTraining,
    createdAt: expect.any(String),
  })
})
```

### 複雑なテストでのAAAパターン

```typescript
describe('TrainingForm', () => {
  it('バリデーションエラーを表示する', async () => {
    // Arrange
    const handleSubmit = vi.fn()
    render(<TrainingForm onSubmit={handleSubmit} />)

    // Act
    // 空のまま送信
    fireEvent.click(screen.getByRole('button', { name: '保存' }))

    // Assert
    await waitFor(() => {
      expect(screen.getByText('トレーニング名は必須です')).toBeInTheDocument()
      expect(screen.getByText('重量は必須です')).toBeInTheDocument()
      expect(handleSubmit).not.toHaveBeenCalled()
    })
  })
})
```

### Given-When-Thenパターン（BDD）

```typescript
describe('ユーザー管理', () => {
  it('管理者が他のユーザーを削除できる', async () => {
    // Given: 管理者としてログイン
    const admin = createUser({ role: 'admin' })
    const targetUser = createUser({ id: 'user-1', role: 'user' })
    await loginAs(admin)

    // When: ユーザーを削除
    await deleteUser(targetUser.id)

    // Then: ユーザーが削除される
    const users = await getUsers()
    expect(users.find((u) => u.id === targetUser.id)).toBeUndefined()
  })
})
```

---

## テストの独立性

### 各テストは独立して実行できるべき

```typescript
// ❌ Bad: テスト間で状態を共有
let training: Training

it('トレーニングを作成', () => {
  training = createTraining({ name: 'ベンチプレス' })
  expect(training).toBeDefined()
})

it('トレーニングを更新', () => {
  // trainingに依存（前のテストが失敗すると動かない）
  updateTraining(training.id, { weight: 90 })
})

// ✅ Good: 各テストで初期化
it('トレーニングを作成', () => {
  const training = createTraining({ name: 'ベンチプレス' })
  expect(training).toBeDefined()
})

it('トレーニングを更新', () => {
  const training = createTraining({ name: 'ベンチプレス' })
  const updated = updateTraining(training.id, { weight: 90 })
  expect(updated.weight).toBe(90)
})
```

### beforeEachの活用

```typescript
describe('TrainingService', () => {
  let service: TrainingService
  let mockRepository: jest.Mocked<TrainingRepository>

  beforeEach(() => {
    // 各テストの前に初期化
    mockRepository = {
      find: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
    service = new TrainingService(mockRepository)
  })

  afterEach(() => {
    // テスト後のクリーンアップ
    vi.clearAllMocks()
  })

  it('トレーニングを取得する', async () => {
    mockRepository.find.mockResolvedValue([
      { id: '1', name: 'ベンチプレス' },
    ])

    const result = await service.getTrainings()

    expect(result).toHaveLength(1)
  })
})
```

### テストの実行順序に依存しない

```typescript
// ✅ Good: 実行順序に関係なく動作する
describe('User API', () => {
  it('ユーザーを作成できる', async () => {
    const user = await createUser({ name: 'Test User' })
    expect(user.name).toBe('Test User')
  })

  it('ユーザーを更新できる', async () => {
    const user = await createUser({ name: 'Test User' })
    const updated = await updateUser(user.id, { name: 'Updated User' })
    expect(updated.name).toBe('Updated User')
  })

  it('ユーザーを削除できる', async () => {
    const user = await createUser({ name: 'Test User' })
    await deleteUser(user.id)
    const result = await getUser(user.id)
    expect(result).toBeNull()
  })
})
```

---

## ユーザー視点でのテスト

### 実装詳細ではなくユーザー行動をテスト

```typescript
// ❌ Bad: 実装詳細をテスト
it('useState が正しく動作する', () => {
  const { result } = renderHook(() => useState(0))
  expect(result.current[0]).toBe(0)

  act(() => {
    result.current[1](1)
  })

  expect(result.current[0]).toBe(1)
})

// ✅ Good: ユーザー視点でテスト
it('カウンターが増加する', () => {
  render(<Counter />)

  expect(screen.getByText('0')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: '+' }))

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### アクセシビリティを意識したセレクタ

```typescript
// ❌ Bad: CSS クラスやタグに依存
const button = container.querySelector('.submit-button')
const input = container.querySelector('input[type="text"]')

// ✅ Good: ユーザーがどう認識するかを基準に
const button = screen.getByRole('button', { name: '送信' })
const input = screen.getByLabelText('メールアドレス')
const heading = screen.getByRole('heading', { name: 'ログイン' })
```

### Testing Library のクエリ優先順位

```typescript
// 優先順位（上から順に推奨）

// 1. アクセシブルなクエリ（最優先）
screen.getByRole('button', { name: 'ログイン' })
screen.getByLabelText('メールアドレス')
screen.getByPlaceholderText('検索...')
screen.getByText('ようこそ')

// 2. セマンティックなクエリ
screen.getByAltText('プロフィール画像')
screen.getByTitle('ヘルプ')

// 3. テストID（最終手段）
screen.getByTestId('custom-element')
```

---

## テストの可読性

### 明確なテスト名

```typescript
// ❌ Bad: 曖昧なテスト名
it('works', () => {})
it('test1', () => {})
it('should work correctly', () => {})

// ✅ Good: 何をテストするか明確
it('空のフォームを送信するとバリデーションエラーが表示される', () => {})
it('管理者は他のユーザーを削除できる', () => {})
it('無効なメールアドレスの場合はエラーメッセージを表示する', () => {})
```

### テストの構造化

```typescript
describe('TrainingForm', () => {
  describe('送信時', () => {
    it('有効なデータでonSubmitが呼ばれる', async () => {
      const handleSubmit = vi.fn()
      render(<TrainingForm onSubmit={handleSubmit} />)

      await userEvent.type(screen.getByLabelText('トレーニング名'), 'ベンチプレス')
      await userEvent.type(screen.getByLabelText('重量'), '80')
      await userEvent.click(screen.getByRole('button', { name: '保存' }))

      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'ベンチプレス',
        weight: 80,
      })
    })

    it('無効なデータでエラーを表示する', async () => {
      render(<TrainingForm onSubmit={vi.fn()} />)

      await userEvent.click(screen.getByRole('button', { name: '保存' }))

      expect(screen.getByText('トレーニング名は必須です')).toBeInTheDocument()
    })
  })

  describe('キャンセル時', () => {
    it('onCancelが呼ばれる', async () => {
      const handleCancel = vi.fn()
      render(<TrainingForm onCancel={handleCancel} />)

      await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

      expect(handleCancel).toHaveBeenCalled()
    })
  })
})
```

### ヘルパー関数の活用

```typescript
// tests/helpers/render-with-providers.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  {
    user = null,
    ...options
  }: {
    user?: User | null
  } & RenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider user={user}>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// 使用例
it('認証済みユーザーにウェルカムメッセージを表示', () => {
  const user = createUser({ name: 'Test User' })
  renderWithProviders(<Dashboard />, { user })

  expect(screen.getByText('ようこそ、Test User さん')).toBeInTheDocument()
})
```

---

## テストデータ管理

### Factory関数パターン

```typescript
// tests/factories/user-factory.ts
export const createUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'user',
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
})

// 使用例
const admin = createUser({ role: 'admin' })
const guest = createUser({ name: 'Guest User', role: 'guest' })
const users = Array.from({ length: 10 }, () => createUser())
```

```typescript
// tests/factories/training-factory.ts
export const createTraining = (overrides?: Partial<Training>): Training => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(['ベンチプレス', 'スクワット', 'デッドリフト']),
  weight: faker.number.int({ min: 40, max: 200 }),
  sets: faker.number.int({ min: 1, max: 5 }),
  reps: faker.number.int({ min: 1, max: 12 }),
  date: faker.date.recent().toISOString(),
  userId: faker.string.uuid(),
  ...overrides,
})

export const createTrainingList = (count: number, overrides?: Partial<Training>): Training[] => {
  return Array.from({ length: count }, () => createTraining(overrides))
}
```

### Fixture管理

```typescript
// tests/fixtures/users.ts
export const userFixtures = {
  admin: createUser({
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  }),
  regular: createUser({
    id: 'user-1',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  }),
  guest: createUser({
    id: 'guest-1',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'guest',
  }),
}

// 使用例
it('管理者のみが削除ボタンを見られる', () => {
  renderWithProviders(<UserList />, { user: userFixtures.admin })
  expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
})
```

### テストデータビルダーパターン

```typescript
// tests/builders/training-builder.ts
export class TrainingBuilder {
  private training: Partial<Training> = {}

  withName(name: string): this {
    this.training.name = name
    return this
  }

  withWeight(weight: number): this {
    this.training.weight = weight
    return this
  }

  withUser(userId: string): this {
    this.training.userId = userId
    return this
  }

  build(): Training {
    return createTraining(this.training)
  }
}

// 使用例
const training = new TrainingBuilder()
  .withName('ベンチプレス')
  .withWeight(80)
  .withUser('user-1')
  .build()
```

### モックデータの一元管理

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { createTrainingList } from '../factories/training-factory'

export const handlers = [
  http.get('/api/trainings', () => {
    return HttpResponse.json(createTrainingList(10))
  }),

  http.get('/api/trainings/:id', ({ params }) => {
    const training = createTraining({ id: params.id as string })
    return HttpResponse.json(training)
  }),

  http.post('/api/trainings', async ({ request }) => {
    const body = await request.json()
    const training = createTraining(body)
    return HttpResponse.json(training, { status: 201 })
  }),
]
```

---

## モックのベストプラクティス

### 必要最小限のモック

```typescript
// ❌ Bad: すべてをモック
vi.mock('@/lib/api-client')
vi.mock('@/hooks/use-user')
vi.mock('@/components/ui/button')

// ✅ Good: 必要な部分だけモック
vi.mock('@/lib/api-client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))
```

### モックのリセット

```typescript
describe('TrainingService', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks()
  })

  it('トレーニングを取得する', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      { id: '1', name: 'ベンチプレス' },
    ])

    const result = await getTrainings()

    expect(result).toHaveLength(1)
    expect(api.get).toHaveBeenCalledTimes(1)
  })
})
```

### 部分的なモック

```typescript
// 特定のメソッドだけモック
vi.mock('@/lib/date-utils', async () => {
  const actual = await vi.importActual('@/lib/date-utils')
  return {
    ...actual,
    getCurrentDate: vi.fn(() => new Date('2025-01-15')),
  }
})
```

### モックの型安全性

```typescript
// ❌ Bad: 型が失われる
const mockApi = api as any
mockApi.get.mockResolvedValue([])

// ✅ Good: 型安全なモック
const mockApi = api as jest.Mocked<typeof api>
mockApi.get.mockResolvedValue([
  { id: '1', name: 'ベンチプレス' }, // 型チェックされる
])
```

---

## カバレッジの適切な設定

### カバレッジの目標値

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        '**/__tests__/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
```

### カバレッジの解釈

- **Lines**: コード行のカバレッジ
- **Functions**: 関数のカバレッジ
- **Branches**: 条件分岐のカバレッジ
- **Statements**: 文のカバレッジ

```typescript
// 例: Branchカバレッジ
function validateAge(age: number): string {
  if (age < 0) {
    return 'Invalid' // ブランチ1
  } else if (age < 18) {
    return 'Minor' // ブランチ2
  } else {
    return 'Adult' // ブランチ3
  }
}

// すべてのブランチをテスト
it('年齢検証', () => {
  expect(validateAge(-1)).toBe('Invalid')
  expect(validateAge(10)).toBe('Minor')
  expect(validateAge(20)).toBe('Adult')
})
```

### カバレッジのバランス

```typescript
// ❌ Bad: 100%を目指して無意味なテスト
it('getterが値を返す', () => {
  const user = new User('Test')
  expect(user.name).toBe('Test') // 意味のないテスト
})

// ✅ Good: ビジネスロジックに焦点
it('無効なメールアドレスを拒否する', () => {
  expect(() => new User('invalid-email')).toThrow('Invalid email')
})
```

---

## テストの保守性

### DRY原則（Don't Repeat Yourself）

```typescript
// ❌ Bad: 重複したセットアップ
it('テスト1', async () => {
  const user = createUser()
  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={user}>{children}</AuthProvider>
    </QueryClientProvider>
  )
  // テストコード...
})

it('テスト2', async () => {
  const user = createUser()
  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={user}>{children}</AuthProvider>
    </QueryClientProvider>
  )
  // テストコード...
})

// ✅ Good: 共通化
const setup = (user = createUser()) => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={user}>{children}</AuthProvider>
    </QueryClientProvider>
  )
  return { user, queryClient, wrapper }
}

it('テスト1', async () => {
  const { wrapper } = setup()
  // テストコード...
})
```

### テストの分割

```typescript
// ❌ Bad: 1つのテストで複数のことをテスト
it('フォーム全体の動作', async () => {
  render(<TrainingForm />)

  // バリデーションテスト
  await userEvent.click(screen.getByRole('button', { name: '保存' }))
  expect(screen.getByText('エラー')).toBeInTheDocument()

  // 入力テスト
  await userEvent.type(screen.getByLabelText('名前'), 'ベンチプレス')

  // 送信テスト
  await userEvent.click(screen.getByRole('button', { name: '保存' }))
  // ...
})

// ✅ Good: 関心事ごとに分割
describe('TrainingForm', () => {
  it('空のフォームでバリデーションエラーを表示', async () => {
    render(<TrainingForm />)
    await userEvent.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('エラー')).toBeInTheDocument()
  })

  it('入力された値を保持する', async () => {
    render(<TrainingForm />)
    await userEvent.type(screen.getByLabelText('名前'), 'ベンチプレス')
    expect(screen.getByLabelText('名前')).toHaveValue('ベンチプレス')
  })

  it('有効なデータで送信できる', async () => {
    const handleSubmit = vi.fn()
    render(<TrainingForm onSubmit={handleSubmit} />)
    // ...
  })
})
```

### コメントの活用

```typescript
it('複雑なビジネスロジックのテスト', async () => {
  // Given: 月額プランのユーザー
  const user = createUser({ plan: 'monthly' })

  // When: 年間プランにアップグレード（割引適用）
  // 注意: 年間プランは2ヶ月分無料
  const result = await upgradePlan(user.id, 'yearly')

  // Then: 正しい割引が適用される
  expect(result.price).toBe(1200) // 1400 - 200（2ヶ月分）
})
```

---

## やってはいけないこと

### 1. テストでロジックを書かない

```typescript
// ❌ Bad: テスト内にロジック
it('合計を計算する', () => {
  const items = [10, 20, 30]
  let sum = 0
  for (const item of items) {
    sum += item
  }
  expect(calculateSum(items)).toBe(sum) // テスト自体にバグがあるかも
})

// ✅ Good: 期待値を明示
it('合計を計算する', () => {
  const items = [10, 20, 30]
  expect(calculateSum(items)).toBe(60)
})
```

### 2. 実装詳細に依存しない

```typescript
// ❌ Bad: 内部状態に依存
it('カウンターが増える', () => {
  const counter = new Counter()
  counter.increment()
  expect(counter._value).toBe(1) // プライベート変数に依存
})

// ✅ Good: 公開APIを使う
it('カウンターが増える', () => {
  const counter = new Counter()
  counter.increment()
  expect(counter.getValue()).toBe(1)
})
```

### 3. 非同期処理を適切に扱う

```typescript
// ❌ Bad: 非同期を待たない
it('データを取得する', () => {
  const result = fetchData() // Promiseが返る
  expect(result).toBe(data) // 常に失敗
})

// ✅ Good: awaitを使う
it('データを取得する', async () => {
  const result = await fetchData()
  expect(result).toBe(data)
})

// ✅ Good: waitForを使う
it('データが表示される', async () => {
  render(<DataList />)
  await waitFor(() => {
    expect(screen.getByText('データ')).toBeInTheDocument()
  })
})
```

### 4. 過度なモックを避ける

```typescript
// ❌ Bad: すべてをモック
vi.mock('@/components/ui/button')
vi.mock('@/components/ui/input')
vi.mock('@/lib/utils')

// ✅ Good: 必要な部分だけモック
vi.mock('@/lib/api-client')
```

### 5. テストの順序に依存しない

```typescript
// ❌ Bad: テストの順序に依存
let userId: string

it('ユーザーを作成', async () => {
  const user = await createUser({ name: 'Test' })
  userId = user.id
})

it('ユーザーを削除', async () => {
  await deleteUser(userId) // 順序が変わると失敗
})

// ✅ Good: 独立したテスト
it('ユーザーを削除できる', async () => {
  const user = await createUser({ name: 'Test' })
  await deleteUser(user.id)
  const result = await getUser(user.id)
  expect(result).toBeNull()
})
```

### 6. console.logでのデバッグを残さない

```typescript
// ❌ Bad
it('テスト', () => {
  console.log('デバッグ中...') // 削除し忘れ
  expect(true).toBe(true)
})

// ✅ Good: デバッグ後は削除
it('テスト', () => {
  expect(true).toBe(true)
})
```

---

## チェックリスト

テストを書く際の確認事項：

- [ ] AAAパターンに従っているか
- [ ] テストは独立しているか
- [ ] ユーザー視点でテストしているか
- [ ] テスト名は明確か
- [ ] 適切なセレクタを使っているか（getByRole、getByLabelTextなど）
- [ ] 非同期処理を適切に扱っているか
- [ ] モックは必要最小限か
- [ ] テストデータはファクトリ関数で生成しているか
- [ ] 実装詳細に依存していないか
- [ ] エッジケースをテストしているか

---

## 参考リンク

- [テスト戦略](./01-testing-strategy.md)
- [ユニットテスト](./02-unit-testing.md)
- [E2Eテスト](./05-e2e-testing.md)
- [Testing Library - Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Martin Fowler - Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
