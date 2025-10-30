/**
 * チャット機能の型定義
 *
 * @module features/sample-chat/types
 */

/**
 * メッセージの送信者ロール
 *
 * - user: ユーザーからのメッセージ
 * - assistant: AIアシスタントからのメッセージ
 *
 * @example
 * ```typescript
 * const userRole: MessageRole = 'user'
 * const assistantRole: MessageRole = 'assistant'
 * ```
 */
export type MessageRole = 'user' | 'assistant';

/**
 * チャットメッセージを表す型
 *
 * @property id - メッセージの一意識別子
 * @property role - 送信者ロール（ユーザーまたはアシスタント）
 * @property content - メッセージの本文
 * @property timestamp - メッセージの送信日時
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
export type Message = {
  /** メッセージID */
  id: string;
  /** 送信者ロール */
  role: MessageRole;
  /** メッセージ内容 */
  content: string;
  /** 送信日時 */
  timestamp: Date;
};

/**
 * メッセージ送信リクエストを表す型
 *
 * @property message - 送信するメッセージ内容
 * @property conversationId - 会話ID（省略可能、継続会話の場合に使用）
 *
 * @example
 * ```typescript
 * const request: SendMessageRequest = {
 *   message: 'TypeScriptについて教えてください',
 *   conversationId: 'conv-123'
 * }
 * ```
 */
export type SendMessageRequest = {
  /** メッセージ内容 */
  message: string;
  /** 会話ID（オプション） */
  conversationId?: string;
};

/**
 * メッセージ送信レスポンスを表す型
 *
 * @property message - アシスタントからの返信メッセージ
 * @property conversationId - 会話ID（継続会話に使用）
 *
 * @example
 * ```typescript
 * const response: SendMessageResponse = {
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
export type SendMessageResponse = {
  /** アシスタントからの返信メッセージ */
  message: Message;
  /** 会話ID */
  conversationId: string;
};
