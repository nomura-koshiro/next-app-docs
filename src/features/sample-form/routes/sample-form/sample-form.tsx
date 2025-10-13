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
  const { control, onSubmit, reset } = useSampleForm();

  return (
    <>
      <SampleForm
        control={control}
        onSubmit={onSubmit}
        onReset={reset}
        isSubmitting={false}
      />

      {/* 開発環境でのみReact Hook Form DevToolsを表示 */}
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  );
}
