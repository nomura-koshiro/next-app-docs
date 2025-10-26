import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';
import { logger } from '@/utils/logger';

import type { SendMessageRequest, SendMessageResponse } from '../types';

// ================================================================================
// API Functions
// ================================================================================

/**
 * メッセージを送信してアシスタントの返信を取得
 *
 * @param request - メッセージ送信リクエスト
 * @returns アシスタントからの返信
 */
export const sendMessage = (request: SendMessageRequest): Promise<SendMessageResponse> => {
  return api.post('/api/v1/sample/chat/messages', request);
};

// ================================================================================
// Hooks
// ================================================================================

type UseSendMessageOptions = {
  mutationConfig?: MutationConfig<typeof sendMessage>;
};

export const useSendMessage = ({ mutationConfig }: UseSendMessageOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['sample', 'chat', 'messages'] }).catch((error) => {
        logger.error('Failed to invalidate chat messages query', error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: sendMessage,
  });
};
