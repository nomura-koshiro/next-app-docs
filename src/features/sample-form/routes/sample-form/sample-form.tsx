"use client";

import { SampleForm } from "./components/sample-form-form";
import { useSampleForm } from "./sample-form.hook";

/**
 * サンプルフォームページコンテナ
 *
 * ロジックを useSampleForm フックで管理し、
 * プレゼンテーショナルコンポーネント SampleForm に渡します。
 */
export default function SampleFormPage() {
  const { form, handleSubmit } = useSampleForm();

  return (
    <SampleForm
      control={form.control}
      onSubmit={handleSubmit}
      onReset={() => form.reset()}
      isSubmitting={form.formState.isSubmitting}
    />
  );
}
