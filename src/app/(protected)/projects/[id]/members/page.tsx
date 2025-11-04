import type { Metadata } from "next";

import ProjectMembers from "@/features/projects/routes/project-members";

export const metadata: Metadata = {
  title: "プロジェクトメンバー | Camp App",
  description: "プロジェクトメンバーの管理を行います。",
};

export default function ProjectMembersPage() {
  return <ProjectMembers />;
}
