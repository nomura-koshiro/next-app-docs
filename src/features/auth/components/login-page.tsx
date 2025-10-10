"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/api/login";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "@/components/ui/form-field";
import { ErrorMessage } from "@/components/ui/error-message";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin({
    mutationConfig: {
      onSuccess: (data) => {
        // JWTトークンをLocalStorageに保存
        localStorage.setItem("token", data.token);
        // ユーザー情報をZustandストアに保存
        setUser(data.user);
        // ユーザー一覧ページへリダイレクト
        router.push("/users");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>サンプルアプリケーションへようこそ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <InputField
                label="メールアドレス"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="user@example.com"
                required
              />

              <InputField
                label="パスワード"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="パスワードを入力"
                required
              />
            </div>

            {loginMutation.isError && (
              <ErrorMessage message="ログインに失敗しました。メールアドレスとパスワードを確認してください。" />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "ログイン中..." : "ログイン"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              テスト用アカウント: 任意のメールアドレスとパスワード
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
