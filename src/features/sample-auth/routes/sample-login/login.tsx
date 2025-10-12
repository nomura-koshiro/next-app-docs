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
  const { form, handleSubmit, isLoading, error } = useLogin();

  return (
    <>
      <LoginForm
        control={form.control}
        onSubmit={form.handleSubmit(handleSubmit)}
        errors={form.formState.errors}
        isLoading={isLoading}
        error={error}
      />

      {/* 開発環境でのみReact Hook Form DevToolsを表示 */}
      {process.env.NODE_ENV === "development" && (
        <DevTool control={form.control} />
      )}
    </>
  );
}
