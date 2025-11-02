/**
 * チャット機能の型定義
 *
 * @module features/sample-chat/types
 */

// ================================================================================
// Zodスキーマのエクスポート
// ================================================================================

/**
 * Zodスキーマをエクスポート
 *
 * バリデーションが必要な場合は、これらのスキーマを使用してください。
 */
export type { Message, MessageRole, SendMessageDetail, SendMessageInput } from "../schemas";
export { messageRoleSchema, messageSchema, sendMessageDetailSchema, sendMessageInputSchema } from "../schemas";
