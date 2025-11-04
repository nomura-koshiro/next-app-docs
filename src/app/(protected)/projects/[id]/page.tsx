import type { Metadata } from "next";

import ProjectDetail from "@/features/projects/routes/project-detail";

export const metadata: Metadata = {
  title: "プロジェクト詳細 | Camp App",
  description: "プロジェクトの詳細情報を表示します。",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <ProjectDetail projectId={id} />;
}
