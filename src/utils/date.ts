/**
 * 日付操作ユーティリティ
 * date-fnsを使用した日付のフォーマット、計算、比較など
 */

import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  isValid,
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isAfter,
  isBefore,
  isEqual,
  isFuture,
  isPast,
  isToday,
  isYesterday,
  isTomorrow,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns'
import { ja } from 'date-fns/locale'

/**
 * 日付を指定されたフォーマットで文字列に変換
 * @param date - 変換する日付
 * @param formatString - フォーマット文字列（デフォルト: 'yyyy/MM/dd'）
 * @returns フォーマットされた日付文字列
 * @example
 * formatDate(new Date()) // "2025/10/12"
 * formatDate(new Date(), 'yyyy年MM月dd日') // "2025年10月12日"
 * formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') // "2025-10-12 14:30:00"
 */
export const formatDate = (
  date: Date | string | number,
  formatString = 'yyyy/MM/dd'
): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(parsedDate)) {
    return '無効な日付'
  }

  return format(parsedDate, formatString, { locale: ja })
}

/**
 * 日付を日本語形式でフォーマット
 * @param date - 変換する日付
 * @returns 日本語形式の日付文字列
 * @example
 * formatDateJa(new Date()) // "2025年10月12日"
 */
export const formatDateJa = (date: Date | string | number): string => {
  return formatDate(date, 'yyyy年MM月dd日')
}

/**
 * 日付と時刻を日本語形式でフォーマット
 * @param date - 変換する日付
 * @returns 日本語形式の日付時刻文字列
 * @example
 * formatDateTimeJa(new Date()) // "2025年10月12日 14:30"
 */
export const formatDateTimeJa = (date: Date | string | number): string => {
  return formatDate(date, 'yyyy年MM月dd日 HH:mm')
}

/**
 * 日付を相対的な時間で表示（例: "3日前"）
 * @param date - 比較する日付
 * @returns 相対的な時間文字列
 * @example
 * formatRelativeTime(subDays(new Date(), 3)) // "3日前"
 * formatRelativeTime(addDays(new Date(), 2)) // "2日後"
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(parsedDate)) {
    return '無効な日付'
  }

  return formatDistance(parsedDate, new Date(), { addSuffix: true, locale: ja })
}

/**
 * 日付を相対的な形式で表示（例: "今日の14:30"）
 * @param date - 変換する日付
 * @returns 相対的な日付文字列
 * @example
 * formatRelativeDate(new Date()) // "今日の14:30"
 */
export const formatRelativeDate = (date: Date | string | number): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(parsedDate)) {
    return '無効な日付'
  }

  return formatRelative(parsedDate, new Date(), { locale: ja })
}

/**
 * ISO形式の文字列を日付オブジェクトに変換
 * @param dateString - ISO形式の日付文字列
 * @returns 日付オブジェクト、無効な場合はnull
 * @example
 * parseDate('2025-10-12') // Date object
 * parseDate('invalid') // null
 */
export const parseDate = (dateString: string): Date | null => {
  const date = parseISO(dateString)

  return isValid(date) ? date : null
}

/**
 * 日付が有効かどうかを判定
 * @param date - 判定する日付
 * @returns 有効な日付の場合true
 * @example
 * isValidDate(new Date()) // true
 * isValidDate('invalid') // false
 */
export const isValidDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isValid(parsedDate)
}

/**
 * 日付に日数を追加
 * @param date - 基準日
 * @param amount - 追加する日数
 * @returns 新しい日付
 * @example
 * addDaysToDate(new Date(), 7) // 7日後
 */
export const addDaysToDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return addDays(parsedDate, amount)
}

/**
 * 日付から日数を減算
 * @param date - 基準日
 * @param amount - 減算する日数
 * @returns 新しい日付
 * @example
 * subtractDaysFromDate(new Date(), 7) // 7日前
 */
export const subtractDaysFromDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return subDays(parsedDate, amount)
}

/**
 * 日付に月数を追加
 * @param date - 基準日
 * @param amount - 追加する月数
 * @returns 新しい日付
 * @example
 * addMonthsToDate(new Date(), 3) // 3ヶ月後
 */
export const addMonthsToDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return addMonths(parsedDate, amount)
}

/**
 * 日付から月数を減算
 * @param date - 基準日
 * @param amount - 減算する月数
 * @returns 新しい日付
 * @example
 * subtractMonthsFromDate(new Date(), 3) // 3ヶ月前
 */
export const subtractMonthsFromDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return subMonths(parsedDate, amount)
}

/**
 * 日付に年数を追加
 * @param date - 基準日
 * @param amount - 追加する年数
 * @returns 新しい日付
 * @example
 * addYearsToDate(new Date(), 1) // 1年後
 */
export const addYearsToDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return addYears(parsedDate, amount)
}

/**
 * 日付から年数を減算
 * @param date - 基準日
 * @param amount - 減算する年数
 * @returns 新しい日付
 * @example
 * subtractYearsFromDate(new Date(), 1) // 1年前
 */
export const subtractYearsFromDate = (
  date: Date | string | number,
  amount: number
): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return subYears(parsedDate, amount)
}

/**
 * 日付の開始時刻を取得（00:00:00）
 * @param date - 基準日
 * @returns 日の開始時刻
 * @example
 * getStartOfDay(new Date()) // 今日の00:00:00
 */
export const getStartOfDay = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return startOfDay(parsedDate)
}

/**
 * 日付の終了時刻を取得（23:59:59.999）
 * @param date - 基準日
 * @returns 日の終了時刻
 * @example
 * getEndOfDay(new Date()) // 今日の23:59:59.999
 */
export const getEndOfDay = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return endOfDay(parsedDate)
}

/**
 * 月の最初の日を取得
 * @param date - 基準日
 * @returns 月の最初の日
 * @example
 * getStartOfMonth(new Date()) // 今月1日の00:00:00
 */
export const getStartOfMonth = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return startOfMonth(parsedDate)
}

/**
 * 月の最後の日を取得
 * @param date - 基準日
 * @returns 月の最後の日
 * @example
 * getEndOfMonth(new Date()) // 今月末日の23:59:59.999
 */
export const getEndOfMonth = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return endOfMonth(parsedDate)
}

/**
 * 年の最初の日を取得
 * @param date - 基準日
 * @returns 年の最初の日
 * @example
 * getStartOfYear(new Date()) // 今年1月1日の00:00:00
 */
export const getStartOfYear = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return startOfYear(parsedDate)
}

/**
 * 年の最後の日を取得
 * @param date - 基準日
 * @returns 年の最後の日
 * @example
 * getEndOfYear(new Date()) // 今年12月31日の23:59:59.999
 */
export const getEndOfYear = (date: Date | string | number): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return endOfYear(parsedDate)
}

/**
 * 日付が別の日付より後かどうかを判定
 * @param date - 比較する日付
 * @param dateToCompare - 比較対象の日付
 * @returns 後の場合true
 * @example
 * isAfterDate(new Date(), subDays(new Date(), 1)) // true
 */
export const isAfterDate = (
  date: Date | string | number,
  dateToCompare: Date | string | number
): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  const parsedCompare =
    typeof dateToCompare === 'string'
      ? parseISO(dateToCompare)
      : new Date(dateToCompare)

  return isAfter(parsedDate, parsedCompare)
}

/**
 * 日付が別の日付より前かどうかを判定
 * @param date - 比較する日付
 * @param dateToCompare - 比較対象の日付
 * @returns 前の場合true
 * @example
 * isBeforeDate(subDays(new Date(), 1), new Date()) // true
 */
export const isBeforeDate = (
  date: Date | string | number,
  dateToCompare: Date | string | number
): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  const parsedCompare =
    typeof dateToCompare === 'string'
      ? parseISO(dateToCompare)
      : new Date(dateToCompare)

  return isBefore(parsedDate, parsedCompare)
}

/**
 * 日付が別の日付と同じかどうかを判定
 * @param date - 比較する日付
 * @param dateToCompare - 比較対象の日付
 * @returns 同じ場合true
 * @example
 * isEqualDate(new Date(), new Date()) // true
 */
export const isEqualDate = (
  date: Date | string | number,
  dateToCompare: Date | string | number
): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)
  const parsedCompare =
    typeof dateToCompare === 'string'
      ? parseISO(dateToCompare)
      : new Date(dateToCompare)

  return isEqual(parsedDate, parsedCompare)
}

/**
 * 日付が未来かどうかを判定
 * @param date - 判定する日付
 * @returns 未来の場合true
 * @example
 * isFutureDate(addDays(new Date(), 1)) // true
 */
export const isFutureDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isFuture(parsedDate)
}

/**
 * 日付が過去かどうかを判定
 * @param date - 判定する日付
 * @returns 過去の場合true
 * @example
 * isPastDate(subDays(new Date(), 1)) // true
 */
export const isPastDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isPast(parsedDate)
}

/**
 * 日付が今日かどうかを判定
 * @param date - 判定する日付
 * @returns 今日の場合true
 * @example
 * isTodayDate(new Date()) // true
 */
export const isTodayDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isToday(parsedDate)
}

/**
 * 日付が昨日かどうかを判定
 * @param date - 判定する日付
 * @returns 昨日の場合true
 * @example
 * isYesterdayDate(subDays(new Date(), 1)) // true
 */
export const isYesterdayDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isYesterday(parsedDate)
}

/**
 * 日付が明日かどうかを判定
 * @param date - 判定する日付
 * @returns 明日の場合true
 * @example
 * isTomorrowDate(addDays(new Date(), 1)) // true
 */
export const isTomorrowDate = (date: Date | string | number): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date)

  return isTomorrow(parsedDate)
}

/**
 * 2つの日付の日数差を計算
 * @param dateLeft - 比較する日付1
 * @param dateRight - 比較する日付2
 * @returns 日数差
 * @example
 * getDifferenceInDays(addDays(new Date(), 7), new Date()) // 7
 */
export const getDifferenceInDays = (
  dateLeft: Date | string | number,
  dateRight: Date | string | number
): number => {
  const parsedLeft =
    typeof dateLeft === 'string' ? parseISO(dateLeft) : new Date(dateLeft)
  const parsedRight =
    typeof dateRight === 'string' ? parseISO(dateRight) : new Date(dateRight)

  return differenceInDays(parsedLeft, parsedRight)
}

/**
 * 2つの日付の時間差を計算
 * @param dateLeft - 比較する日付1
 * @param dateRight - 比較する日付2
 * @returns 時間差
 * @example
 * getDifferenceInHours(addHours(new Date(), 3), new Date()) // 3
 */
export const getDifferenceInHours = (
  dateLeft: Date | string | number,
  dateRight: Date | string | number
): number => {
  const parsedLeft =
    typeof dateLeft === 'string' ? parseISO(dateLeft) : new Date(dateLeft)
  const parsedRight =
    typeof dateRight === 'string' ? parseISO(dateRight) : new Date(dateRight)

  return differenceInHours(parsedLeft, parsedRight)
}

/**
 * 2つの日付の分差を計算
 * @param dateLeft - 比較する日付1
 * @param dateRight - 比較する日付2
 * @returns 分差
 * @example
 * getDifferenceInMinutes(addMinutes(new Date(), 30), new Date()) // 30
 */
export const getDifferenceInMinutes = (
  dateLeft: Date | string | number,
  dateRight: Date | string | number
): number => {
  const parsedLeft =
    typeof dateLeft === 'string' ? parseISO(dateLeft) : new Date(dateLeft)
  const parsedRight =
    typeof dateRight === 'string' ? parseISO(dateRight) : new Date(dateRight)

  return differenceInMinutes(parsedLeft, parsedRight)
}

/**
 * 日付範囲を生成
 * @param start - 開始日
 * @param end - 終了日
 * @returns 日付の配列
 * @example
 * generateDateRange(new Date(), addDays(new Date(), 7)) // [Date, Date, ...]
 */
export const generateDateRange = (
  start: Date | string | number,
  end: Date | string | number
): Date[] => {
  const startDate =
    typeof start === 'string' ? parseISO(start) : new Date(start)
  const endDate = typeof end === 'string' ? parseISO(end) : new Date(end)

  const dates: Date[] = []
  let currentDate = startDate

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  return dates
}
