"use client";

import { SampleForm } from "./components/sample-form-form";
import { useSampleForm } from "./sample-form.hook";

// 開発環境でのみReact Hook Form DevToolsをインポート
let DevTool: any = () => null;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DevTool = require("@hookform/devtools").DevTool;
}

/**
 * サンプルフォームページコンテナ
 *
 * ロジックを useSampleForm フックで管理し、
 * プレゼンテーショナルコンポーネント SampleForm に渡します。
 */
export default function SampleFormPage() {
  const { form, handleSubmit } = useSampleForm();

  return (
    <>
      <SampleForm
        control={form.control}
        onSubmit={handleSubmit}
        onReset={() => form.reset()}
        isSubmitting={form.formState.isSubmitting}
      />

      {/* 開発環境でのみReact Hook Form DevToolsを表示 */}
      {process.env.NODE_ENV === "development" && (
        <DevTool control={form.control} />
      )}
    </>
  );
}
