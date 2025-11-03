/**
 * チャット機能のZodスキーマ定義
 *
 * @module features/sample-chat/schemas
 */

import { z } from "zod";

// ================================================================================
// 基本スキーマ
// ================================================================================

/**
 * メッセージロールのスキーマ
 */
export const messageRoleSchema = z.enum(["user", "assistant"]);

export type MessageRole = z.infer<typeof messageRoleSchema>;

/**
 * メッセージのスキーマ
 */
export const messageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  timestamp: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

// ================================================================================
// Input スキーマ
// ================================================================================

/**
 * メッセージ送信の入力スキーマ
 */
export const sendMessageInputSchema = z.object({
  message: z.string().min(1, "メッセージを入力してください"),
  conversationId: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;

// ================================================================================
// レスポンススキーマ
// ================================================================================

/**
 * メッセージ送信レスポンスのスキーマ
 */
export const sendMessageDetailSchema = z.object({
  message: messageSchema,
  conversationId: z.string(),
});

export type SendMessageDetail = z.infer<typeof sendMessageDetailSchema>;
