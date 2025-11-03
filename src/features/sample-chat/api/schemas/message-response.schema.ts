/**
 * チャットAPI レスポンススキーマ
 *
 * APIから返されるチャットメッセージデータのランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * メッセージロールスキーマ
 */
export const MessageRoleSchema = z.enum(["user", "assistant"]);

/**
 * メッセージスキーマ
 *
 * APIレスポンスから返されるメッセージオブジェクトを検証
 * timestampは文字列として受け取り、Dateオブジェクトに変換
 */
export const MessageSchema = z.object({
  id: z.string().min(1, "メッセージIDは必須です"),
  role: MessageRoleSchema,
  content: z.string().min(1, "メッセージ内容は必須です"),
  timestamp: z.string().min(1, "タイムスタンプは必須です").transform((val) => new Date(val)),
});

/**
 * メッセージ送信レスポンススキーマ
 *
 * POST /api/v1/sample/chat/messages のレスポンス
 */
export const SendMessageResponseSchema = z.object({
  message: MessageSchema,
  conversationId: z.string().min(1, "会話IDは必須です"),
});

/**
 * 型推論
 */
export type MessageResponse = z.infer<typeof MessageSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
