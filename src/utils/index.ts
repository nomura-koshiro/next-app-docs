/**
 * ユーティリティ関数のエントリーポイント
 */

// スタイル関連
export { cn } from './cn'

// 日付操作
export {
  formatDate,
  formatDateJa,
  formatDateTimeJa,
  formatRelativeTime,
  formatRelativeDate,
  parseDate,
  isValidDate,
  addDaysToDate,
  subtractDaysFromDate,
  addMonthsToDate,
  subtractMonthsFromDate,
  addYearsToDate,
  subtractYearsFromDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  isAfterDate,
  isBeforeDate,
  isEqualDate,
  isFutureDate,
  isPastDate,
  isTodayDate,
  isYesterdayDate,
  isTomorrowDate,
  getDifferenceInDays,
  getDifferenceInHours,
  getDifferenceInMinutes,
  generateDateRange,
} from './date'

// フォーマット
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatFileSize,
  formatPhoneNumber,
  formatPostalCode,
  formatCreditCard,
  truncate,
  chunk,
  unique,
  pluck,
  groupBy,
  sum,
  average,
  min,
  max,
} from './format'

// バリデーション
export {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidPostalCode,
  getPasswordStrength,
  isStrongPassword,
  isValidCreditCard,
  isInRange,
  isBlank,
  isEmpty,
  isEmptyArray,
  isNullOrUndefined,
  isHiragana,
  isKatakana,
  isNumericString,
  isAlphanumeric,
} from './validation'
