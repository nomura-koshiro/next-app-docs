/**
 * 日付操作ユーティリティ
 * date-fnsを使用した日付のフォーマットと解析
 */

import { format, formatDistance, isValid, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

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
export const formatDate = (date: Date | string | number, formatString = 'yyyy/MM/dd'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!isValid(parsedDate)) {
    return '無効な日付';
  }

  return format(parsedDate, formatString, { locale: ja });
};

/**
 * 日付を日本語形式でフォーマット
 * @param date - 変換する日付
 * @returns 日本語形式の日付文字列
 * @example
 * formatDateJa(new Date()) // "2025年10月12日"
 */
export const formatDateJa = (date: Date | string | number): string => {
  return formatDate(date, 'yyyy年MM月dd日');
};

/**
 * 日付を相対的な時間で表示（例: "3日前"）
 * @param date - 比較する日付
 * @returns 相対的な時間文字列
 * @example
 * formatRelativeTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // "3日前"
 * formatRelativeTime(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) // "2日後"
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!isValid(parsedDate)) {
    return '無効な日付';
  }

  return formatDistance(parsedDate, new Date(), {
    addSuffix: true,
    locale: ja,
  });
};

/**
 * ISO形式の文字列を日付オブジェクトに変換
 * @param dateString - ISO形式の日付文字列
 * @returns 日付オブジェクト、無効な場合はnull
 * @example
 * parseDate('2025-10-12') // Date object
 * parseDate('invalid') // null
 */
export const parseDate = (dateString: string): Date | null => {
  const date = parseISO(dateString);

  return isValid(date) ? date : null;
};
