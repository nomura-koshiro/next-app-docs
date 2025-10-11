"use client";

import { LoginForm } from "./components/login";
import { useLogin } from "./login.hook";

/**
 * ログインページ
 */
export default function LoginPage() {
  const { form, handleSubmit, isLoading, error } = useLogin();

  return (
    <LoginForm
      control={form.control}
      onSubmit={form.handleSubmit(handleSubmit)}
      errors={form.formState.errors}
      isLoading={isLoading}
      error={error}
    />
  );
}
