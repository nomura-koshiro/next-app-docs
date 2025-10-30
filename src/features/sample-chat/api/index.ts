/**
 * チャットAPI統合エクスポート
 *
 * @module features/sample-chat/api
 *
 * @description
 * チャット機能のAPI関数とフックを提供。
 * メッセージ送信などのチャット操作を含む。
 *
 * @example
 * ```typescript
 * import { useSendMessage } from '@/features/sample-chat/api'
 *
 * // メッセージ送信
 * const { mutate: sendMessage } = useSendMessage()
 * sendMessage({ message: 'こんにちは' })
 * ```
 */

// ================================================================================
// Chat API Exports
// ================================================================================

export * from './send-message';
