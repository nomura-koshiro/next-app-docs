"use client";

import { SampleForm } from "./components/sample-form-form";
import { useSampleForm } from "./sample-form.hook";
import { useDevTools } from "@/hooks/use-devtools";

/**
 * サンプルフォームページコンテナ
 *
 * ロジックを useSampleForm フックで管理し、
 * プレゼンテーショナルコンポーネント SampleForm に渡します。
 */
export default function SampleFormPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { control, onSubmit, reset } = useSampleForm();
  const DevTools = useDevTools(control);

  return (
    <>
      <SampleForm
        control={control}
        onSubmit={onSubmit}
        onReset={reset}
        isSubmitting={false}
      />
      {DevTools}
    </>
  );
}
