import { Input } from '@/components/sample-ui/input';
import { Label } from '@/components/sample-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/sample-ui/select';

/**
 * FormFieldコンポーネントのプロパティ
 */
type FormFieldProps = {
  /** ラベルテキスト */
  label: string;
  /** フィールドのID */
  id: string;
  /** 必須フィールドかどうか（デフォルト: false） */
  required?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 子要素（インプット要素など） */
  children?: React.ReactNode;
};

/**
 * フォームフィールドコンポーネント
 *
 * ラベル、入力フィールド、エラーメッセージを含む汎用フォームフィールド。
 * 他のフォームコンポーネントのベースとして使用されます。
 *
 * 機能:
 * - ラベル表示
 * - 必須マーク（*）の表示
 * - エラーメッセージ表示
 *
 * @example
 * ```tsx
 * <FormField label="メールアドレス" id="email" required error="必須項目です">
 *   <Input id="email" type="email" />
 * </FormField>
 * ```
 *
 * @param props - FormFieldコンポーネントのプロパティ
 * @returns フォームフィールド要素
 */
export function FormField({ label, id, required = false, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

type InputFieldProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export function InputField({ label, id, type = 'text', value, onChange, placeholder, required = false, error }: InputFieldProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </FormField>
  );
}

type SelectFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  error?: string;
};

export function SelectField({ label, id, value, onChange, options, required = false, error }: SelectFieldProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
