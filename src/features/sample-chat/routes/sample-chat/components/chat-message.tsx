import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

import type { Message } from '../../../types';

type ChatMessageProps = {
  /** メッセージデータ */
  message: Message;
};

/**
 * チャットメッセージバブル
 *
 * ユーザーとアシスタントのメッセージを適切なスタイルで表示します。
 */
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* アイコン */}
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
        {isUser ? <User className="size-5" /> : <Bot className="size-5" />}
      </div>

      {/* メッセージ内容 */}
      <div className={`flex max-w-[70%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-2 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500">{format(message.timestamp, 'HH:mm')}</span>
      </div>
    </div>
  );
};
