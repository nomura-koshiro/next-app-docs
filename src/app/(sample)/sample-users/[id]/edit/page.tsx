import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー編集 | Sample App",
  description: "ユーザー情報を編集します。",
};

export { default } from "@/features/sample-users/routes/sample-edit-user";
