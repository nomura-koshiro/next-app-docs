import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "フォームサンプル | Sample App",
  description: "React Hook FormとZodを使用したフォームバリデーションのサンプルページです。",
};

export { default } from "@/features/sample-form/routes/sample-form";
