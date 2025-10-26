/**
 * フォーマットユーティリティ
 * 数値と通貨のフォーマット処理
 */

/**
 * 数値を3桁区切りでフォーマット
 * @param value - フォーマットする数値
 * @returns フォーマットされた文字列
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ja-JP');
};

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
  }).format(value);
};
