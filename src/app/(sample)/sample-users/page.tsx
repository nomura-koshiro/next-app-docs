import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー一覧 | Sample App",
  description: "ユーザー一覧ページです。登録されているすべてのユーザーを表示・管理できます。",
};

export { default } from "@/features/sample-users/routes/sample-users";
