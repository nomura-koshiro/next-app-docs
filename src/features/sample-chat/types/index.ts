/**
 * チャット機能の型定義
 *
 * @module features/sample-chat/types
 */

import { z } from "zod";

/**
 * メッセージの送信者ロールスキーマ
 *
 * - user: ユーザーからのメッセージ
 * - assistant: AIアシスタントからのメッセージ
 */
export const messageRoleSchema = z.enum(["user", "assistant"]);

/**
 * メッセージの送信者ロール型
 *
 * @example
 * ```typescript
 * const userRole: MessageRole = 'user'
 * const assistantRole: MessageRole = 'assistant'
 * ```
 */
export type MessageRole = z.infer<typeof messageRoleSchema>;

/**
 * チャットメッセージスキーマ
 *
 * @property id - メッセージの一意識別子
 * @property role - 送信者ロール（ユーザーまたはアシスタント）
 * @property content - メッセージの本文
 * @property timestamp - メッセージの送信日時
 */
export const messageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string().min(1, "メッセージは必須です"),
  timestamp: z.date(),
});

/**
 * チャットメッセージを表す型
 *
 * @example
 * ```typescript
 * const message: Message = {
 *   id: '123',
 *   role: 'user',
 *   content: 'こんにちは',
 *   timestamp: new Date()
 * }
 * ```
 */
export type Message = z.infer<typeof messageSchema>;

/**
 * メッセージ送信入力スキーマ
 *
 * @property message - 送信するメッセージ内容
 * @property conversationId - 会話ID（省略可能、継続会話の場合に使用）
 */
export const sendMessageSchema = z.object({
  message: z.string().min(1, "メッセージは必須です"),
  conversationId: z.string().optional(),
});

/**
 * メッセージ送信入力型
 *
 * @example
 * ```typescript
 * const input: SendMessageInput = {
 *   message: 'TypeScriptについて教えてください',
 *   conversationId: 'conv-123'
 * }
 * const result = sendMessageSchema.safeParse(input)
 * ```
 */
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

/**
 * メッセージ送信出力型
 *
 * @property message - アシスタントからの返信メッセージ
 * @property conversationId - 会話ID（継続会話に使用）
 *
 * @example
 * ```typescript
 * const output: SendMessageOutput = {
 *   message: {
 *     id: '124',
 *     role: 'assistant',
 *     content: 'TypeScriptは...',
 *     timestamp: new Date()
 *   },
 *   conversationId: 'conv-123'
 * }
 * ```
 */
export type SendMessageOutput = {
  message: Message;
  conversationId: string;
};
