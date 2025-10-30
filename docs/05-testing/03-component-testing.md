# コンポーネントテスト

React Testing Libraryを使用したUIコンポーネントのテスト方法について説明します。ユーザー視点でのテスト、クエリの選択方法、アクセシビリティを重視したテストアプローチを解説します。

## 目次

1. [React Testing Libraryとは](#react-testing-libraryとは)
2. [基本的なコンポーネントテスト](#基本的なコンポーネントテスト)
3. [クエリの優先順位](#クエリの優先順位)
4. [クエリの種類](#クエリの種類)
5. [ユーザーイベントのシミュレーション](#ユーザーイベントのシミュレーション)
6. [非同期処理の待機](#非同期処理の待機)
7. [フォームコンポーネントのテスト](#フォームコンポーネントのテスト)
8. [カスタムレンダラー](#カスタムレンダラー)
9. [アクセシビリティテスト](#アクセシビリティテスト)

---

## React Testing Libraryとは

**React Testing Library**は、ユーザーの視点でコンポーネントをテストするためのライブラリです。

### 哲学

> The more your tests resemble the way your software is used, the more confidence they can give you.

「テストがソフトウェアの使用方法に似ているほど、より高い信頼性が得られる」

### 特徴

| 特徴 | 説明 |
|------|------|
| **ユーザー中心** | 実装詳細ではなくユーザー体験をテスト |
| **アクセシビリティ重視** | セマンティックHTMLとARIA属性を推奨 |
| **シンプルなAPI** | 学習コストが低い |
| **Vitest/Jest統合** | 主要なテストフレームワークと連携 |

### テストの原則

```typescript
// ❌ Bad: 実装詳細をテスト
expect(component.state.count).toBe(1)
expect(wrapper.find('.button').props().onClick).toBeDefined()

// ✅ Good: ユーザー視点でテスト
expect(screen.getByText('1')).toBeInTheDocument()
fireEvent.click(screen.getByRole('button', { name: 'Increment' }))
```

---

## 基本的なコンポーネントテスト

### シンプルなコンポーネント

```typescript
// components/sample-ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('子要素を表示する', () => {
    render(<Button>クリック</Button>)

    expect(screen.getByText('クリック')).toBeInTheDocument()
  })

  it('ボタンとしてレンダリングされる', () => {
    render(<Button>クリック</Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('disabled属性が適用される', () => {
    render(<Button disabled>クリック</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Props のバリエーション

```typescript
// components/sample-ui/button.test.tsx
describe('Button variants', () => {
  it('primary バリアントを表示', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    const button = container.querySelector('button')

    expect(button).toHaveClass('bg-blue-600')
  })

  it('secondary バリアントを表示', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')

    expect(button).toHaveClass('bg-gray-200')
  })

  it('destructive バリアントを表示', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const button = container.querySelector('button')

    expect(button).toHaveClass('bg-red-600')
  })
})
```

### イベントハンドラーのテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

describe('Button events', () => {
  it('クリックイベントを発火する', () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>クリック</Button>)
    fireEvent.click(screen.getByText('クリック'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabledの場合はクリックできない', () => {
    const handleClick = vi.fn()

    render(
      <Button onClick={handleClick} disabled>
        クリック
      </Button>
    )
    fireEvent.click(screen.getByText('クリック'))

    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

---

## クエリの優先順位

React Testing Libraryは、**ユーザーがUIを操作する方法に近い順**でクエリを推奨しています。

### 優先順位リスト

1. **getByRole** ⭐ 最優先
2. **getByLabelText** (フォーム要素)
3. **getByPlaceholderText**
4. **getByText**
5. **getByDisplayValue**
6. **getByAltText** (画像)
7. **getByTitle**
8. **getByTestId** ⚠️ 最後の手段

### なぜこの順序か？

- **アクセシビリティ重視**: スクリーンリーダーが使う情報を優先
- **実装詳細から独立**: class名やデータ属性に依存しない
- **リファクタリング耐性**: UIの見た目が変わっても壊れにくい

### 実例で比較

```typescript
// ⭐ 1. getByRole (最優先)
screen.getByRole('button', { name: '保存' })
screen.getByRole('heading', { name: 'ユーザー登録' })
screen.getByRole('textbox', { name: 'メールアドレス' })

// ⭐ 2. getByLabelText (フォーム要素)
screen.getByLabelText('パスワード')
screen.getByLabelText('利用規約に同意する')

// ⭐ 3. getByPlaceholderText
screen.getByPlaceholderText('名前を入力してください')

// ⭐ 4. getByText
screen.getByText('ログイン')
screen.getByText(/ようこそ/i)

// ⚠️ 8. getByTestId (最後の手段)
screen.getByTestId('user-profile')
```

### getByRole の強力さ

```typescript
// アクセシビリティとテストを同時に改善
describe('LoginForm', () => {
  it('すべてのフォーム要素がアクセシブル', () => {
    render(<LoginForm />)

    // ロールと名前で取得 = スクリーンリーダー対応
    expect(screen.getByRole('textbox', { name: 'メールアドレス' })).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })
})
```

### getByTestId はいつ使うか

```typescript
// ✅ Good: 動的コンテンツや複雑なUI
screen.getByTestId('user-avatar-123')
screen.getByTestId('chart-container')

// ❌ Bad: 簡単にロールやテキストで取得できる場合
screen.getByTestId('submit-button')  // ✅ screen.getByRole('button', { name: '送信' })
screen.getByTestId('error-message')   // ✅ screen.getByText(/エラー/)
```

---

## クエリの種類

### 1. クエリのバリアント

| バリアント | 要素なし | 要素1つ | 要素複数 | 非同期 |
|-----------|---------|---------|---------|--------|
| **getBy** | エラー | 要素 | エラー | ❌ |
| **queryBy** | null | 要素 | エラー | ❌ |
| **findBy** | エラー | 要素 | エラー | ✅ |
| **getAllBy** | エラー | 配列 | 配列 | ❌ |
| **queryAllBy** | [] | 配列 | 配列 | ❌ |
| **findAllBy** | エラー | 配列 | 配列 | ✅ |

### 2. 使い分けの例

```typescript
// getBy: 要素が存在することを確認
expect(screen.getByText('ログイン')).toBeInTheDocument()

// queryBy: 要素が存在しないことを確認
expect(screen.queryByText('エラー')).not.toBeInTheDocument()

// findBy: 非同期に要素が表示されるのを待つ
const message = await screen.findByText('保存しました')

// getAllBy: 複数の要素を取得
const buttons = screen.getAllByRole('button')
expect(buttons).toHaveLength(3)

// queryAllBy: 要素が存在しない可能性がある場合
const errors = screen.queryAllByRole('alert')
expect(errors).toHaveLength(0)

// findAllBy: 非同期に複数の要素が表示される
const items = await screen.findAllByRole('listitem')
expect(items).toHaveLength(5)
```

### 3. クエリの組み合わせ

```typescript
// Role + Name
screen.getByRole('button', { name: '保存' })
screen.getByRole('heading', { name: /ユーザー/ })

// LabelText (フォーム)
screen.getByLabelText('メールアドレス')
screen.getByLabelText(/パスワード/i)

// Text (正規表現可)
screen.getByText('ようこそ')
screen.getByText(/ログイン成功/i)

// PlaceholderText
screen.getByPlaceholderText('検索...')

// AltText (画像)
screen.getByAltText('ユーザーアバター')

// TestId (最終手段)
screen.getByTestId('complex-component-123')
```

---

## ユーザーイベントのシミュレーション

### fireEvent vs userEvent

| 項目 | fireEvent | userEvent |
|------|-----------|-----------|
| **現実性** | 低い (単一イベント) | 高い (実際のユーザー操作) |
| **非同期** | 同期 | 非同期 |
| **推奨度** | 非推奨 | 推奨 ⭐ |

### userEvent の使用 (推奨)

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

describe('LoginForm with userEvent', () => {
  it('フォーム入力と送信', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    render(<LoginForm onSubmit={handleSubmit} />)

    // テキスト入力 (keydown, keypress, keyup, changeなど全て発火)
    await user.type(
      screen.getByLabelText('メールアドレス'),
      'user@example.com'
    )

    await user.type(
      screen.getByLabelText('パスワード'),
      'password123'
    )

    // ボタンクリック (focus, mousedown, mouseup, clickなど発火)
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    })
  })
})
```

### userEvent の主要メソッド

```typescript
const user = userEvent.setup()

// クリック
await user.click(element)
await user.dblClick(element)

// テキスト入力
await user.type(element, 'Hello')
await user.clear(element)

// キーボード操作
await user.keyboard('{Enter}')
await user.keyboard('{Shift>}A{/Shift}')  // Shift+A

// セレクトボックス
await user.selectOptions(screen.getByRole('combobox'), 'option1')

// チェックボックス/ラジオボタン
await user.check(screen.getByRole('checkbox'))
await user.uncheck(screen.getByRole('checkbox'))

// アップロード
await user.upload(input, file)

// ホバー
await user.hover(element)
await user.unhover(element)

// タブキー
await user.tab()
await user.tab({ shift: true })  // Shift+Tab
```

### fireEvent (レガシー)

```typescript
// 古い方法 (非推奨だが、一部のケースでは有用)
import { fireEvent } from '@testing-library/react'

fireEvent.click(button)
fireEvent.change(input, { target: { value: 'text' } })
fireEvent.submit(form)
```

---

## 非同期処理の待機

### waitFor

```typescript
import { render, screen, waitFor } from '@testing-library/react'

it('非同期データを表示', async () => {
  render(<UserProfile userId="123" />)

  // データ取得完了まで待機
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### findBy クエリ (推奨)

```typescript
// waitFor + getBy の代わりに findBy を使用
it('非同期データを表示', async () => {
  render(<UserProfile userId="123" />)

  // より簡潔
  expect(await screen.findByText('John Doe')).toBeInTheDocument()
})
```

### waitForElementToBeRemoved

```typescript
it('ローディング表示が消える', async () => {
  render(<DataList />)

  const loading = screen.getByText('読み込み中...')

  // 要素が削除されるまで待機
  await waitForElementToBeRemoved(loading)

  expect(screen.getByText('データ一覧')).toBeInTheDocument()
})
```

### act() 警告の対処

```typescript
// ❌ Bad: act() 警告が出る
it('カウンターをインクリメント', () => {
  render(<Counter />)
  fireEvent.click(screen.getByText('+'))
  // Warning: An update to Counter inside a test was not wrapped in act(...)
})

// ✅ Good: userEvent で自動的に act() でラップされる
it('カウンターをインクリメント', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  await user.click(screen.getByText('+'))

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

---

## フォームコンポーネントのテスト

### React Hook Form との統合

```typescript
// features/auth/components/login-form.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('有効なデータで送信', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(
      screen.getByLabelText('メールアドレス'),
      'user@example.com'
    )
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    })
  })

  it('バリデーションエラーを表示', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    // 空のまま送信
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    // エラーメッセージが表示される
    expect(await screen.findByText('メールアドレスは必須です')).toBeInTheDocument()
    expect(await screen.findByText('パスワードは必須です')).toBeInTheDocument()
  })

  it('無効なメールアドレスでエラー', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('メールアドレス'), 'invalid-email')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(
      await screen.findByText('正しいメールアドレスを入力してください')
    ).toBeInTheDocument()
  })
})
```

### フォームのリセット

```typescript
it('リセットボタンでフォームをクリア', async () => {
  const user = userEvent.setup()

  render(<TrainingForm />)

  const nameInput = screen.getByLabelText('トレーニング名')
  await user.type(nameInput, 'ベンチプレス')

  await user.click(screen.getByRole('button', { name: 'リセット' }))

  expect(nameInput).toHaveValue('')
})
```

### 複雑なフォーム

```typescript
it('複数セットを追加', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()

  render(<TrainingForm onSubmit={handleSubmit} />)

  await user.type(screen.getByLabelText('トレーニング名'), 'ベンチプレス')

  // セット1
  await user.type(screen.getByLabelText('重量 (セット1)'), '80')
  await user.type(screen.getByLabelText('レップ数 (セット1)'), '10')

  // セット追加
  await user.click(screen.getByRole('button', { name: 'セット追加' }))

  // セット2
  await user.type(screen.getByLabelText('重量 (セット2)'), '85')
  await user.type(screen.getByLabelText('レップ数 (セット2)'), '8')

  await user.click(screen.getByRole('button', { name: '保存' }))

  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'ベンチプレス',
    sets: [
      { weight: 80, reps: 10 },
      { weight: 85, reps: 8 },
    ],
  })
})
```

---

## カスタムレンダラー

### React Query との統合

```typescript
// tests/utils/render.tsx
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
}

export const render = (
  ui: ReactElement,
  { queryClient, ...options }: CustomRenderOptions = {}
) => {
  const testQueryClient = queryClient ?? createTestQueryClient()

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
    queryClient: testQueryClient,
  }
}
```

### AppProvider との統合

```typescript
// tests/utils/render.tsx
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { AppProvider } from '@/app/provider'
import { ReactElement } from 'react'

export const render = (ui: ReactElement, options?: RenderOptions) => {
  return rtlRender(ui, {
    wrapper: AppProvider,
    ...options,
  })
}

// 再エクスポート
export * from '@testing-library/react'
```

### カスタムレンダラーの使用

```typescript
// features/training/components/__tests__/training-list.test.tsx
import { render, screen } from '@/tests/utils/render'  // カスタムレンダラー
import { TrainingList } from '../training-list'

describe('TrainingList', () => {
  it('トレーニング一覧を表示', async () => {
    render(<TrainingList />)

    // React Queryが自動的に利用可能
    expect(await screen.findByText('ベンチプレス')).toBeInTheDocument()
  })
})
```

---

## アクセシビリティテスト

### jest-axe との統合

```bash
pnpm add -D jest-axe
```

```typescript
// tests/setup.ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(matchers)
expect.extend(toHaveNoViolations)

afterEach(() => {
  cleanup()
})
```

### アクセシビリティテスト

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from './button'

expect.extend(toHaveNoViolations)

describe('Button accessibility', () => {
  it('アクセシビリティ違反がない', async () => {
    const { container } = render(<Button>クリック</Button>)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('フォーカス可能', () => {
    render(<Button>クリック</Button>)
    const button = screen.getByRole('button')

    button.focus()
    expect(button).toHaveFocus()
  })

  it('キーボードで操作可能', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>クリック</Button>)

    const button = screen.getByRole('button')
    button.focus()

    // Enterキー
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()

    // Spaceキー
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })
})
```

### ARIA属性のテスト

```typescript
describe('Dialog accessibility', () => {
  it('正しいARIA属性を持つ', () => {
    render(
      <Dialog open onClose={vi.fn()}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>削除してもよろしいですか?</DialogContent>
      </Dialog>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
  })

  it('フォーカストラップが動作', async () => {
    const user = userEvent.setup()

    render(
      <Dialog open onClose={vi.fn()}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          <Button>キャンセル</Button>
          <Button>OK</Button>
        </DialogContent>
      </Dialog>
    )

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    const okButton = screen.getByRole('button', { name: 'OK' })

    // 最初のボタンにフォーカス
    expect(cancelButton).toHaveFocus()

    // Tab で次へ
    await user.tab()
    expect(okButton).toHaveFocus()

    // Tabで最初に戻る (フォーカストラップ)
    await user.tab()
    expect(cancelButton).toHaveFocus()
  })
})
```

---

## ベストプラクティス

### 1. ユーザー視点でテストを書く

```typescript
// ❌ Bad: 実装詳細に依存
expect(wrapper.find('.error-message').exists()).toBe(true)
expect(component.state.isLoading).toBe(false)

// ✅ Good: ユーザーが見るものをテスト
expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument()
```

### 2. getByRole を優先的に使う

```typescript
// ✅ Good: アクセシビリティとテストを同時に改善
screen.getByRole('button', { name: '保存' })
screen.getByRole('heading', { name: 'ユーザー登録' })
screen.getByRole('textbox', { name: 'メールアドレス' })
```

### 3. userEvent を使う (fireEvent ではなく)

```typescript
// ✅ Good: 実際のユーザー操作に近い
const user = userEvent.setup()
await user.type(input, 'Hello')
await user.click(button)
```

### 4. findBy で非同期を扱う

```typescript
// ✅ Good: シンプルで読みやすい
expect(await screen.findByText('保存しました')).toBeInTheDocument()
```

### 5. カスタムレンダラーでDRY原則

```typescript
// tests/utils/render.tsx
export const render = (ui: ReactElement) => {
  return rtlRender(ui, { wrapper: AppProvider })
}

// テストファイル
import { render } from '@/tests/utils/render'
```

### 6. AAA (Arrange-Act-Assert) パターン

```typescript
it('トレーニングを削除', async () => {
  // Arrange: 準備
  const user = userEvent.setup()
  const handleDelete = vi.fn()
  render(<TrainingCard onDelete={handleDelete} />)

  // Act: 実行
  await user.click(screen.getByRole('button', { name: '削除' }))

  // Assert: 検証
  expect(handleDelete).toHaveBeenCalledTimes(1)
})
```

### 7. テストは独立させる

```typescript
// ❌ Bad: テスト間で状態を共有
let user: User

beforeEach(() => {
  user = createUser()
})

// ✅ Good: 各テストで初期化
it('ユーザーを作成', () => {
  const user = createUser()
  expect(user).toBeDefined()
})
```

---

## コマンド一覧

### テスト実行

```bash
# すべてのテスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジ
pnpm test:coverage

# UI モード
pnpm test:ui

# 特定のファイルのみ
pnpm test button.test.tsx

# 特定のパターン
pnpm test --grep "LoginForm"
```

---

## 参考リンク

- [テスト戦略](./01-testing-strategy.md)
- [Storybookインタラクションテスト](./04-storybook-interaction.md)
- [MSW](../04-development/07-msw.md)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library - Queries](https://testing-library.com/docs/queries/about)
- [User Event](https://testing-library.com/docs/user-event/intro)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
