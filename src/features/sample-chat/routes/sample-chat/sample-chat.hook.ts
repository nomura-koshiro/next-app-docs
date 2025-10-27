'use client';

import { useCallback, useOptimistic, useState } from 'react';

import { logger } from '@/utils/logger';

import { useSendMessage } from '../../api';
import type { Message } from '../../types';

/**
 * チャット機能のカスタムフック
 *
 * React 19のuseOptimisticを使用して、メッセージ送信時の即座のUI反映を実現します。
 * FastAPIのレスポンスを待たずにユーザーメッセージを画面に表示し、
 * エラー時は自動的にロールバックされます。
 */
export const useSampleChat = () => {
  // ================================================================================
  // フック
  // ================================================================================
  const sendMessageMutation = useSendMessage();

  // ================================================================================
  // 状態
  // ================================================================================
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  // 楽観的UI更新のためのuseOptimistic
  // ユーザーメッセージを即座に表示し、FastAPIのレスポンスを待たずにUIを更新
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages, (state: Message[], newMessage: Message) => [
    ...state,
    newMessage,
  ]);

  // ================================================================================
  // ハンドラー
  // ================================================================================

  /**
   * メッセージ送信ハンドラー（useOptimistic対応版）
   *
   * 処理フロー:
   * 1. ユーザーメッセージを即座にUIに反映（楽観的更新）
   * 2. FastAPIにリクエスト送信
   * 3. 成功時: 実際のメッセージで状態を更新
   * 4. エラー時: 楽観的更新が自動的にロールバック、エラーメッセージを追加
   */
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) {
      return;
    }

    // ユーザーメッセージを作成
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // 🚀 即座にUIに反映（楽観的更新）
    addOptimisticMessage(userMessage);
    setInputMessage('');

    // FastAPIにメッセージを送信
    await sendMessageMutation
      .mutateAsync({
        message: userMessage.content,
        conversationId,
      })
      .then((response) => {
        // 会話IDを保存
        if (!conversationId) {
          setConversationId(response.conversationId);
        }

        // ✅ 実際のメッセージで状態を更新
        // useOptimisticのベースとなる状態を更新することで、楽観的更新を確定
        setMessages((prev: Message[]) => [...prev, userMessage, response.message]);
      })
      .catch((error) => {
        logger.error('メッセージの送信に失敗しました', error);

        // ❌ エラー時: 楽観的更新が自動的にロールバック
        // エラーメッセージのみを追加
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'エラーが発生しました。もう一度お試しください。',
          timestamp: new Date(),
        };
        setMessages((prev: Message[]) => [...prev, errorMessage]);
      });
  }, [inputMessage, sendMessageMutation, conversationId, addOptimisticMessage]);

  /**
   * 入力変更ハンドラー
   */
  const handleInputChange = useCallback((value: string) => {
    setInputMessage(value);
  }, []);

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    messages: optimisticMessages, // 楽観的更新を反映したメッセージリストを返す
    inputMessage,
    isSending: sendMessageMutation.isPending,
    handleSendMessage,
    handleInputChange,
  };
};
