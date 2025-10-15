/**
 * メッセージの送信者ロール
 */
export type MessageRole = 'user' | 'assistant';

/**
 * チャットメッセージ
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
 * メッセージ送信リクエスト
 */
export type SendMessageRequest = {
  /** メッセージ内容 */
  message: string;
  /** 会話ID（オプション） */
  conversationId?: string;
};

/**
 * メッセージ送信レスポンス
 */
export type SendMessageResponse = {
  /** アシスタントからの返信メッセージ */
  message: Message;
  /** 会話ID */
  conversationId: string;
};
