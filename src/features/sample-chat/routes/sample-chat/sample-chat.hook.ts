'use client';

import { useCallback, useState } from 'react';

import { useSendMessage } from '../../api';
import type { Message } from '../../types';

/**
 * チャット機能のカスタムフック
 */
export const useSampleChat = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const sendMessageMutation = useSendMessage();

  // ================================================================================
  // State
  // ================================================================================
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  // ================================================================================
  // Handlers
  // ================================================================================

  /**
   * メッセージ送信ハンドラー
   */
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) {
      return;
    }

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      // アシスタントの返信を取得
      const response = await sendMessageMutation.mutateAsync({
        message: userMessage.content,
        conversationId,
      });

      // 会話IDを保存
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // アシスタントメッセージを追加
      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      console.error('Failed to send message:', error);

      // エラーメッセージを表示
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'エラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [inputMessage, sendMessageMutation, conversationId]);

  /**
   * 入力変更ハンドラー
   */
  const handleInputChange = useCallback((value: string) => {
    setInputMessage(value);
  }, []);

  // ================================================================================
  // Return
  // ================================================================================
  return {
    messages,
    inputMessage,
    isSending: sendMessageMutation.isPending,
    handleSendMessage,
    handleInputChange,
  };
};
