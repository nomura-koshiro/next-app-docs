"use client";

import { FormSample, useFormSample } from "@/features/form-sample";

/**
 * フォームサンプルページ
 */
export default function FormSamplePage() {
  const { form, handleSubmit } = useFormSample();

  return (
    <FormSample
      control={form.control}
      onSubmit={handleSubmit}
      onReset={() => form.reset()}
      isSubmitting={form.formState.isSubmitting}
    />
  );
}
