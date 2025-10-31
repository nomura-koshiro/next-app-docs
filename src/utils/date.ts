/**
 * 日付操作ユーティリティ
 * date-fnsを使用した日付のフォーマットと解析
 */

import { format, formatDistance, isValid, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * @example
 * formatDate(new Date()) // "2025/10/12"
 * formatDate(new Date(), 'yyyy年MM月dd日') // "2025年10月12日"
 * formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') // "2025-10-12 14:30:00"
 */
export const formatDate = (date: Date | string | number, formatString = "yyyy/MM/dd"): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);
  if (!isValid(parsedDate)) {
    return "無効な日付";
  }

  return format(parsedDate, formatString, { locale: ja });
};

/**
 * @example
 * formatDateJa(new Date()) // "2025年10月12日"
 */
export const formatDateJa = (date: Date | string | number): string => {
  return formatDate(date, "yyyy年MM月dd日");
};

/**
 * @example
 * formatRelativeTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // "3日前"
 * formatRelativeTime(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) // "2日後"
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);
  if (!isValid(parsedDate)) {
    return "無効な日付";
  }

  return formatDistance(parsedDate, new Date(), {
    addSuffix: true,
    locale: ja,
  });
};

/**
 * @example
 * parseDate('2025-10-12') // Date object
 * parseDate('invalid') // null
 */
export const parseDate = (dateString: string): Date | null => {
  const date = parseISO(dateString);

  return isValid(date) ? date : null;
};
