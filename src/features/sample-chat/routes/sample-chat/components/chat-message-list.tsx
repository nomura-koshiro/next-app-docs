import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

import type { Message } from '../../../types';
import { ChatMessage } from './chat-message';

type ChatMessageListProps = {
  /** メッセージリスト */
  messages: Message[];
  /** 送信中かどうか */
  isSending: boolean;
};

/**
 * チャットメッセージリスト
 *
 * メッセージ履歴を表示し、自動スクロールを管理します。
 */
export const ChatMessageList = ({ messages, isSending }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 新しいメッセージが追加されたら最下部にスクロール
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  return (
    <div className="flex h-[500px] flex-col gap-4 overflow-y-auto rounded-lg border bg-gray-50 p-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500">
          <p>メッセージを送信して会話を開始してください</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* 送信中のローディング表示 */}
          {isSending && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                <Loader2 className="size-5 animate-spin" />
              </div>
              <div className="flex items-center">
                <div className="rounded-2xl bg-gray-200 px-4 py-2">
                  <p className="text-sm text-gray-600">回答を生成しています...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
