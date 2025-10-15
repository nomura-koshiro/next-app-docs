'use client';

import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ChatInput } from './components/chat-input';
import { ChatMessageList } from './components/chat-message-list';
import { useSampleChat } from './sample-chat.hook';

/**
 * チャットボットページコンポーネント
 *
 * ChatGPTのようなチャットインターフェースを提供します。
 */
export default function SampleChatPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { messages, inputMessage, isSending, handleSendMessage, handleInputChange } = useSampleChat();

  // ================================================================================
  // Render
  // ================================================================================
  return (
    <PageLayout maxWidth="4xl">
      <PageHeader title="チャットボット" description="ChatGPTのようなチャットインターフェースのサンプル実装（MSWでモック）" />

      <Card>
        <CardHeader>
          <CardTitle>チャット</CardTitle>
          <CardDescription>メッセージを入力して会話を開始してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* メッセージリスト */}
          <ChatMessageList messages={messages} isSending={isSending} />

          {/* 入力フォーム */}
          <ChatInput value={inputMessage} onChange={handleInputChange} onSubmit={handleSendMessage} isSending={isSending} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
