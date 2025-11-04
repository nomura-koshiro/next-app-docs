import type { Metadata } from "next";

import NewProject from "@/features/projects/routes/new-project";

export const metadata: Metadata = {
  title: "新規プロジェクト作成 | Camp App",
  description: "新しいプロジェクトを作成します。",
};

export default function NewProjectPage() {
  return <NewProject />;
}
