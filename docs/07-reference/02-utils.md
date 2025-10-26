# ユーティリティ関数リファレンス

このドキュメントでは、プロジェクトで使用できるユーティリティ関数について説明します。日付操作とフォーマットなど、頻繁に使用する処理を簡潔に記述できる最小限の関数を提供しています。

## 目次

1. [概要](#概要)
2. [日付操作 (date.ts)](#日付操作-datets)
3. [フォーマット (format.ts)](#フォーマット-formatts)
4. [使用例](#使用例)

---

## 概要

ユーティリティ関数は `src/utils/` ディレクトリに配置されており、以下の2つのカテゴリに分類されています：

| カテゴリ | ファイル | 用途 |
|---------|---------|------|
| **日付操作** | `date.ts` | date-fnsを使用した日付のフォーマットと解析 |
| **フォーマット** | `format.ts` | 数値と通貨のフォーマット処理 |

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
