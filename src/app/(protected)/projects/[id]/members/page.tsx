import type { Metadata } from "next";

import { ProjectMembers } from "@/features/projects/routes/project-members";

export const metadata: Metadata = {
  title: "プロジェクトメンバー | Camp App",
  description: "プロジェクトメンバーの管理を行います。",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectMembersPage({ params }: PageProps) {
  const { id } = await params;

  return <ProjectMembers projectId={id} />;
}
