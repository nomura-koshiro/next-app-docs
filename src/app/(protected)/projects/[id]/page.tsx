import type { Metadata } from "next";

import ProjectDetail from "@/features/projects/routes/project-detail";

export const metadata: Metadata = {
  title: "プロジェクト詳細 | Camp App",
  description: "プロジェクトの詳細情報を表示します。",
};

export default function ProjectDetailPage() {
  return <ProjectDetail />;
}
