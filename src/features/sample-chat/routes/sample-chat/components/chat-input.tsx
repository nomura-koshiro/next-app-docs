import { Loader2, Send } from 'lucide-react';

import { Button } from '@/components/sample-ui/button';
import { Textarea } from '@/components/sample-ui/textarea';

// ================================================================================
// Props
// ================================================================================

type ChatInputProps = {
  /** 入力中のメッセージ */
  value: string;
  /** 入力変更ハンドラー */
  onChange: (value: string) => void;
  /** 送信ハンドラー */
  onSubmit: () => void;
  /** 送信中かどうか */
  isSending: boolean;
  /** 無効化フラグ */
  disabled?: boolean;
};

// ================================================================================
// Component
// ================================================================================

/**
 * チャット入力フォーム
 *
 * メッセージの入力と送信を管理するフォームコンポーネントです。
 *
 * 機能:
 * - テキストエリアでのメッセージ入力
 * - Enterキーでの送信（Shift + Enterで改行）
 * - 送信ボタンによる送信
 * - 送信中の状態表示とボタンの無効化
 *
 * @param props - コンポーネントのプロパティ
 * @param props.value - 入力中のメッセージ
 * @param props.onChange - 入力変更時のコールバック関数
 * @param props.onSubmit - 送信時のコールバック関数
 * @param props.isSending - 送信中かどうかのフラグ
 * @param props.disabled - フォーム全体の無効化フラグ
 * @returns チャット入力フォームコンポーネント
 *
 * @example
 * ```tsx
 * <ChatInput
 *   value={message}
 *   onChange={setMessage}
 *   onSubmit={handleSubmit}
 *   isSending={false}
 * />
 * ```
 */
export const ChatInput = ({ value, onChange, onSubmit, isSending, disabled = false }: ChatInputProps) => {
  // ================================================================================
  // Handlers
  // ================================================================================

  /**
   * Enterキーでの送信処理
   * Shift + Enterの場合は改行を許可
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSending && !disabled) {
        onSubmit();
      }
    }
  };

  // ================================================================================
  // Render
  // ================================================================================

  return (
    <div className="flex gap-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力してください... (Enter で送信、Shift + Enter で改行)"
        disabled={isSending || disabled}
        rows={3}
        className="resize-none"
      />
      <Button onClick={onSubmit} disabled={!value.trim() || isSending || disabled} className="shrink-0" size="lg">
        {isSending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            回答生成中...
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            送信
          </>
        )}
      </Button>
    </div>
  );
};
