# フロントエンド RBAC設計

## 概要

権限システム（RBAC）のフロントエンド実装設計書です。Next.js + bulletproof-reactアーキテクチャに基づいた、プロジェクトメンバー管理とシステム管理の実装方法を定義します。

**最新更新日**: 2025-01-02
**初回作成日**: 2024-11-02

**関連ドキュメント:**
- [権限システム再設計（バックエンド）](./permission-system-redesign.md)

**実装環境:**
- フレームワーク: Next.js 14 (App Router)
- アーキテクチャ: bulletproof-react
- 状態管理: Zustand + React Query
- UIライブラリ: shadcn/ui

**重要な変更点（2025-01-02）:**
- `PROJECT_ADMIN` → `PROJECT_MANAGER` に名称変更
- `PROJECT_MODERATOR`（権限管理者）を新規追加
- 4段階の階層的な権限構造（PROJECT_MANAGER / PROJECT_MODERATOR / MEMBER / VIEWER）

---

## 目次

1. [実装ファイル構成](#1-実装ファイル構成)
2. [型定義](#2-型定義)
3. [API層（React Query統合）](#3-api層react-query統合)
4. [コンポーネント設計](#4-コンポーネント設計)
5. [Storybook設計](#5-storybook設計)
6. [MSWモック設計](#6-mswモック設計)
7. [実装順序](#7-実装順序)

---

## 1. 実装ファイル構成

### 1.1 ディレクトリ構造（sample-usersパターン準拠）

```
C:/developments/next-app-docs/src/features/projects/
├── api/                                           # API層（React Query統合）
│   ├── get-project-members.ts                    # ✨新規: メンバー一覧取得
│   ├── add-project-member.ts                     # ✨新規: メンバー追加
│   ├── update-member-role.ts                     # ✨新規: ロール更新
│   ├── remove-project-member.ts                  # ✨新規: メンバー削除
│   ├── bulk-update-roles.ts                      # ✨新規: ロール一括更新
│   └── index.ts                                  # ✨新規: 統合エクスポート
│
├── types/                                         # 型定義
│   └── index.ts                                  # ✨新規: ProjectRole, ProjectMember等
│
├── routes/                                        # ルート単位のコンポーネント
│   └── project-members/                          # プロジェクトメンバー一覧ページ
│       ├── project-members.tsx                   # ✨新規: ページコンポーネント
│       ├── project-members.hook.ts               # ✨新規: ビジネスロジック
│       ├── project-members.stories.tsx           # ✨新規: Storybook
│       ├── index.ts                              # ✨新規: エクスポート
│       └── components/                            # ページ専用コンポーネント
│           ├── members-table.tsx                 # ✨新規: メンバー一覧テーブル
│           ├── members-table.stories.tsx         # ✨新規: Storybook
│           ├── role-select.tsx                   # ✨新規: ロール選択
│           ├── role-select.stories.tsx           # ✨新規: Storybook
│           ├── add-member-dialog.tsx             # ✨新規: メンバー追加ダイアログ
│           ├── add-member-dialog.stories.tsx     # ✨新規: Storybook
│           └── index.ts                          # ✨新規: エクスポート
│
├── components/                                    # 共有コンポーネント
│   ├── role-badge.tsx                            # ✨新規: ロールバッジ表示
│   ├── role-badge.stories.tsx                    # ✨新規: Storybook
│   └── index.ts                                  # ✨新規: エクスポート
│
└── index.ts                                       # ✨新規: 機能全体のエクスポート

C:/developments/next-app-docs/src/mocks/handlers/api/v1/projects/
└── project-member-handlers.ts                    # ✨新規: MSWモックハンドラー

C:/developments/genai-app-docs/src/app/models/
└── user.py                                        # 📝既存修正: SystemRole enumを確認
```

**凡例:**
- `✨新規` - 新規作成ファイル
- `📝既存修正` - 既存ファイルの修正（コメントレベル確認のみ）

### 1.2 sample-usersとの対応表

| sample-users | projects | 説明 |
|-------------|----------|------|
| `api/get-users.ts` | `api/get-project-members.ts` | 一覧取得API |
| `api/delete-user.ts` | `api/remove-project-member.ts` | 削除API |
| `types/index.ts` | `types/index.ts` | 型定義 |
| `routes/sample-users/users.tsx` | `routes/project-members/project-members.tsx` | ページコンポーネント |
| `routes/sample-users/users.hook.ts` | `routes/project-members/project-members.hook.ts` | ビジネスロジック |
| `routes/sample-users/users.stories.tsx` | `routes/project-members/project-members.stories.tsx` | Storybook |
| `mocks/handlers/api/v1/sample/user-handlers.ts` | `mocks/handlers/api/v1/projects/project-member-handlers.ts` | MSWハンドラー |

---

## 2. 型定義

### 2.1 ProjectRole（4段階の階層構造）

**ファイル:** `src/features/projects/types/index.ts`（✨新規作成）

```typescript
/**
 * システムレベルのロール
 */
export enum SystemRole {
  SYSTEM_ADMIN = 'system_admin',
  USER = 'user',
}

/**
 * プロジェクトレベルのロール（4段階）
 */
export enum ProjectRole {
  /** プロジェクトマネージャー（最高権限） */
  PROJECT_MANAGER = 'project_manager',

  /** 権限管理者（メンバー管理担当） */
  PROJECT_MODERATOR = 'project_moderator',

  /** メンバー（編集権限） */
  MEMBER = 'member',

  /** 閲覧者（閲覧のみ） */
  VIEWER = 'viewer',
}

/**
 * 権限の種類
 */
export type Permission =
  // プロジェクトレベル権限
  | 'project:view'
  | 'project:edit'
  | 'project:delete'
  | 'project:manage_members'
  | 'project:manage_settings'
  // システムレベル権限
  | 'system:admin'
  | 'system:manage_users'
  | 'system:view_audit_logs';
```

### 2.2 ユーザー・プロジェクトメンバー型

```typescript
/**
 * ユーザー情報
 */
export type User = {
  id: string;
  azure_oid: string;
  email: string;
  display_name: string | null;
  roles: SystemRole[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
};

/**
 * プロジェクト情報
 */
export type Project = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
};

/**
 * プロジェクトメンバー情報
 */
export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  joined_at: string;
  updated_at: string;
  user?: User;
  project?: Project;
};
```

### 2.3 API型定義

```typescript
/**
 * プロジェクトメンバー一覧のレスポンス
 */
export type ProjectMembersResponse = {
  data: ProjectMember[];
};

/**
 * プロジェクトメンバー詳細のレスポンス
 */
export type ProjectMemberResponse = {
  data: ProjectMember;
};

/**
 * プロジェクトメンバー追加DTO
 */
export type AddProjectMemberDTO = {
  user_id: string;
  role: ProjectRole;
};

/**
 * プロジェクトメンバー複数追加DTO
 */
export type BulkAddMembersDTO = {
  members: Array<{
    user_id: string;
    role: ProjectRole;
  }>;
};

/**
 * プロジェクトメンバーロール更新DTO
 */
export type UpdateMemberRoleDTO = {
  role: ProjectRole;
};

/**
 * プロジェクトメンバー複数ロール更新DTO
 */
export type BulkUpdateRolesDTO = {
  updates: Array<{
    member_id: string;
    role: ProjectRole;
  }>;
};

/**
 * エラーレスポンス
 */
export type ErrorResponse = {
  message: string;
  detail?: string;
};
```

---

## 3. API層（React Query統合）

### 3.1 メンバー一覧取得

**ファイル:** `src/features/projects/api/get-project-members.ts`（✨新規）

```typescript
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";

import type { ProjectMembersResponse } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバー一覧を取得
 *
 * @param projectId プロジェクトID
 * @returns プロジェクトメンバー一覧
 *
 * @example
 * ```tsx
 * const members = await getProjectMembers('project-123')
 * console.log(members.data) // ProjectMember[]
 * ```
 */
export const getProjectMembers = (projectId: string): Promise<ProjectMembersResponse> => {
  return api.get(`/projects/${projectId}/members`);
};

export const getProjectMembersQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => getProjectMembers(projectId),
  });
};

// ================================================================================
// Hooks
// ================================================================================

type UseProjectMembersOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectMembersQueryOptions>;
};

/**
 * プロジェクトメンバー一覧取得フック
 *
 * @param projectId プロジェクトID
 * @param queryConfig React Query設定
 * @returns プロジェクトメンバー一覧
 *
 * @example
 * ```tsx
 * const { data } = useProjectMembers({ projectId: 'project-123' })
 * console.log(data.data) // ProjectMember[]
 * ```
 */
export const useProjectMembers = ({ projectId, queryConfig }: UseProjectMembersOptions) => {
  return useSuspenseQuery({
    ...getProjectMembersQueryOptions(projectId),
    ...queryConfig,
  });
};
```

### 3.2 メンバー追加

**ファイル:** `src/features/projects/api/add-project-member.ts`（✨新規）

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { AddProjectMemberDTO, ProjectMemberResponse } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーを追加
 *
 * @param projectId プロジェクトID
 * @param data メンバー追加データ
 * @returns 追加されたプロジェクトメンバー
 *
 * @example
 * ```tsx
 * await addProjectMember({
 *   projectId: 'project-123',
 *   data: { user_id: 'user-456', role: ProjectRole.MEMBER }
 * });
 * ```
 */
export const addProjectMember = ({
  projectId,
  data,
}: {
  projectId: string;
  data: AddProjectMemberDTO;
}): Promise<ProjectMemberResponse> => {
  return api.post(`/projects/${projectId}/members`, data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseAddProjectMemberOptions = {
  projectId: string;
  mutationConfig?: MutationConfig<typeof addProjectMember>;
};

/**
 * プロジェクトメンバー追加フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const addMemberMutation = useAddProjectMember({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('メンバーが追加されました');
 *     },
 *   },
 * });
 *
 * const handleAdd = () => {
 *   addMemberMutation.mutate({
 *     user_id: 'user-456',
 *     role: ProjectRole.MEMBER
 *   });
 * };
 * ```
 */
export const useAddProjectMember = ({ projectId, mutationConfig }: UseAddProjectMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] }).catch((error) => {
        logger.error("プロジェクトメンバークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: AddProjectMemberDTO) => addProjectMember({ projectId, data }),
  });
};
```

### 3.3 ロール更新

**ファイル:** `src/features/projects/api/update-member-role.ts`（✨新規）

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { ProjectMemberResponse, UpdateMemberRoleDTO } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを更新
 *
 * @param projectId プロジェクトID
 * @param memberId メンバーID
 * @param data ロール更新データ
 * @returns 更新されたプロジェクトメンバー
 *
 * @example
 * ```tsx
 * await updateMemberRole({
 *   projectId: 'project-123',
 *   memberId: 'member-456',
 *   data: { role: ProjectRole.PROJECT_MANAGER }
 * });
 * ```
 */
export const updateMemberRole = ({
  projectId,
  memberId,
  data,
}: {
  projectId: string;
  memberId: string;
  data: UpdateMemberRoleDTO;
}): Promise<ProjectMemberResponse> => {
  // 重要: エンドポイントは /members/{member_id} で、/role サフィックスなし
  return api.patch(`/projects/${projectId}/members/${memberId}`, data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseUpdateMemberRoleOptions = {
  projectId: string;
  mutationConfig?: MutationConfig<typeof updateMemberRole>;
};

/**
 * プロジェクトメンバーロール更新フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const updateRoleMutation = useUpdateMemberRole({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('ロールが更新されました');
 *     },
 *   },
 * });
 *
 * const handleUpdate = (memberId: string) => {
 *   updateRoleMutation.mutate({
 *     memberId,
 *     data: { role: ProjectRole.PROJECT_MANAGER }
 *   });
 * };
 * ```
 */
export const useUpdateMemberRole = ({ projectId, mutationConfig }: UseUpdateMemberRoleOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] }).catch((error) => {
        logger.error("プロジェクトメンバークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateMemberRoleDTO }) =>
      updateMemberRole({ projectId, memberId, data }),
  });
};
```

### 3.4 メンバー削除

**ファイル:** `src/features/projects/api/remove-project-member.ts`（✨新規）

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーを削除
 *
 * @param projectId プロジェクトID
 * @param memberId メンバーID
 *
 * @example
 * ```tsx
 * await removeProjectMember({
 *   projectId: 'project-123',
 *   memberId: 'member-456'
 * });
 * ```
 */
export const removeProjectMember = ({
  projectId,
  memberId,
}: {
  projectId: string;
  memberId: string;
}): Promise<void> => {
  return api.delete(`/projects/${projectId}/members/${memberId}`);
};

// ================================================================================
// Hooks
// ================================================================================

type UseRemoveProjectMemberOptions = {
  projectId: string;
  mutationConfig?: MutationConfig<typeof removeProjectMember>;
};

/**
 * プロジェクトメンバー削除フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const removeMemberMutation = useRemoveProjectMember({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('メンバーが削除されました');
 *     },
 *   },
 * });
 *
 * const handleRemove = (memberId: string) => {
 *   if (confirm('本当に削除しますか?')) {
 *     removeMemberMutation.mutate({ memberId });
 *   }
 * };
 * ```
 */
export const useRemoveProjectMember = ({ projectId, mutationConfig }: UseRemoveProjectMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] }).catch((error) => {
        logger.error("プロジェクトメンバークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: ({ memberId }: { memberId: string }) => removeProjectMember({ projectId, memberId }),
  });
};
```

### 3.5 ロール一括更新

**ファイル:** `src/features/projects/api/bulk-update-roles.ts`（✨新規）

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import type { BulkUpdateRolesDTO } from "../types";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクトメンバーのロールを一括更新
 *
 * @param projectId プロジェクトID
 * @param data ロール一括更新データ
 *
 * @example
 * ```tsx
 * await bulkUpdateRoles({
 *   projectId: 'project-123',
 *   data: {
 *     updates: [
 *       { member_id: 'member-1', role: ProjectRole.PROJECT_MANAGER },
 *       { member_id: 'member-2', role: ProjectRole.MEMBER }
 *     ]
 *   }
 * });
 * ```
 */
export const bulkUpdateRoles = ({
  projectId,
  data,
}: {
  projectId: string;
  data: BulkUpdateRolesDTO;
}): Promise<void> => {
  return api.patch(`/projects/${projectId}/members/bulk`, data);
};

// ================================================================================
// Hooks
// ================================================================================

type UseBulkUpdateRolesOptions = {
  projectId: string;
  mutationConfig?: MutationConfig<typeof bulkUpdateRoles>;
};

/**
 * プロジェクトメンバーロール一括更新フック
 *
 * ミューテーション成功時にプロジェクトメンバー一覧のクエリキャッシュを無効化します。
 *
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 *
 * @example
 * ```tsx
 * const bulkUpdateMutation = useBulkUpdateRoles({
 *   projectId: 'project-123',
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log('ロールが一括更新されました');
 *     },
 *   },
 * });
 *
 * const handleBulkUpdate = (updates) => {
 *   bulkUpdateMutation.mutate({ updates });
 * };
 * ```
 */
export const useBulkUpdateRoles = ({ projectId, mutationConfig }: UseBulkUpdateRolesOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] }).catch((error) => {
        logger.error("プロジェクトメンバークエリの無効化に失敗しました", error);
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: BulkUpdateRolesDTO) => bulkUpdateRoles({ projectId, data }),
  });
};
```

### 3.6 統合エクスポート

**ファイル:** `src/features/projects/api/index.ts`（✨新規）

```typescript
export * from "./add-project-member";
export * from "./bulk-update-roles";
export * from "./get-project-members";
export * from "./remove-project-member";
export * from "./update-member-role";
```

---

## 4. コンポーネント設計

### 4.1 ページコンポーネント（ErrorBoundary + Suspense）

**ファイル:** `src/features/projects/routes/project-members/project-members.tsx`（✨新規）

```typescript
"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { MembersTable } from "./components/members-table";
import { useProjectMembers } from "./project-members.hook";

// ページコンテンツ
const ProjectMembersPageContent = ({ projectId }: { projectId: string }) => {
  const { members, handleAddMember, handleUpdateRole, handleRemoveMember } = useProjectMembers({ projectId });

  return (
    <PageLayout>
      <PageHeader
        title="プロジェクトメンバー"
        action={<Button onClick={handleAddMember}>メンバーを追加</Button>}
      />

      <MembersTable members={members} onUpdateRole={handleUpdateRole} onRemove={handleRemoveMember} />
    </PageLayout>
  );
};

// ページコンポーネント（ErrorBoundary + Suspense パターン）
const ProjectMembersPage = ({ projectId }: { projectId: string }) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ProjectMembersPageContent projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectMembersPage;
```

### 4.2 ビジネスロジックフック（useOptimistic）

**ファイル:** `src/features/projects/routes/project-members/project-members.hook.ts`（✨新規）

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useOptimistic } from "react";

import {
  useAddProjectMember,
  useProjectMembers as useProjectMembersQuery,
  useRemoveProjectMember as useRemoveProjectMemberMutation,
  useUpdateMemberRole as useUpdateMemberRoleMutation,
} from "@/features/projects/api";
import type { ProjectMember, ProjectRole } from "@/features/projects/types";

export const useProjectMembers = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const { data } = useProjectMembersQuery({ projectId });
  const addMemberMutation = useAddProjectMember({ projectId });
  const updateRoleMutation = useUpdateMemberRoleMutation({ projectId });
  const removeMemberMutation = useRemoveProjectMemberMutation({ projectId });

  const members = data?.data ?? [];

  // 楽観的UI更新（削除時）
  const [optimisticMembers, removeOptimisticMember] = useOptimistic(
    members,
    (state: ProjectMember[], deletedMemberId: string) =>
      state.filter((member: ProjectMember) => member.id !== deletedMemberId)
  );

  // メンバー追加ダイアログを表示
  const handleAddMember = () => {
    console.log("メンバー追加ダイアログを表示");
  };

  // メンバーのロールを更新
  const handleUpdateRole = async (memberId: string, newRole: ProjectRole) => {
    const member = members.find((m: ProjectMember) => m.id === memberId);
    if (!member) return;

    const confirmed = window.confirm(
      `${member.user?.display_name || member.user?.email} のロールを ${newRole} に変更してもよろしいですか？`
    );

    if (!confirmed) return;

    await updateRoleMutation
      .mutateAsync({
        memberId,
        data: { role: newRole },
      })
      .catch((error) => {
        console.error("ロールの更新に失敗しました:", error);
        alert("ロールの更新に失敗しました。もう一度お試しください。");
      });
  };

  // メンバー削除（useOptimistic対応）
  const handleRemoveMember = async (memberId: string) => {
    const member = members.find((m: ProjectMember) => m.id === memberId);
    if (!member) return;

    const confirmed = window.confirm(
      `${member.user?.display_name || member.user?.email} をプロジェクトから削除してもよろしいですか？\nこの操作は取り消せません。`
    );

    if (!confirmed) return;

    // 即座にUIから削除（楽観的更新）
    removeOptimisticMember(memberId);

    // APIに削除リクエスト
    await removeMemberMutation.mutateAsync({ memberId }).catch((error) => {
      console.error("メンバーの削除に失敗しました:", error);
      alert("メンバーの削除に失敗しました。もう一度お試しください。");
    });
  };

  return {
    members: optimisticMembers,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember,
    isDeleting: removeMemberMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
  };
};
```

### 4.3 MembersTableコンポーネント

**ファイル:** `src/features/projects/routes/project-members/components/members-table.tsx`（✨新規）

```typescript
"use client";

import type { ProjectMember, ProjectRole } from "@/features/projects/types";

type MembersTableProps = {
  members: ProjectMember[];
  onUpdateRole: (memberId: string, newRole: ProjectRole) => void;
  onRemove: (memberId: string) => void;
};

export const MembersTable = ({ members, onUpdateRole, onRemove }: MembersTableProps) => {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">メンバーがいません</p>
        <p className="mt-2 text-sm text-gray-400">「メンバーを追加」ボタンから追加してください</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">名前</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              メールアドレス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ロール</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">参加日</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              アクション
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {member.user?.display_name || "-"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{member.user?.email || "-"}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    member.role === "project_manager"
                      ? "bg-purple-100 text-purple-800"
                      : member.role === "project_moderator"
                        ? "bg-blue-100 text-blue-800"
                        : member.role === "member"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.role === "project_manager"
                    ? "マネージャー"
                    : member.role === "project_moderator"
                      ? "権限管理者"
                      : member.role === "member"
                        ? "メンバー"
                        : "閲覧者"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(member.joined_at).toLocaleDateString("ja-JP")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => onRemove(member.id)}
                  className="text-red-600 hover:text-red-900"
                  type="button"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 4.4 RoleBadgeコンポーネント

**ファイル:** `src/features/projects/components/role-badge.tsx`（✨新規）

```typescript
import { ProjectRole } from "@/features/projects/types";

type RoleBadgeProps = {
  role: ProjectRole;
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = {
    project_manager: { label: "マネージャー", color: "bg-purple-100 text-purple-800" },
    project_moderator: { label: "権限管理者", color: "bg-blue-100 text-blue-800" },
    member: { label: "メンバー", color: "bg-green-100 text-green-800" },
    viewer: { label: "閲覧者", color: "bg-gray-100 text-gray-800" },
  }[role];

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${config.color}`}>{config.label}</span>
  );
};
```

---

## 5. Storybook設計

### 5.1 ページStorybookファイル

**ファイル:** `src/features/projects/routes/project-members/project-members.stories.tsx`（✨新規）

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, http, HttpResponse, within } from "@storybook/test";
import { delay } from "msw";

import { ProjectRole } from "@/features/projects/types";

import ProjectMembersPage from "./project-members";

// モックデータ
const mockMembers = [
  {
    id: "member-1",
    project_id: "project-123",
    user_id: "user-1",
    role: ProjectRole.PROJECT_MANAGER,
    joined_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    user: {
      id: "user-1",
      azure_oid: "azure-1",
      email: "manager@example.com",
      display_name: "山田 太郎",
      roles: [],
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      last_login: null,
    },
  },
  {
    id: "member-2",
    project_id: "project-123",
    user_id: "user-2",
    role: ProjectRole.PROJECT_MODERATOR,
    joined_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    user: {
      id: "user-2",
      azure_oid: "azure-2",
      email: "moderator@example.com",
      display_name: "田中 花子",
      roles: [],
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      last_login: null,
    },
  },
  {
    id: "member-3",
    project_id: "project-123",
    user_id: "user-3",
    role: ProjectRole.MEMBER,
    joined_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-03-10T00:00:00Z",
    user: {
      id: "user-3",
      azure_oid: "azure-3",
      email: "member@example.com",
      display_name: "佐藤 次郎",
      roles: [],
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      last_login: null,
    },
  },
];

const meta = {
  title: "features/projects/routes/project-members/ProjectMembers",
  component: ProjectMembersPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:projectId/members", () => {
          return HttpResponse.json({
            data: mockMembers,
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
          },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  tags: ["autodocs"],
  args: {
    projectId: "project-123",
  },
} satisfies Meta<typeof ProjectMembersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// メンバー一覧表示
export const MembersList: Story = {
  name: "メンバー一覧表示",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pageTitle = await canvas.findByText("プロジェクトメンバー");
    expect(pageTitle).toBeInTheDocument();

    const managerName = await canvas.findByText("山田 太郎");
    expect(managerName).toBeInTheDocument();
  },
};

// ローディング状態
export const Loading: Story = {
  name: "ローディング状態",
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:projectId/members", async () => {
          await delay(5000);
          return HttpResponse.json({
            data: mockMembers,
          });
        }),
      ],
    },
  },
};

// エラー状態
export const WithError: Story = {
  name: "エラー状態",
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:projectId/members", () => {
          return HttpResponse.json(
            {
              message: "Failed to fetch project members",
            },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

// 空の状態
export const EmptyState: Story = {
  name: "空の状態",
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:projectId/members", () => {
          return HttpResponse.json({
            data: [],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyMessage = await canvas.findByText("メンバーがいません");
    expect(emptyMessage).toBeInTheDocument();
  },
};
```

### 5.2 コンポーネントStorybookファイル

**ファイル:** `src/features/projects/routes/project-members/components/members-table.stories.tsx`（✨新規）

同様のパターンでStorybookストーリーを作成。

---

## 6. MSWモック設計

**ファイル:** `src/mocks/handlers/api/v1/projects/project-member-handlers.ts`（✨新規）

```typescript
import { http, HttpResponse } from "msw";

import type { AddProjectMemberDTO, ProjectMember, ProjectRole, UpdateMemberRoleDTO } from "@/features/projects/types";

// モックデータ
const mockMembers: ProjectMember[] = [
  {
    id: "member-1",
    project_id: "project-123",
    user_id: "user-1",
    role: "project_manager",
    joined_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    user: {
      id: "user-1",
      azure_oid: "azure-1",
      email: "manager@example.com",
      display_name: "山田 太郎",
      roles: [],
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      last_login: null,
    },
  },
  // ...他のモックデータ
];

export const projectMemberHandlers = [
  // GET /projects/:projectId/members
  http.get("*/api/v1/projects/:projectId/members", ({ params }) => {
    const { projectId } = params;
    const members = mockMembers.filter((m) => m.project_id === projectId);
    return HttpResponse.json({ data: members });
  }),

  // POST /projects/:projectId/members
  http.post("*/api/v1/projects/:projectId/members", async ({ params, request }) => {
    const { projectId } = params;
    const body = (await request.json()) as AddProjectMemberDTO;

    const newMember: ProjectMember = {
      id: `member-${mockMembers.length + 1}`,
      project_id: projectId as string,
      user_id: body.user_id,
      role: body.role as ProjectRole,
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: body.user_id,
        azure_oid: `azure-${body.user_id}`,
        email: `${body.user_id}@example.com`,
        display_name: `新しいユーザー ${mockMembers.length + 1}`,
        roles: [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: null,
      },
    };

    mockMembers.push(newMember);
    return HttpResponse.json({ data: newMember }, { status: 201 });
  }),

  // PATCH /projects/:projectId/members/:memberId
  // 重要: エンドポイントは /members/{member_id} で、/role サフィックスなし
  http.patch("*/api/v1/projects/:projectId/members/:memberId", async ({ params, request }) => {
    const { projectId, memberId } = params;
    const body = (await request.json()) as UpdateMemberRoleDTO;

    const memberIndex = mockMembers.findIndex((m) => m.id === memberId && m.project_id === projectId);

    if (memberIndex === -1) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    mockMembers[memberIndex] = {
      ...mockMembers[memberIndex],
      role: body.role,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json({ data: mockMembers[memberIndex] });
  }),

  // DELETE /projects/:projectId/members/:memberId
  http.delete("*/api/v1/projects/:projectId/members/:memberId", ({ params }) => {
    const { projectId, memberId } = params;
    const memberIndex = mockMembers.findIndex((m) => m.id === memberId && m.project_id === projectId);

    if (memberIndex === -1) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    mockMembers.splice(memberIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
```

---

## 7. 実装順序

### フェーズ1: 基盤構築（1日目）
1. ✅ `types/index.ts` - 型定義（PROJECT_MANAGER, PROJECT_MODERATOR対応）
2. ✅ `api/get-project-members.ts` - メンバー取得API
3. ✅ `api/add-project-member.ts` - メンバー追加API
4. ✅ `api/update-member-role.ts` - ロール更新API
5. ✅ `api/remove-project-member.ts` - メンバー削除API
6. ✅ `api/index.ts` - API統合エクスポート

### フェーズ2: MSWモック（1日目）
7. ✅ `src/mocks/handlers/api/v1/projects/project-member-handlers.ts`

### フェーズ3: コアコンポーネント（2日目）
8. ✅ `components/role-badge.tsx` + `.stories.tsx`
9. ✅ `routes/project-members/components/members-table.tsx` + `.stories.tsx`

### フェーズ4: ページ実装（2日目）
10. ✅ `routes/project-members/project-members.hook.ts`
11. ✅ `routes/project-members/project-members.tsx`
12. ✅ `routes/project-members/project-members.stories.tsx`

### フェーズ5: 拡張機能（3日目以降）
13. ⏳ `routes/project-members/components/role-select.tsx` + `.stories.tsx`
14. ⏳ `routes/project-members/components/add-member-dialog.tsx` + `.stories.tsx`
15. ⏳ `api/bulk-update-roles.ts`

---

## 8. バックエンドAPIエンドポイント一覧

### 8.1 完全なエンドポイント仕様

以下は、バックエンドで実装されている完全なAPIエンドポイント一覧です。

```
GET    /api/v1/projects/{project_id}/members              # メンバー一覧取得
POST   /api/v1/projects/{project_id}/members              # メンバー追加
POST   /api/v1/projects/{project_id}/members/bulk         # メンバー一括追加
GET    /api/v1/projects/{project_id}/members/me           # 自分のロール取得
PATCH  /api/v1/projects/{project_id}/members/{member_id}  # ロール更新 ⚠️
PATCH  /api/v1/projects/{project_id}/members/bulk         # ロール一括更新
DELETE /api/v1/projects/{project_id}/members/{member_id}  # メンバー削除
DELETE /api/v1/projects/{project_id}/members/me           # プロジェクト退出
```

**⚠️ 重要な注意事項:**
- ロール更新のエンドポイントは `/members/{member_id}` で、`/role` サフィックスは**不要**です
- リクエストボディ: `{ "role": "project_manager" }`
- すべてのロール値は小文字スネークケース（`project_manager`, `project_moderator`, `member`, `viewer`）

### 8.2 リクエスト/レスポンス例

#### メンバー追加 (POST)

**リクエスト:**
```json
{
  "user_id": "user-uuid-123",
  "role": "project_moderator"
}
```

**レスポンス:**
```json
{
  "data": {
    "id": "member-uuid-456",
    "project_id": "project-uuid-789",
    "user_id": "user-uuid-123",
    "role": "project_moderator",
    "joined_at": "2025-01-02T10:00:00Z",
    "updated_at": "2025-01-02T10:00:00Z",
    "user": {
      "id": "user-uuid-123",
      "email": "user@example.com",
      "display_name": "田中 花子"
    }
  }
}
```

#### ロール更新 (PATCH)

**エンドポイント:** `/api/v1/projects/{project_id}/members/{member_id}`

**リクエスト:**
```json
{
  "role": "project_manager"
}
```

**レスポンス:**
```json
{
  "data": {
    "id": "member-uuid-456",
    "project_id": "project-uuid-789",
    "user_id": "user-uuid-123",
    "role": "project_manager",
    "joined_at": "2025-01-02T10:00:00Z",
    "updated_at": "2025-01-02T11:30:00Z"
  }
}
```

### 8.3 権限制限

**PROJECT_MODERATOR の制限事項:**
- ✅ VIEWER, MEMBER, PROJECT_MODERATOR のメンバーを追加・削除・ロール変更可能
- ❌ PROJECT_MANAGER ロールのメンバーは追加・削除・変更不可
- ❌ 自分自身のロールは変更不可

---

## 9. 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2024-11-02 | 1.0 | 初版作成 |
| 2025-01-02 | 2.0 | PROJECT_ADMIN → PROJECT_MANAGER に名称変更<br>PROJECT_MODERATOR を新規追加<br>4段階の階層構造に対応 |
| 2025-01-02 | 2.1 | APIエンドポイント詳細を追加<br>ロール更新エンドポイントの修正（/role サフィックス削除）<br>バックエンドAPIエンドポイント一覧を追加 |

---

**作成日**: 2024-11-02
**最終更新**: 2025-01-02
**作成者**: Claude Code
