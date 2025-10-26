# ユニットテスト (Vitest)

関数、カスタムフック、ビジネスロジックのユニットテストについて説明します。Vitestを使用した高速で効率的なテストの実装方法を解説します。

## 目次

1. [Vitestとは](#vitestとは)
2. [セットアップ](#セットアップ)
3. [基本的なテスト](#基本的なテスト)
4. [カスタムフックのテスト](#カスタムフックのテスト)
5. [モックの活用](#モックの活用)
6. [非同期処理のテスト](#非同期処理のテスト)
7. [タイマーのテスト](#タイマーのテスト)
8. [テストコマンド](#テストコマンド)

---

## Vitestとは

**Vitest**は、Viteベースの高速なユニットテストフレームワークです。

### 特徴

- **高速**: Viteのトランスフォームを活用
- **ESM対応**: ネイティブESMサポート
- **TypeScript対応**: 追加設定不要
- **Jest互換**: Jestと同じAPIを使用可能
- **ウォッチモード**: 高速なHMR

### 対象となるテスト

- ユーティリティ関数
- カスタムフック
- ビジネスロジック
- バリデーション関数

---

## セットアップ

### インストール

```bash
# 依存関係インストール済み
pnpm test
```

### 設定ファイル

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### セットアップファイル

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup()
})
```

---

## 基本的なテスト

### ユーティリティ関数のテスト

```typescript
// utils/format-date.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('日付を正しくフォーマットする', () => {
    const date = new Date('2025-01-15')
    const result = formatDate(date)

    expect(result).toBe('2025年1月15日')
  })

  it('無効な日付の場合は空文字を返す', () => {
    const result = formatDate(null)

    expect(result).toBe('')
  })

  it('ISO形式の文字列を受け入れる', () => {
    const result = formatDate('2025-01-15T00:00:00Z')

    expect(result).toBe('2025年1月15日')
  })
})
```

### テストの構造 (AAA パターン)

```typescript
it('トレーニング名をフォーマットする', () => {
  // Arrange: テストの準備
  const input = 'bench press'

  // Act: 実行
  const result = formatTrainingName(input)

  // Assert: 検証
  expect(result).toBe('Bench Press')
})
```

### よく使うマッチャー

```typescript
describe('マッチャーの例', () => {
  it('等価性', () => {
    expect(1 + 1).toBe(2)                    // 厳密等価
    expect({ name: 'test' }).toEqual({ name: 'test' }) // オブジェクト比較
  })

  it('真偽値', () => {
    expect(true).toBeTruthy()
    expect(false).toBeFalsy()
    expect(null).toBeNull()
    expect(undefined).toBeUndefined()
  })

  it('数値', () => {
    expect(10).toBeGreaterThan(5)
    expect(10).toBeLessThan(20)
    expect(10).toBeGreaterThanOrEqual(10)
  })

  it('文字列', () => {
    expect('hello world').toContain('world')
    expect('test@example.com').toMatch(/^.+@.+\..+$/)
  })

  it('配列', () => {
    expect([1, 2, 3]).toContain(2)
    expect([1, 2, 3]).toHaveLength(3)
  })

  it('オブジェクト', () => {
    expect({ name: 'John', age: 30 }).toHaveProperty('name')
    expect({ name: 'John', age: 30 }).toMatchObject({ name: 'John' })
  })
})
```

---

## カスタムフックのテスト

### renderHookの使用

```typescript
// hooks/use-debounce.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  it('指定した時間後に値を更新する', async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    // まだ更新されない
    expect(result.current).toBe('initial')

    // 500ms経過
    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(result.current).toBe('updated')
    })

    vi.useRealTimers()
  })
})
```

### React Queryを使うフックのテスト

```typescript
// features/training/hooks/use-trainings.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useTrainings } from './use-trainings'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTrainings', () => {
  it('トレーニング一覧を取得する', async () => {
    const { result } = renderHook(() => useTrainings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([
      { id: '1', name: 'ベンチプレス' },
      { id: '2', name: 'スクワット' },
    ])
  })
})
```

---

## モックの活用

### 関数のモック

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('モックの例', () => {
  it('モック関数の呼び出しを検証', () => {
    const mockFn = vi.fn()

    mockFn('arg1', 'arg2')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('戻り値を設定', () => {
    const mockFn = vi.fn()
    mockFn.mockReturnValue('mocked value')

    expect(mockFn()).toBe('mocked value')
  })

  it('複数回の戻り値を設定', () => {
    const mockFn = vi.fn()
    mockFn
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default')

    expect(mockFn()).toBe('first')
    expect(mockFn()).toBe('second')
    expect(mockFn()).toBe('default')
  })
})
```

### モジュールのモック

```typescript
// features/training/hooks/use-training.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useTraining } from './use-training'

// API関数をモック
vi.mock('@/lib/api-client', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('useTraining', () => {
  it('トレーニングデータを取得する', async () => {
    const mockData = { id: '1', name: 'ベンチプレス' }

    // モックの返り値を設定
    vi.mocked(api.get).mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useTraining('1'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })
  })
})
```

### 部分的なモック

```typescript
// utils/date.test.ts
import { describe, it, expect, vi } from 'vitest'
import * as dateUtils from './date'

vi.spyOn(dateUtils, 'getCurrentDate').mockReturnValue(
  new Date('2025-01-15')
)

describe('date utils', () => {
  it('現在日時を使用する関数をテスト', () => {
    const result = dateUtils.formatCurrentDate()

    expect(result).toBe('2025年1月15日')
  })
})
```

---

## 非同期処理のテスト

### Promiseのテスト

```typescript
import { describe, it, expect } from 'vitest'

describe('非同期処理', () => {
  it('Promiseを返す関数', async () => {
    const result = await fetchData()

    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('エラーをthrowする', async () => {
    await expect(fetchInvalidData()).rejects.toThrow('Not Found')
  })

  it('resolves/rejectsマッチャー', async () => {
    await expect(fetchData()).resolves.toEqual({ id: 1, name: 'Test' })
    await expect(fetchInvalidData()).rejects.toThrow()
  })
})
```

### waitForの使用

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('waitForの例', () => {
  it('状態が変わるまで待機', async () => {
    const { result } = renderHook(() => useAsyncData())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeDefined()
  })

  it('タイムアウト設定', async () => {
    const { result } = renderHook(() => useSlowData())

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 5000 }
    )
  })
})
```

---

## タイマーのテスト

### フェイクタイマーの使用

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('タイマーのテスト', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('setTimeoutの動作', () => {
    const callback = vi.fn()

    setTimeout(callback, 1000)

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('setIntervalの動作', () => {
    const callback = vi.fn()

    setInterval(callback, 100)

    vi.advanceTimersByTime(350)

    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('すべてのタイマーを実行', () => {
    const callback = vi.fn()

    setTimeout(callback, 1000)
    setTimeout(callback, 2000)

    vi.runAllTimers()

    expect(callback).toHaveBeenCalledTimes(2)
  })
})
```

### デバウンスのテスト

```typescript
import { describe, it, expect, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  it('連続呼び出しは最後の1回のみ実行', () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const debouncedFn = debounce(callback, 500)

    debouncedFn('call 1')
    debouncedFn('call 2')
    debouncedFn('call 3')

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('call 3')

    vi.useRealTimers()
  })
})
```

---

## テストコマンド

### 基本コマンド

```bash
# すべてのテスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# 特定のファイルのみ実行
pnpm test format-date.test.ts

# パターンマッチング
pnpm test hooks
```

### カバレッジ

```bash
# カバレッジレポート生成
pnpm test:coverage

# カバレッジをブラウザで確認
open coverage/index.html
```

### UIモード

```bash
# UIモードで起動
pnpm test:ui
```

### オプション

```bash
# レポーター指定
pnpm test --reporter=verbose

# 並列実行を無効化
pnpm test --no-threads

# タイムアウト設定
pnpm test --test-timeout=10000
```

---

## ベストプラクティス

### 1. テストは独立させる

```typescript
// ❌ Bad: テスト間で状態を共有
let training: Training

it('トレーニングを作成', () => {
  training = createTraining({ name: 'ベンチプレス' })
})

it('トレーニングを更新', () => {
  updateTraining(training.id, { weight: 90 })  // trainingに依存
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

### 2. 明確なテスト名

```typescript
// ❌ Bad: 曖昧
it('works', () => {})
it('test1', () => {})

// ✅ Good: 具体的
it('日付を正しくフォーマットする', () => {})
it('無効な入力の場合はエラーをthrowする', () => {})
```

### 3. AAA パターンを使用

```typescript
it('トレーニングを作成する', () => {
  // Arrange: テストの準備
  const newTraining = { name: 'ベンチプレス', weight: 80 }

  // Act: 実行
  const result = createTraining(newTraining)

  // Assert: 検証
  expect(result).toEqual({ id: '1', ...newTraining })
})
```

### 4. 実装詳細ではなく動作をテスト

```typescript
// ❌ Bad: 実装詳細をテスト
it('useState が正しく動作する', () => {
  const { result } = renderHook(() => useState(0))
  expect(result.current[0]).toBe(0)
})

// ✅ Good: 動作をテスト
it('初期値が0である', () => {
  const { result } = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)
})
```

---

## 参考リンク

- [テスト戦略](./01-testing-strategy.md)
- [コンポーネントテスト](./03-component-testing.md)
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
