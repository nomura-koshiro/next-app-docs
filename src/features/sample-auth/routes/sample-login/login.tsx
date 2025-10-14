"use client";

import { LoginForm } from "./components/login";
import { useLogin } from "./login.hook";
import { useDevTools } from "@/hooks/use-devtools";

/**
 * ログインページ
 */
export default function LoginPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { control, onSubmit, errors, isSubmitting } = useLogin();
  const DevTools = useDevTools(control);

  return (
    <>
      <LoginForm
        control={control}
        onSubmit={onSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      {DevTools}
    </>
  );
}
