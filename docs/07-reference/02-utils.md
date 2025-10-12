# ユーティリティ関数リファレンス

このドキュメントでは、プロジェクトで使用できるユーティリティ関数について説明します。日付操作、フォーマット、バリデーションなど、頻繁に使用する処理を簡潔に記述できる関数を提供しています。

## 目次

1. [概要](#概要)
2. [日付操作 (date.ts)](#日付操作-datets)
3. [フォーマット (format.ts)](#フォーマット-formatts)
4. [バリデーション (validation.ts)](#バリデーション-validationts)
5. [使用例](#使用例)

---

## 概要

ユーティリティ関数は `src/utils/` ディレクトリに配置されており、以下の3つのカテゴリに分類されています：

| カテゴリ | ファイル | 用途 |
|---------|---------|------|
| **日付操作** | `date.ts` | date-fnsを使用した日付のフォーマット、計算、比較 |
| **フォーマット** | `format.ts` | 数値、文字列、配列などのフォーマット処理 |
| **バリデーション** | `validation.ts` | 各種データ形式のバリデーション |

### インポート方法

```typescript
// 個別インポート
import { formatDate, formatCurrency, isValidEmail } from '@/utils'

// または、各ファイルから直接インポート
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/format'
import { isValidEmail } from '@/utils/validation'
```

---

## 日付操作 (date.ts)

date-fnsライブラリを使用した日付操作関数を提供します。

### フォーマット関数

#### formatDate

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

#### formatDateJa

日付を日本語形式でフォーマットします。

```typescript
formatDateJa(date: Date | string | number): string
```

**使用例:**

```typescript
formatDateJa(new Date())  // "2025年10月12日"
```

#### formatDateTimeJa

日付と時刻を日本語形式でフォーマットします。

```typescript
formatDateTimeJa(date: Date | string | number): string
```

**使用例:**

```typescript
formatDateTimeJa(new Date())  // "2025年10月12日 14:30"
```

#### formatRelativeTime

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

#### formatRelativeDate

日付を相対的な形式で表示します（例: "今日の14:30"）。

```typescript
formatRelativeDate(date: Date | string | number): string
```

**使用例:**

```typescript
formatRelativeDate(new Date())  // "今日の14:30"
```

### 日付計算関数

#### addDaysToDate / subtractDaysFromDate

日付に日数を追加/減算します。

```typescript
addDaysToDate(date: Date | string | number, amount: number): Date
subtractDaysFromDate(date: Date | string | number, amount: number): Date
```

**使用例:**

```typescript
import { addDaysToDate, subtractDaysFromDate } from '@/utils'

addDaysToDate(new Date(), 7)       // 7日後
subtractDaysFromDate(new Date(), 7) // 7日前
```

#### addMonthsToDate / subtractMonthsFromDate

日付に月数を追加/減算します。

```typescript
addMonthsToDate(date: Date | string | number, amount: number): Date
subtractMonthsFromDate(date: Date | string | number, amount: number): Date
```

**使用例:**

```typescript
import { addMonthsToDate, subtractMonthsFromDate } from '@/utils'

addMonthsToDate(new Date(), 3)       // 3ヶ月後
subtractMonthsFromDate(new Date(), 3) // 3ヶ月前
```

#### addYearsToDate / subtractYearsFromDate

日付に年数を追加/減算します。

```typescript
addYearsToDate(date: Date | string | number, amount: number): Date
subtractYearsFromDate(date: Date | string | number, amount: number): Date
```

**使用例:**

```typescript
import { addYearsToDate, subtractYearsFromDate } from '@/utils'

addYearsToDate(new Date(), 1)       // 1年後
subtractYearsFromDate(new Date(), 1) // 1年前
```

### 日付取得関数

#### getStartOfDay / getEndOfDay

日付の開始時刻（00:00:00）または終了時刻（23:59:59.999）を取得します。

```typescript
getStartOfDay(date: Date | string | number): Date
getEndOfDay(date: Date | string | number): Date
```

**使用例:**

```typescript
import { getStartOfDay, getEndOfDay } from '@/utils'

getStartOfDay(new Date())  // 今日の00:00:00
getEndOfDay(new Date())    // 今日の23:59:59.999
```

#### getStartOfMonth / getEndOfMonth

月の最初の日または最後の日を取得します。

```typescript
getStartOfMonth(date: Date | string | number): Date
getEndOfMonth(date: Date | string | number): Date
```

**使用例:**

```typescript
import { getStartOfMonth, getEndOfMonth } from '@/utils'

getStartOfMonth(new Date())  // 今月1日の00:00:00
getEndOfMonth(new Date())    // 今月末日の23:59:59.999
```

#### getStartOfYear / getEndOfYear

年の最初の日または最後の日を取得します。

```typescript
getStartOfYear(date: Date | string | number): Date
getEndOfYear(date: Date | string | number): Date
```

**使用例:**

```typescript
import { getStartOfYear, getEndOfYear } from '@/utils'

getStartOfYear(new Date())  // 今年1月1日の00:00:00
getEndOfYear(new Date())    // 今年12月31日の23:59:59.999
```

### 日付比較関数

#### isAfterDate / isBeforeDate / isEqualDate

日付を比較します。

```typescript
isAfterDate(date: Date | string | number, dateToCompare: Date | string | number): boolean
isBeforeDate(date: Date | string | number, dateToCompare: Date | string | number): boolean
isEqualDate(date: Date | string | number, dateToCompare: Date | string | number): boolean
```

**使用例:**

```typescript
import { isAfterDate, isBeforeDate, isEqualDate } from '@/utils'

const today = new Date()
const yesterday = new Date(Date.now() - 86400000)
const tomorrow = new Date(Date.now() + 86400000)

isAfterDate(tomorrow, today)    // true
isBeforeDate(yesterday, today)  // true
isEqualDate(today, today)       // true
```

#### isTodayDate / isYesterdayDate / isTomorrowDate

日付が今日、昨日、明日かどうかを判定します。

```typescript
isTodayDate(date: Date | string | number): boolean
isYesterdayDate(date: Date | string | number): boolean
isTomorrowDate(date: Date | string | number): boolean
```

**使用例:**

```typescript
import { isTodayDate, isYesterdayDate, isTomorrowDate } from '@/utils'

isTodayDate(new Date())                             // true
isYesterdayDate(new Date(Date.now() - 86400000))   // true
isTomorrowDate(new Date(Date.now() + 86400000))    // true
```

#### isFutureDate / isPastDate

日付が未来または過去かどうかを判定します。

```typescript
isFutureDate(date: Date | string | number): boolean
isPastDate(date: Date | string | number): boolean
```

**使用例:**

```typescript
import { isFutureDate, isPastDate } from '@/utils'

isFutureDate(new Date(Date.now() + 86400000))  // true
isPastDate(new Date(Date.now() - 86400000))    // true
```

### 日付差分計算関数

#### getDifferenceInDays / getDifferenceInHours / getDifferenceInMinutes

2つの日付の差分を計算します。

```typescript
getDifferenceInDays(dateLeft: Date | string | number, dateRight: Date | string | number): number
getDifferenceInHours(dateLeft: Date | string | number, dateRight: Date | string | number): number
getDifferenceInMinutes(dateLeft: Date | string | number, dateRight: Date | string | number): number
```

**使用例:**

```typescript
import { getDifferenceInDays, getDifferenceInHours } from '@/utils'

const start = new Date('2025-10-01')
const end = new Date('2025-10-12')

getDifferenceInDays(end, start)  // 11
getDifferenceInHours(end, start) // 264
```

### その他の日付関数

#### parseDate

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

#### isValidDate

日付が有効かどうかを判定します。

```typescript
isValidDate(date: Date | string | number): boolean
```

**使用例:**

```typescript
import { isValidDate } from '@/utils'

isValidDate(new Date())      // true
isValidDate('2025-10-12')   // true
isValidDate('invalid')       // false
```

#### generateDateRange

日付範囲を生成します。

```typescript
generateDateRange(start: Date | string | number, end: Date | string | number): Date[]
```

**使用例:**

```typescript
import { generateDateRange } from '@/utils'

const start = new Date('2025-10-01')
const end = new Date('2025-10-07')
const dates = generateDateRange(start, end)
// [Date(2025-10-01), Date(2025-10-02), ..., Date(2025-10-07)]
```

---

## フォーマット (format.ts)

数値、文字列、配列などのフォーマット処理を提供します。

### 数値フォーマット関数

#### formatNumber

数値を3桁区切りでフォーマットします。

```typescript
formatNumber(value: number): string
```

**使用例:**

```typescript
import { formatNumber } from '@/utils'

formatNumber(1234567)  // "1,234,567"
```

#### formatCurrency

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

#### formatPercent

パーセント形式でフォーマットします。

```typescript
formatPercent(value: number, decimals?: number): string
```

**使用例:**

```typescript
import { formatPercent } from '@/utils'

formatPercent(0.856)     // "86%"
formatPercent(0.856, 1)  // "85.6%"
formatPercent(0.856, 2)  // "85.60%"
```

#### formatFileSize

ファイルサイズをフォーマットします。

```typescript
formatFileSize(bytes: number, decimals?: number): string
```

**使用例:**

```typescript
import { formatFileSize } from '@/utils'

formatFileSize(1024)        // "1.00 KB"
formatFileSize(1048576)     // "1.00 MB"
formatFileSize(1234567890)  // "1.15 GB"
```

### 日本特有のフォーマット関数

#### formatPhoneNumber

電話番号を日本形式でフォーマットします。

```typescript
formatPhoneNumber(phoneNumber: string): string
```

**使用例:**

```typescript
import { formatPhoneNumber } from '@/utils'

formatPhoneNumber('09012345678')  // "090-1234-5678"
formatPhoneNumber('0312345678')   // "03-1234-5678"
```

#### formatPostalCode

郵便番号をフォーマットします。

```typescript
formatPostalCode(postalCode: string): string
```

**使用例:**

```typescript
import { formatPostalCode } from '@/utils'

formatPostalCode('1234567')  // "123-4567"
```

### セキュリティ関連フォーマット関数

#### formatCreditCard

クレジットカード番号をマスク付きでフォーマットします。

```typescript
formatCreditCard(cardNumber: string, maskDigits?: number): string
```

**使用例:**

```typescript
import { formatCreditCard } from '@/utils'

formatCreditCard('1234567890123456')      // "**** **** **** 3456"
formatCreditCard('1234567890123456', 8)   // "******** **** 3456"
```

### 文字列操作関数

#### truncate

文字列を指定された長さで切り詰めます。

```typescript
truncate(text: string, maxLength: number, suffix?: string): string
```

**使用例:**

```typescript
import { truncate } from '@/utils'

truncate('これは長いテキストです', 10)           // "これは長いテキス..."
truncate('これは長いテキストです', 10, '…')      // "これは長いテキス…"
```

### 配列操作関数

#### chunk

配列を指定されたサイズのチャンクに分割します。

```typescript
chunk<T>(array: T[], size: number): T[][]
```

**使用例:**

```typescript
import { chunk } from '@/utils'

chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
```

#### unique

配列から重複を除去します。

```typescript
unique<T>(array: T[]): T[]
```

**使用例:**

```typescript
import { unique } from '@/utils'

unique([1, 2, 2, 3, 3, 3])  // [1, 2, 3]
```

#### pluck

オブジェクトの配列から特定のプロパティ値の配列を取得します。

```typescript
pluck<T, K extends keyof T>(array: T[], key: K): T[K][]
```

**使用例:**

```typescript
import { pluck } from '@/utils'

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

pluck(users, 'name')  // ['Alice', 'Bob']
```

#### groupBy

オブジェクトの配列をグループ化します。

```typescript
groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]>
```

**使用例:**

```typescript
import { groupBy } from '@/utils'

const items = [
  { type: 'A', value: 1 },
  { type: 'B', value: 2 },
  { type: 'A', value: 3 },
]

groupBy(items, 'type')
// {
//   A: [{ type: 'A', value: 1 }, { type: 'A', value: 3 }],
//   B: [{ type: 'B', value: 2 }]
// }
```

### 数値計算関数

#### sum / average / min / max

配列の合計、平均、最小値、最大値を計算します。

```typescript
sum(array: number[]): number
average(array: number[]): number
min(array: number[]): number
max(array: number[]): number
```

**使用例:**

```typescript
import { sum, average, min, max } from '@/utils'

const numbers = [1, 2, 3, 4, 5]

sum(numbers)      // 15
average(numbers)  // 3
min(numbers)      // 1
max(numbers)      // 5
```

---

## バリデーション (validation.ts)

各種データ形式のバリデーション関数を提供します。

### 基本バリデーション関数

#### isValidEmail

メールアドレスの形式をチェックします。

```typescript
isValidEmail(email: string): boolean
```

**使用例:**

```typescript
import { isValidEmail } from '@/utils'

isValidEmail('test@example.com')  // true
isValidEmail('invalid-email')     // false
```

#### isValidUrl

URLの形式をチェックします。

```typescript
isValidUrl(url: string): boolean
```

**使用例:**

```typescript
import { isValidUrl } from '@/utils'

isValidUrl('https://example.com')  // true
isValidUrl('not-a-url')            // false
```

### 日本特有のバリデーション関数

#### isValidPhoneNumber

日本の電話番号の形式をチェックします。

```typescript
isValidPhoneNumber(phoneNumber: string): boolean
```

**使用例:**

```typescript
import { isValidPhoneNumber } from '@/utils'

isValidPhoneNumber('090-1234-5678')  // true
isValidPhoneNumber('09012345678')    // true
isValidPhoneNumber('invalid')        // false
```

#### isValidPostalCode

日本の郵便番号の形式をチェックします。

```typescript
isValidPostalCode(postalCode: string): boolean
```

**使用例:**

```typescript
import { isValidPostalCode } from '@/utils'

isValidPostalCode('123-4567')  // true
isValidPostalCode('1234567')   // true
isValidPostalCode('invalid')   // false
```

### パスワードバリデーション関数

#### getPasswordStrength

パスワードの強度をチェックします（0-4）。

```typescript
getPasswordStrength(password: string): number
```

**使用例:**

```typescript
import { getPasswordStrength } from '@/utils'

getPasswordStrength('abc')         // 0
getPasswordStrength('abc123')      // 1
getPasswordStrength('Abc123')      // 2
getPasswordStrength('Abc123!')     // 3
getPasswordStrength('Abc123!@#$')  // 4
```

#### isStrongPassword

パスワードの強度が十分かチェックします。

```typescript
isStrongPassword(password: string, minStrength?: number): boolean
```

**使用例:**

```typescript
import { isStrongPassword } from '@/utils'

isStrongPassword('Abc123!')   // true (強度2以上)
isStrongPassword('abc123')    // false
isStrongPassword('Abc123', 3) // false (強度3未満)
```

### セキュリティバリデーション関数

#### isValidCreditCard

クレジットカード番号をLuhnアルゴリズムでチェックします。

```typescript
isValidCreditCard(cardNumber: string): boolean
```

**使用例:**

```typescript
import { isValidCreditCard } from '@/utils'

isValidCreditCard('4532015112830366')  // true
isValidCreditCard('1234567890123456')  // false
```

### 数値バリデーション関数

#### isInRange

数値が範囲内かチェックします。

```typescript
isInRange(value: number, min: number, max: number): boolean
```

**使用例:**

```typescript
import { isInRange } from '@/utils'

isInRange(5, 1, 10)   // true
isInRange(15, 1, 10)  // false
```

#### isNumericString

数値文字列かチェックします。

```typescript
isNumericString(text: string): boolean
```

**使用例:**

```typescript
import { isNumericString } from '@/utils'

isNumericString('12345')   // true
isNumericString('123.45')  // true
isNumericString('abc')     // false
```

### 空チェック関数

#### isBlank

文字列が空白のみかチェックします。

```typescript
isBlank(text: string): boolean
```

**使用例:**

```typescript
import { isBlank } from '@/utils'

isBlank('   ')        // true
isBlank('  text  ')   // false
```

#### isEmpty

オブジェクトが空かチェックします。

```typescript
isEmpty(obj: object): boolean
```

**使用例:**

```typescript
import { isEmpty } from '@/utils'

isEmpty({})                  // true
isEmpty({ key: 'value' })    // false
```

#### isEmptyArray

配列が空かチェックします。

```typescript
isEmptyArray<T>(array: T[]): boolean
```

**使用例:**

```typescript
import { isEmptyArray } from '@/utils'

isEmptyArray([])         // true
isEmptyArray([1, 2, 3])  // false
```

#### isNullOrUndefined

値がnullまたはundefinedかチェックします。

```typescript
isNullOrUndefined(value: unknown): value is null | undefined
```

**使用例:**

```typescript
import { isNullOrUndefined } from '@/utils'

isNullOrUndefined(null)       // true
isNullOrUndefined(undefined)  // true
isNullOrUndefined(0)          // false
```

### 日本語バリデーション関数

#### isHiragana

ひらがなのみかチェックします。

```typescript
isHiragana(text: string): boolean
```

**使用例:**

```typescript
import { isHiragana } from '@/utils'

isHiragana('ひらがな')              // true
isHiragana('ひらがなカタカナ')      // false
```

#### isKatakana

カタカナのみかチェックします。

```typescript
isKatakana(text: string): boolean
```

**使用例:**

```typescript
import { isKatakana } from '@/utils'

isKatakana('カタカナ')              // true
isKatakana('カタカナひらがな')      // false
```

### 文字種バリデーション関数

#### isAlphanumeric

英数字のみかチェックします。

```typescript
isAlphanumeric(text: string): boolean
```

**使用例:**

```typescript
import { isAlphanumeric } from '@/utils'

isAlphanumeric('abc123')   // true
isAlphanumeric('abc-123')  // false
```

---

## 使用例

### ユーザープロフィール表示

```typescript
import { formatDate, formatPhoneNumber, truncate } from '@/utils'

interface User {
  name: string
  bio: string
  phoneNumber: string
  createdAt: string
}

export const UserProfile = ({ user }: { user: User }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{truncate(user.bio, 100)}</p>
      <p>電話: {formatPhoneNumber(user.phoneNumber)}</p>
      <p>登録日: {formatDate(user.createdAt, 'yyyy年MM月dd日')}</p>
    </div>
  )
}
```

### フォームバリデーション

```typescript
import { isValidEmail, isStrongPassword, isValidPhoneNumber } from '@/utils'
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().refine(isValidEmail, {
    message: '有効なメールアドレスを入力してください',
  }),
  password: z.string().refine(isStrongPassword, {
    message: 'パスワードが弱すぎます',
  }),
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message: '有効な電話番号を入力してください',
  }),
})
```

### データ集計

```typescript
import { groupBy, sum, average } from '@/utils'

interface Sale {
  category: string
  amount: number
}

const sales: Sale[] = [
  { category: 'A', amount: 100 },
  { category: 'B', amount: 200 },
  { category: 'A', amount: 150 },
]

// カテゴリごとにグループ化
const grouped = groupBy(sales, 'category')

// カテゴリAの合計
const categoryATotal = sum(grouped['A'].map((s) => s.amount))  // 250

// 全体の平均
const avg = average(sales.map((s) => s.amount))  // 150
```

### 日付範囲フィルタリング

```typescript
import {
  isAfterDate,
  isBeforeDate,
  getStartOfMonth,
  getEndOfMonth,
} from '@/utils'

const filterByMonth = (items: { date: string }[], targetDate: Date) => {
  const start = getStartOfMonth(targetDate)
  const end = getEndOfMonth(targetDate)

  return items.filter((item) => {
    const itemDate = new Date(item.date)
    return isAfterDate(itemDate, start) && isBeforeDate(itemDate, end)
  })
}
```

---

## 参考リンク

- [date-fns公式ドキュメント](https://date-fns.org/)
- [Intl.NumberFormat (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Intl.DateTimeFormat (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
