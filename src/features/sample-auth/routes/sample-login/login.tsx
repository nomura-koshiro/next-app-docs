"use client";

import { LoginForm } from "./components/login";
import { useLogin } from "./login.hook";

// 開発環境でのみReact Hook Form DevToolsをインポート
let DevTool: any = () => null;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DevTool = require("@hookform/devtools").DevTool;
}

/**
 * ログインページ
 */
export default function LoginPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { control, onSubmit, errors, isSubmitting } = useLogin();

  return (
    <>
      <LoginForm
        control={control}
        onSubmit={onSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      {/* 開発環境でのみReact Hook Form DevToolsを表示 */}
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  );
}
