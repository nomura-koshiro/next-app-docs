'use client';

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/sample-ui/checkbox';
import { Input } from '@/components/sample-ui/input';
import { Label } from '@/components/sample-ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/sample-ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/sample-ui/select';
import { Switch } from '@/components/sample-ui/switch';
import { Textarea } from '@/components/sample-ui/textarea';

type ControlledInputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  id?: string;
};

/**
 * react-hook-form対応のInputフィールドコンポーネント
 */
export function ControlledInputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
  id,
}: ControlledInputFieldProps<TFieldValues>) {
  const fieldId = id ?? name;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={fieldId}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={fieldState.error ? 'true' : 'false'}
          />
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
};

/**
 * react-hook-form対応のSelectフィールドコンポーネント
 */
export function ControlledSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
}: ControlledSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-invalid={fieldState.error ? 'true' : 'false'}>
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
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledTextareaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

/**
 * react-hook-form対応のTextareaフィールドコンポーネント
 */
export function ControlledTextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  rows = 4,
}: ControlledTextareaFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea {...field} id={name} placeholder={placeholder} rows={rows} aria-invalid={fieldState.error ? 'true' : 'false'} />
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledCheckboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
};

/**
 * react-hook-form対応のCheckboxフィールドコンポーネント
 */
export function ControlledCheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: ControlledCheckboxFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id={name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.error ? 'true' : 'false'} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={name} className="cursor-pointer">
                {label}
              </Label>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledRadioGroupFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
  required?: boolean;
};

/**
 * react-hook-form対応のRadioGroupフィールドコンポーネント
 */
export function ControlledRadioGroupField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
}: ControlledRadioGroupFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                  {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                </div>
              </div>
            ))}
          </RadioGroup>
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledSwitchFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
};

/**
 * react-hook-form対応のSwitchフィールドコンポーネント
 */
export function ControlledSwitchField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: ControlledSwitchFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor={name}>{label}</Label>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <Switch id={name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.error ? 'true' : 'false'} />
          </div>
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}

type ControlledDateFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  required?: boolean;
};

/**
 * react-hook-form対応のDateフィールドコンポーネント
 */
export function ControlledDateField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required = false,
}: ControlledDateFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input {...field} id={name} type="date" aria-invalid={fieldState.error ? 'true' : 'false'} />
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
