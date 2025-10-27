# ユーティリティ関数リファレンス

このドキュメントでは、プロジェクトで使用できるユーティリティ関数について説明します。日付操作とフォーマットなど、頻繁に使用する処理を簡潔に記述できる最小限の関数を提供しています。

## 目次

1. [概要](#概要)
2. [日付操作 (date.ts)](#日付操作-datets)
3. [フォーマット (format.ts)](#フォーマット-formatts)
4. [エラーハンドリング (error-handling.ts)](#エラーハンドリング-error-handlingts)
5. [ロギング (logger.ts)](#ロギング-loggerts)
6. [スタイル (cn.ts)](#スタイル-cnts)
7. [使用例](#使用例)

---

## 概要

ユーティリティ関数は `src/utils/` ディレクトリに配置されており、以下のカテゴリに分類されています：

| カテゴリ | ファイル | 用途 |
|---------|---------|------|
| **日付操作** | `date.ts` | date-fnsを使用した日付のフォーマットと解析 |
| **フォーマット** | `format.ts` | 数値と通貨のフォーマット処理 |
| **エラーハンドリング** | `error-handling.ts` | 型安全なエラーハンドリングとAxiosエラー処理 |
| **ロギング** | `logger.ts` | 構造化ログ出力（開発/本番環境対応） |
| **スタイル** | `cn.ts` | clsx + tailwind-merge によるクラス名結合 |

### インポート方法

```typescript
// 個別インポート
import { formatDate, formatCurrency } from '@/utils'

// または、各ファイルから直接インポート
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/format'
```

---

## 日付操作 (date.ts)

date-fnsライブラリを使用した日付操作関数を提供します。

### formatDate

日付を指定されたフォーマットで文字列に変換します。

```typescript
formatDate(date: Date | string | number, formatString?: string): string
```

**使用例:**

```typescript
import { formatDate } from '@/utils'

formatDate(new Date())                          // "2025/10/12"
formatDate(new Date(), 'yyyy年MM月dd日')        // "2025年10月12日"
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')  // "2025-10-12 14:30:00"
formatDate('2025-10-12')                       // "2025/10/12"
```

### formatDateJa

日付を日本語形式でフォーマットします。

```typescript
formatDateJa(date: Date | string | number): string
```

**使用例:**

```typescript
import { formatDateJa } from '@/utils'

formatDateJa(new Date())  // "2025年10月12日"
```

### formatRelativeTime

日付を相対的な時間で表示します（例: "3日前"）。

```typescript
formatRelativeTime(date: Date | string | number): string
```

**使用例:**

```typescript
import { formatRelativeTime } from '@/utils'

formatRelativeTime(new Date())                      // "0秒前"
formatRelativeTime(new Date(Date.now() - 86400000)) // "1日前"
formatRelativeTime(new Date(Date.now() + 86400000)) // "1日後"
```

### parseDate

ISO形式の文字列を日付オブジェクトに変換します。

```typescript
parseDate(dateString: string): Date | null
```

**使用例:**

```typescript
import { parseDate } from '@/utils'

parseDate('2025-10-12')  // Date object
parseDate('invalid')     // null
```

---

## フォーマット (format.ts)

数値と通貨のフォーマット処理を提供します。

### formatNumber

数値を3桁区切りでフォーマットします。

```typescript
formatNumber(value: number): string
```

**使用例:**

```typescript
import { formatNumber } from '@/utils'

formatNumber(1234567)  // "1,234,567"
```

### formatCurrency

通貨形式でフォーマットします。

```typescript
formatCurrency(value: number, currency?: string): string
```

**使用例:**

```typescript
import { formatCurrency } from '@/utils'

formatCurrency(1234567)         // "¥1,234,567"
formatCurrency(1234.56, 'USD')  // "$1,234.56"
```

---

## エラーハンドリング (error-handling.ts)

型安全なエラーハンドリングとAxiosエラー処理を提供します。

### handleAsync

非同期処理の結果を型安全にハンドリングします（Go言語スタイル）。

```typescript
handleAsync<T>(promise: Promise<T>): Promise<AsyncResult<T>>
```

**使用例:**

```typescript
import { handleAsync } from '@/utils'

const [data, error] = await handleAsync(fetchUser(userId))

if (error) {
  console.error('Failed to fetch user:', error)
  return
}

// dataは型安全に使用可能
console.log(data.name)
```

### getErrorMessage

Axiosエラーからユーザーフレンドリーなエラーメッセージを抽出します。

```typescript
getErrorMessage(error: unknown): string
```

**使用例:**

```typescript
import { getErrorMessage } from '@/utils'

try {
  await api.post('/users', data)
} catch (error) {
  const message = getErrorMessage(error)
  alert(message)
}
```

### isAxiosError

エラーがAxiosエラーかどうかを判定する型ガードです。

```typescript
isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse>
```

**使用例:**

```typescript
import { isAxiosError } from '@/utils'

if (isAxiosError(error)) {
  console.log('Status:', error.response?.status)
}
```

### isHttpError

エラーが特定のHTTPステータスコードかどうかを判定します。

```typescript
isHttpError(error: unknown, status: number | number[]): boolean
```

**使用例:**

```typescript
import { isHttpError } from '@/utils'

if (isHttpError(error, 404)) {
  console.log('Not found')
}

if (isHttpError(error, [401, 403])) {
  console.log('Unauthorized or Forbidden')
}
```

---

## ロギング (logger.ts)

構造化ログ出力を提供します。開発環境と本番環境で動作を切り替え、将来的にSentry等のエラートラッキングサービスとの統合を想定しています。

### logger.error

エラーログを出力します（本番環境では外部サービスへの送信を推奨）。

```typescript
logger.error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void
```

**使用例:**

```typescript
import { logger } from '@/utils'

logger.error('Failed to fetch user', error, { userId: '123' })
```

### logger.warn

警告ログを出力します。

```typescript
logger.warn(message: string, context?: Record<string, unknown>): void
```

**使用例:**

```typescript
import { logger } from '@/utils'

logger.warn('Slow API response', { duration: 3000 })
```

### logger.info

情報ログを出力します（開発環境のみ）。

```typescript
logger.info(message: string, context?: Record<string, unknown>): void
```

**使用例:**

```typescript
import { logger } from '@/utils'

logger.info('User logged in', { userId: '123' })
```

### logger.debug

デバッグログを出力します（開発環境のみ）。

```typescript
logger.debug(message: string, context?: Record<string, unknown>): void
```

**使用例:**

```typescript
import { logger } from '@/utils'

logger.debug('API request details', { url: '/api/users', method: 'GET' })
```

---

## スタイル (cn.ts)

clsxとtailwind-mergeを組み合わせた、Tailwind CSSクラス名の結合と競合解決を行うユーティリティです。

### cn

条件付きクラス名の結合と、Tailwindクラスの競合を自動で解決します。

```typescript
cn(...inputs: ClassValue[]): string
```

**使用例:**

```typescript
import { cn } from '@/utils'

// 基本的な使用
cn('text-red-500', 'font-bold') // "text-red-500 font-bold"

// 条件付きクラス
cn('base-class', isActive && 'active-class') // "base-class active-class" or "base-class"

// Tailwindの競合を自動解決
cn('px-2 py-1', 'px-4') // "py-1 px-4" (px-2が上書きされる)

// コンポーネントでの使用
const Button = ({ className, ...props }) => (
  <button
    className={cn('bg-blue-500 hover:bg-blue-600 px-4 py-2', className)}
    {...props}
  />
)
```

---

## 使用例

### ユーザープロフィール表示

```typescript
import { formatDate } from '@/utils'

type User = {
  name: string
  createdAt: string
}

export const UserProfile = ({ user }: { user: User }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>登録日: {formatDate(user.createdAt, 'yyyy年MM月dd日')}</p>
    </div>
  )
}
```

### 金額表示

```typescript
import { formatCurrency } from '@/utils'

type Product = {
  name: string
  price: number
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>価格: {formatCurrency(product.price)}</p>
    </div>
  )
}
```

### 相対時間表示

```typescript
import { formatRelativeTime } from '@/utils'

type Post = {
  title: string
  createdAt: string
}

export const PostItem = ({ post }: { post: Post }) => {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{formatRelativeTime(post.createdAt)}</p>
    </div>
  )
}
```

---

## 参考リンク

- [date-fns公式ドキュメント](https://date-fns.org/)
- [Intl.NumberFormat (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
