import type { Metadata } from "next";

import ProjectsList from "@/features/projects/routes/projects-list";

export const metadata: Metadata = {
  title: "プロジェクト一覧 | Camp App",
  description: "プロジェクトの一覧を表示します。",
};

export default function ProjectsPage() {
  return <ProjectsList />;
}
