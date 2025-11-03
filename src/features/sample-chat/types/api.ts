/**
 * チャットAPI レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ
 *
 * @module features/sample-chat/types/api
 */

import { z } from "zod";

import { messageRoleSchema } from "./index";

/**
 * メッセージスキーマ（APIレスポンス用）
 *
 * APIレスポンスから返されるメッセージオブジェクトを検証
 * timestampは文字列として受け取り、Dateオブジェクトに変換
 */
export const messageOutputSchema = z.object({
  id: z.string().min(1, "メッセージIDは必須です"),
  role: messageRoleSchema,
  content: z.string().min(1, "メッセージ内容は必須です"),
  timestamp: z
    .string()
    .min(1, "タイムスタンプは必須です")
    .transform((val) => new Date(val)),
});

/**
 * メッセージ送信レスポンススキーマ
 *
 * POST /api/v1/sample/chat/messages のレスポンス
 */
export const sendMessageOutputSchema = z.object({
  message: messageOutputSchema,
  conversationId: z.string().min(1, "会話IDは必須です"),
});

/**
 * 型推論
 */
export type MessageOutput = z.infer<typeof messageOutputSchema>;
export type SendMessageOutput = z.infer<typeof sendMessageOutputSchema>;

// 後方互換性のため、types/index.ts から再エクスポート
export type { Message } from "./index";
