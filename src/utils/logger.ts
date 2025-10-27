/**
 * アプリケーション全体で使用するロギングユーティリティ
 *
 * 本番環境ではSentry等のエラートラッキングサービスと統合することを推奨
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * logger.error('Failed to fetch user', error, { userId: '123' });
 * logger.warn('Slow API response', { duration: 3000 });
 * logger.info('User logged in', { userId: '123' });
 * ```
 */

type LogContext = Record<string, unknown>;

/**
 * エラーログ出力
 *
 * 本番環境では外部サービス（Sentry等）に送信することを推奨
 */
const logError = (message: string, error?: Error | unknown, context?: LogContext): void => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Sentry等のエラートラッキングサービスに送信
    // Sentry.captureException(error, { contexts: { custom: context }, message });
    console.error(`[ERROR] ${message}`, error, context);
  } else {
    console.error(`[ERROR] ${message}`, error, context);
  }
};

/**
 * 警告ログ出力
 *
 * 本番環境では外部サービスに送信することを推奨
 */
const logWarn = (message: string, context?: LogContext): void => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 必要に応じて外部サービスに送信
    console.warn(`[WARN] ${message}`, context);
  } else {
    console.warn(`[WARN] ${message}`, context);
  }
};

/**
 * 情報ログ出力
 *
 * 開発環境のみ出力
 */
const logInfo = (message: string, context?: LogContext): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[INFO] ${message}`, context);
  }
};

/**
 * デバッグログ出力
 *
 * 開発環境のみ出力
 */
const logDebug = (message: string, context?: LogContext): void => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${message}`, context);
  }
};

/**
 * ロガーオブジェクト
 */
export const logger = {
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
};
