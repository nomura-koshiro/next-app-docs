/**
 * フォーマットユーティリティ
 * 数値、文字列、配列などのフォーマット処理
 */

/**
 * 数値を3桁区切りでフォーマット
 * @param value - フォーマットする数値
 * @returns フォーマットされた文字列
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ja-JP')
}

/**
 * 通貨形式でフォーマット
 * @param value - フォーマットする金額
 * @param currency - 通貨コード（デフォルト: 'JPY'）
 * @returns フォーマットされた通貨文字列
 * @example
 * formatCurrency(1234567) // "¥1,234,567"
 * formatCurrency(1234.56, 'USD') // "$1,234.56"
 */
export const formatCurrency = (value: number, currency = 'JPY'): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * パーセント形式でフォーマット
 * @param value - フォーマットする値（0-1の範囲）
 * @param decimals - 小数点以下の桁数（デフォルト: 0）
 * @returns フォーマットされたパーセント文字列
 * @example
 * formatPercent(0.856) // "86%"
 * formatPercent(0.856, 1) // "85.6%"
 */
export const formatPercent = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * ファイルサイズをフォーマット
 * @param bytes - バイト数
 * @param decimals - 小数点以下の桁数（デフォルト: 2）
 * @returns フォーマットされたファイルサイズ文字列
 * @example
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 * formatFileSize(1234567890) // "1.15 GB"
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * 電話番号をフォーマット（日本形式）
 * @param phoneNumber - フォーマットする電話番号
 * @returns フォーマットされた電話番号文字列
 * @example
 * formatPhoneNumber('09012345678') // "090-1234-5678"
 * formatPhoneNumber('0312345678') // "03-1234-5678"
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '')

  // 携帯電話（11桁）
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  // 固定電話（10桁）
  if (cleaned.length === 10) {
    // 03, 06などの2桁市外局番
    if (cleaned.startsWith('03') || cleaned.startsWith('06')) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
    }

    // その他の3桁市外局番
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phoneNumber
}

/**
 * 郵便番号をフォーマット
 * @param postalCode - フォーマットする郵便番号
 * @returns フォーマットされた郵便番号文字列
 * @example
 * formatPostalCode('1234567') // "123-4567"
 */
export const formatPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/\D/g, '')

  if (cleaned.length === 7) {
    return cleaned.replace(/(\d{3})(\d{4})/, '$1-$2')
  }

  return postalCode
}

/**
 * クレジットカード番号をフォーマット（マスク付き）
 * @param cardNumber - フォーマットするカード番号
 * @param maskDigits - マスクする桁数（デフォルト: 12）
 * @returns フォーマットされたカード番号文字列
 * @example
 * formatCreditCard('1234567890123456') // "**** **** **** 3456"
 */
export const formatCreditCard = (
  cardNumber: string,
  maskDigits = 12
): string => {
  const cleaned = cardNumber.replace(/\D/g, '')

  if (cleaned.length !== 16) {
    return cardNumber
  }

  const masked =
    '*'.repeat(maskDigits) + cleaned.slice(maskDigits, cleaned.length)

  return masked.replace(/(\d{4})/g, '$1 ').trim()
}

/**
 * 文字列を指定された長さで切り詰める
 * @param text - 切り詰める文字列
 * @param maxLength - 最大長
 * @param suffix - 末尾に追加する文字列（デフォルト: '...'）
 * @returns 切り詰められた文字列
 * @example
 * truncate('これは長いテキストです', 10) // "これは長いテキス..."
 */
export const truncate = (
  text: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * 配列を指定されたサイズのチャンクに分割
 * @param array - 分割する配列
 * @param size - チャンクサイズ
 * @returns チャンク化された配列
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = []

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}

/**
 * 配列から重複を除去
 * @param array - 処理する配列
 * @returns 重複が除去された配列
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array))
}

/**
 * オブジェクトの配列から特定のプロパティ値の配列を取得
 * @param array - オブジェクトの配列
 * @param key - 取得するプロパティのキー
 * @returns プロパティ値の配列
 * @example
 * pluck([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], 'name') // ['A', 'B']
 */
export const pluck = <T, K extends keyof T>(array: T[], key: K): T[K][] => {
  return array.map((item) => item[key])
}

/**
 * オブジェクトの配列をグループ化
 * @param array - オブジェクトの配列
 * @param key - グループ化のキー
 * @returns グループ化されたオブジェクト
 * @example
 * groupBy([{ type: 'A', value: 1 }, { type: 'B', value: 2 }, { type: 'A', value: 3 }], 'type')
 * // { A: [{ type: 'A', value: 1 }, { type: 'A', value: 3 }], B: [{ type: 'B', value: 2 }] }
 */
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])
      if (result[groupKey] === undefined) {
        result[groupKey] = []
      }
      result[groupKey].push(item)

      return result
    },
    {} as Record<string, T[]>
  )
}

/**
 * 配列の合計を計算
 * @param array - 数値の配列
 * @returns 合計値
 * @example
 * sum([1, 2, 3, 4, 5]) // 15
 */
export const sum = (array: number[]): number => {
  return array.reduce((acc, value) => acc + value, 0)
}

/**
 * 配列の平均を計算
 * @param array - 数値の配列
 * @returns 平均値
 * @example
 * average([1, 2, 3, 4, 5]) // 3
 */
export const average = (array: number[]): number => {
  if (array.length === 0) return 0

  return sum(array) / array.length
}

/**
 * 配列の最小値を取得
 * @param array - 数値の配列
 * @returns 最小値
 * @example
 * min([5, 2, 8, 1, 9]) // 1
 */
export const min = (array: number[]): number => {
  return Math.min(...array)
}

/**
 * 配列の最大値を取得
 * @param array - 数値の配列
 * @returns 最大値
 * @example
 * max([5, 2, 8, 1, 9]) // 9
 */
export const max = (array: number[]): number => {
  return Math.max(...array)
}
