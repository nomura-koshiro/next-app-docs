# Storybookインタラクションテスト

Storybookのplay関数を使用したインタラクションテストについて説明します。コンポーネントの状態遷移、ユーザー操作のシミュレーション、視覚的なテスト方法を解説します。

## 目次

1. [Storybookインタラクションテストとは](#storybookインタラクションテストとは)
2. [なぜStorybookでテストするのか](#なぜstorybookでテストするのか)
3. [play関数の基本](#play関数の基本)
4. [@storybook/testの使い方](#storybooktestの使い方)
5. [インタラクションのステップ定義](#インタラクションのステップ定義)
6. [非同期インタラクション](#非同期インタラクション)
7. [エラーケースのテスト](#エラーケースのテスト)
8. [MSWとの統合](#mswとの統合)
9. [test-runnerでの自動実行](#test-runnerでの自動実行)
10. [アクセシビリティチェック](#アクセシビリティチェック)

---

## Storybookインタラクションテストとは

**Storybookインタラクションテスト**は、Storybook上でユーザー操作をシミュレートし、コンポーネントの動作を検証する手法です。

### 特徴

| 特徴 | 説明 |
|------|------|
| **視覚的フィードバック** | ブラウザでインタラクションを確認できる |
| **デバッグ容易** | ステップごとに動作を追跡可能 |
| **ドキュメント化** | テストがそのままコンポーネントの使い方になる |
| **test-runner対応** | CI/CDで自動実行可能 |

### 従来のテストとの違い

```typescript
// 従来のテスト (Vitest)
it('ボタンをクリックするとカウントが増える', async () => {
  const { getByText } = render(<Counter />)
  await userEvent.click(getByText('+'))
  expect(getByText('1')).toBeInTheDocument()
})

// Storybookインタラクションテスト
export const Increment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('+'))
    await expect(canvas.getByText('1')).toBeInTheDocument()
  },
}
```

---

## なぜStorybookでテストするのか

### 1. 視覚的な確認

```typescript
// ブラウザで実際の動作を確認しながらテスト
export const LoginFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 各ステップを視覚的に確認できる
    await userEvent.type(canvas.getByLabelText('メールアドレス'), 'user@example.com')
    await userEvent.type(canvas.getByLabelText('パスワード'), 'password123')
    await userEvent.click(canvas.getByRole('button', { name: 'ログイン' }))

    // 成功メッセージが表示される様子を確認
    await expect(canvas.getByText('ログインしました')).toBeInTheDocument()
  },
}
```

### 2. ドキュメントとテストの一体化

```typescript
// Story = ドキュメント + テスト
export const FormValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 「このフォームはこう使う」という使用例
    await userEvent.click(canvas.getByRole('button', { name: '保存' }))

    // 「空で送信するとエラーが出る」という仕様
    await expect(canvas.getByText('名前は必須です')).toBeInTheDocument()
  },
}
```

### 3. デザイナーとの共同作業

- デザイナーがStorybook上でコンポーネントの動作を確認
- インタラクションテストで期待される動作を明示
- ビジュアルレグレッションテストとの統合

### 4. CI/CDでの自動実行

```bash
# test-runnerでStorybookのテストを自動実行
pnpm test-storybook
```

---

## play関数の基本

### 最小構成

```typescript
// components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const ClickTest: Story = {
  args: {
    children: 'クリック',
  },
  play: async ({ canvasElement }) => {
    // 1. canvasを取得
    const canvas = within(canvasElement)

    // 2. 要素を取得
    const button = canvas.getByRole('button')

    // 3. インタラクション
    await userEvent.click(button)

    // 4. アサーション
    await expect(button).toBeInTheDocument()
  },
}
```

### play関数の引数

```typescript
export const Example: Story = {
  play: async (context) => {
    const {
      canvasElement,  // ストーリーのDOM要素
      args,           // Storyのargs
      step,           // ステップ定義用関数
      id,             // Story ID
    } = context

    const canvas = within(canvasElement)
    // ...
  },
}
```

---

## @storybook/testの使い方

### インポート

```typescript
import { expect, userEvent, within, waitFor } from '@storybook/test'
```

### 主要なAPI

| API | 説明 |
|-----|------|
| **within** | 特定のDOM要素内でクエリを実行 |
| **userEvent** | ユーザー操作をシミュレート |
| **expect** | アサーション |
| **waitFor** | 非同期待機 |
| **fn** | モック関数 (vi.fn() と同等) |

### within() を使ったスコープ指定

```typescript
export const NestedComponents: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 特定のセクション内で操作
    const modal = canvas.getByRole('dialog')
    const modalCanvas = within(modal)

    await userEvent.click(modalCanvas.getByRole('button', { name: 'OK' }))
  },
}
```

### userEvent の主要メソッド

```typescript
// クリック
await userEvent.click(button)
await userEvent.dblClick(button)

// テキスト入力
await userEvent.type(input, 'Hello')
await userEvent.clear(input)

// キーボード
await userEvent.keyboard('{Enter}')
await userEvent.keyboard('{Shift>}A{/Shift}')

// セレクト
await userEvent.selectOptions(select, 'option1')

// チェックボックス
await userEvent.click(checkbox)

// ホバー
await userEvent.hover(element)
await userEvent.unhover(element)

// タブ
await userEvent.tab()
```

### expect のアサーション

```typescript
// 存在確認
await expect(element).toBeInTheDocument()
await expect(element).not.toBeInTheDocument()

// テキスト
await expect(element).toHaveTextContent('Hello')

// 属性
await expect(element).toHaveAttribute('aria-label', 'Close')

// クラス
await expect(element).toHaveClass('active')

// 状態
await expect(button).toBeDisabled()
await expect(input).toHaveFocus()
await expect(input).toHaveValue('test')
```

---

## インタラクションのステップ定義

### step() による段階的テスト

```typescript
import { expect, userEvent, within } from '@storybook/test'

export const MultiStepForm: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('ステップ1: 基本情報入力', async () => {
      await userEvent.type(canvas.getByLabelText('名前'), '太郎')
      await userEvent.type(canvas.getByLabelText('メール'), 'taro@example.com')
      await userEvent.click(canvas.getByRole('button', { name: '次へ' }))
    })

    await step('ステップ2: 詳細情報入力', async () => {
      await userEvent.type(canvas.getByLabelText('電話番号'), '090-1234-5678')
      await userEvent.click(canvas.getByRole('button', { name: '次へ' }))
    })

    await step('ステップ3: 確認', async () => {
      await expect(canvas.getByText('太郎')).toBeInTheDocument()
      await expect(canvas.getByText('taro@example.com')).toBeInTheDocument()
      await userEvent.click(canvas.getByRole('button', { name: '送信' }))
    })

    await step('ステップ4: 完了メッセージ', async () => {
      await expect(canvas.getByText('登録が完了しました')).toBeInTheDocument()
    })
  },
}
```

### step() のメリット

- **視覚的な区切り**: Storybookのインタラクションパネルでステップごとに表示
- **デバッグ容易**: どのステップで失敗したかが明確
- **ドキュメント性向上**: ステップ名が仕様書になる

### 複雑なフォームテスト

```typescript
export const TrainingForm: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('トレーニング名を入力', async () => {
      await userEvent.type(
        canvas.getByLabelText('トレーニング名'),
        'ベンチプレス'
      )
    })

    await step('セット1を入力', async () => {
      await userEvent.type(canvas.getByLabelText('重量 (kg)'), '80')
      await userEvent.type(canvas.getByLabelText('レップ数'), '10')
      await userEvent.type(canvas.getByLabelText('RPE'), '8')
    })

    await step('セットを追加', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'セット追加' }))
    })

    await step('セット2を入力', async () => {
      const set2Inputs = canvas.getAllByLabelText(/重量/)
      await userEvent.type(set2Inputs[1], '85')
    })

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '保存' }))
    })

    await step('成功メッセージを確認', async () => {
      await expect(canvas.getByText('保存しました')).toBeInTheDocument()
    })
  },
}
```

---

## 非同期インタラクション

### waitFor の使用

```typescript
import { waitFor } from '@storybook/test'

export const AsyncDataLoad: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // ボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: '読み込み' }))

    // ローディング表示を確認
    await expect(canvas.getByText('読み込み中...')).toBeInTheDocument()

    // データが表示されるまで待機
    await waitFor(
      async () => {
        await expect(canvas.getByText('データ一覧')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  },
}
```

### delay の活用

```typescript
import { expect, userEvent, within } from '@storybook/test'

export const DebounceInput: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('検索文字を入力', async () => {
      await userEvent.type(canvas.getByPlaceholderText('検索...'), 'React')
    })

    await step('デバウンス後に検索結果を表示', async () => {
      // 500ms のデバウンス後に結果が表示される
      await waitFor(
        async () => {
          await expect(canvas.getByText('検索結果: 10件')).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  },
}
```

### API呼び出しのテスト

```typescript
export const UserProfile: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('ユーザーIDを入力', async () => {
      await userEvent.type(canvas.getByLabelText('ユーザーID'), '123')
      await userEvent.click(canvas.getByRole('button', { name: '検索' }))
    })

    await step('ローディング表示', async () => {
      await expect(canvas.getByText('読み込み中...')).toBeInTheDocument()
    })

    await step('ユーザー情報を表示', async () => {
      // MSWがモックデータを返す
      await waitFor(async () => {
        await expect(canvas.getByText('John Doe')).toBeInTheDocument()
        await expect(canvas.getByText('john@example.com')).toBeInTheDocument()
      })
    })
  },
}
```

---

## エラーケースのテスト

### バリデーションエラー

```typescript
export const ValidationError: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('空のまま送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '保存' }))
    })

    await step('バリデーションエラーを確認', async () => {
      await expect(canvas.getByText('名前は必須です')).toBeInTheDocument()
      await expect(canvas.getByText('メールアドレスは必須です')).toBeInTheDocument()
    })

    await step('エラー状態のスタイルを確認', async () => {
      const nameInput = canvas.getByLabelText('名前')
      await expect(nameInput).toHaveClass('border-red-500')
    })
  },
}
```

### APIエラー

```typescript
import { http, HttpResponse } from 'msw'

export const ApiError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/users', () => {
          return HttpResponse.json(
            { message: 'サーバーエラーが発生しました' },
            { status: 500 }
          )
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('フォーム送信', async () => {
      await userEvent.type(canvas.getByLabelText('名前'), '太郎')
      await userEvent.click(canvas.getByRole('button', { name: '保存' }))
    })

    await step('エラーメッセージを表示', async () => {
      await waitFor(async () => {
        await expect(
          canvas.getByText('サーバーエラーが発生しました')
        ).toBeInTheDocument()
      })
    })
  },
}
```

### 404エラー

```typescript
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users/:id', () => {
          return HttpResponse.json(
            { message: 'ユーザーが見つかりません' },
            { status: 404 }
          )
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(async () => {
      await expect(
        canvas.getByText('ユーザーが見つかりません')
      ).toBeInTheDocument()
    })
  },
}
```

---

## MSWとの統合

### グローバルハンドラーの使用

```typescript
// AppProviderを使用している場合、MSWが自動的に有効
// src/mocks/handlers.ts のハンドラーが使用される

export const UserList: Story = {
  // グローバルハンドラーが自動適用される
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(async () => {
      await expect(canvas.getByText('John Doe')).toBeInTheDocument()
    })
  },
}
```

### Story単位でハンドラーをオーバーライド

```typescript
import { http, HttpResponse } from 'msw'

export const EmptyList: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([])
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(async () => {
      await expect(canvas.getByText('ユーザーがいません')).toBeInTheDocument()
    })
  },
}

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async () => {
          await delay(3000)  // 3秒遅延
          return HttpResponse.json([/* データ */])
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // ローディング中
    await expect(canvas.getByText('読み込み中...')).toBeInTheDocument()
  },
}
```

### 複数のAPIパターン

```typescript
export const SuccessFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        // ユーザー一覧
        http.get('/api/users', () => {
          return HttpResponse.json([
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' },
          ])
        }),

        // ユーザー詳細
        http.get('/api/users/:id', ({ params }) => {
          return HttpResponse.json({
            id: params.id,
            name: 'John',
            email: 'john@example.com',
          })
        }),

        // ユーザー作成
        http.post('/api/users', async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json(
            { id: '3', ...body },
            { status: 201 }
          )
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('ユーザー一覧を表示', async () => {
      await expect(canvas.getByText('John')).toBeInTheDocument()
    })

    await step('ユーザーを作成', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '新規作成' }))
      await userEvent.type(canvas.getByLabelText('名前'), 'Bob')
      await userEvent.click(canvas.getByRole('button', { name: '保存' }))
    })

    await step('作成されたユーザーを確認', async () => {
      await expect(canvas.getByText('Bob')).toBeInTheDocument()
    })
  },
}
```

---

## test-runnerでの自動実行

### インストール

```bash
pnpm add -D @storybook/test-runner
```

### package.json に追加

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

### 実行

```bash
# Storybookを起動
pnpm storybook

# 別ターミナルでtest-runnerを実行
pnpm test-storybook
```

### CI/CDでの実行

```yaml
# .github/workflows/test.yml
name: Test

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: pnpm install

      - name: Build Storybook
        run: pnpm build-storybook

      - name: Run Storybook tests
        run: pnpm test-storybook
```

### test-runner の設定

```typescript
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner'

const config: TestRunnerConfig = {
  async preRender(page) {
    // テスト実行前の処理
    await page.emulateMediaType('screen')
  },
  async postRender(page, context) {
    // テスト実行後の処理
    const elementHandler = await page.$('#root')
    const innerHTML = await elementHandler?.innerHTML()
    expect(innerHTML).toBeTruthy()
  },
}

export default config
```

---

## アクセシビリティチェック

### a11y addon との統合

```bash
pnpm add -D @storybook/addon-a11y
```

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',  // 追加
  ],
}
```

### play関数でのアクセシビリティテスト

```typescript
import { injectAxe, checkA11y } from 'axe-playwright'

export const AccessibleForm: Story = {
  play: async ({ canvasElement }) => {
    // アクセシビリティチェック
    await injectAxe(canvasElement)
    await checkA11y(canvasElement)
  },
}
```

### キーボード操作のテスト

```typescript
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tabキーでフォーカス移動', async () => {
      await userEvent.tab()
      await expect(canvas.getByLabelText('名前')).toHaveFocus()

      await userEvent.tab()
      await expect(canvas.getByLabelText('メール')).toHaveFocus()

      await userEvent.tab()
      await expect(canvas.getByRole('button', { name: '保存' })).toHaveFocus()
    })

    await step('Enterキーで送信', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(canvas.getByText('保存しました')).toBeInTheDocument()
    })
  },
}
```

### フォーカストラップのテスト

```typescript
export const ModalFocusTrap: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('モーダルを開く', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'モーダルを開く' }))
    })

    await step('フォーカスがモーダル内に閉じ込められる', async () => {
      const modal = canvas.getByRole('dialog')
      const modalCanvas = within(modal)

      const closeButton = modalCanvas.getByRole('button', { name: '閉じる' })
      const cancelButton = modalCanvas.getByRole('button', { name: 'キャンセル' })
      const okButton = modalCanvas.getByRole('button', { name: 'OK' })

      // 最初のボタンにフォーカス
      await expect(closeButton).toHaveFocus()

      // Tab で次へ
      await userEvent.tab()
      await expect(cancelButton).toHaveFocus()

      await userEvent.tab()
      await expect(okButton).toHaveFocus()

      // 最後のボタンからTabで最初に戻る
      await userEvent.tab()
      await expect(closeButton).toHaveFocus()
    })
  },
}
```

### スクリーンリーダーテスト

```typescript
export const AriaLabels: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('適切なARIA属性を持つ', async () => {
      const dialog = canvas.getByRole('dialog')
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      await expect(dialog).toHaveAttribute('aria-labelledby')
      await expect(dialog).toHaveAttribute('aria-describedby')
    })

    await step('ロールによる要素取得', async () => {
      // スクリーンリーダーが認識する方法で取得できることを確認
      await expect(canvas.getByRole('heading', { name: '確認' })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'OK' })) .toBeInTheDocument()
    })
  },
}
```

---

## ベストプラクティス

### 1. step() でテストを構造化

```typescript
// ✅ Good: ステップごとに分割
export const ComplexFlow: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('入力', async () => { /* ... */ })
    await step('検証', async () => { /* ... */ })
    await step('送信', async () => { /* ... */ })
  },
}
```

### 2. within() でスコープを限定

```typescript
// ✅ Good: 特定の要素内でクエリを実行
const modal = canvas.getByRole('dialog')
const modalCanvas = within(modal)
await userEvent.click(modalCanvas.getByRole('button', { name: 'OK' }))
```

### 3. エラーケースも網羅

```typescript
export const ValidationError: Story = { /* ... */ }
export const ApiError: Story = { /* ... */ }
export const NetworkError: Story = { /* ... */ }
```

### 4. MSWでAPIをモック

```typescript
// ✅ Good: Story単位でAPIレスポンスを制御
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => HttpResponse.json([])),
      ],
    },
  },
}
```

### 5. test-runnerでCI/CD統合

```bash
# CI/CDで自動実行
pnpm build-storybook
pnpm test-storybook
```

### 6. アクセシビリティを確認

```typescript
// ✅ Good: キーボード操作のテスト
await userEvent.tab()
await userEvent.keyboard('{Enter}')
```

### 7. 待機には waitFor を使う

```typescript
// ✅ Good: 非同期処理の完了を待つ
await waitFor(async () => {
  await expect(canvas.getByText('完了')).toBeInTheDocument()
})
```

---

## userEvent vs fireEvent

### userEvent (推奨)

```typescript
// ✅ Good: 実際のユーザー操作に近い
await userEvent.click(button)
await userEvent.type(input, 'Hello')
```

**特徴:**

- 複数のイベントを順番に発火 (mousedown → mouseup → click)
- より現実的な操作
- 非同期処理

### fireEvent (レガシー)

```typescript
// ⚠️ Legacy: 単一イベントのみ発火
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'Hello' } })
```

**特徴:**

- 単一のイベントのみ発火
- 同期処理
- 特殊なケースでのみ使用

---

## コマンド一覧

### Storybook起動

```bash
# 開発サーバー
pnpm storybook

# 本番ビルド
pnpm build-storybook
```

### test-runner

```bash
# インタラクションテストを実行
pnpm test-storybook

# ヘッドレスモード
pnpm test-storybook --headless

# 特定のStoryのみ
pnpm test-storybook --stories="Button"

# ウォッチモード
pnpm test-storybook --watch
```

---

## 参考リンク

- [Storybook](../04-development/06-storybook.md)
- [コンポーネントテスト](./03-component-testing.md)
- [MSW](../04-development/07-msw.md)
- [テスト戦略](./01-testing-strategy.md)
- [Storybook Interaction Testing](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [Storybook Test Runner](https://storybook.js.org/docs/react/writing-tests/test-runner)
- [Storybook Addon A11y](https://storybook.js.org/addons/@storybook/addon-a11y)
- [Play function](https://storybook.js.org/docs/react/writing-stories/play-function)
