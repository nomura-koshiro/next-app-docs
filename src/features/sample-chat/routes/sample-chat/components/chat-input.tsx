import { Loader2, Send } from 'lucide-react';

import { Button } from '@/components/sample-ui/button';
import { Textarea } from '@/components/sample-ui/textarea';

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

/**
 * チャット入力フォーム
 *
 * メッセージの入力と送信を管理します。
 */
export const ChatInput = ({ value, onChange, onSubmit, isSending, disabled = false }: ChatInputProps) => {
  /**
   * Enterキーでの送信
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSending && !disabled) {
        onSubmit();
      }
    }
  };

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
