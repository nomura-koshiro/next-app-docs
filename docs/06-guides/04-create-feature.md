# 新しいFeature作成手順

このガイドでは、新しいFeature(機能モジュール)を作成する手順を説明します。型定義からAPI関数、コンポーネント、ルーティング、MSWモックまで、Feature開発に必要なすべての手順を網羅します。

> 💡 **クイックスタート**: [コード生成ツール（Plop）](./01-code-generator.md)を使用すると、Featureの基本構造を自動生成できます。手動での作成方法を理解したい場合は、このガイドをお読みください。

## 目次

- [新しいFeature作成手順](#新しいfeature作成手順)
  - [目次](#目次)
  - [📋 完成イメージ](#-完成イメージ)
  - [ステップ1: Featureディレクトリを作成](#ステップ1-featureディレクトリを作成)
  - [ステップ2: 型定義を作成](#ステップ2-型定義を作成)
  - [ステップ3: API関数を作成](#ステップ3-api関数を作成)
    - [一覧取得](#一覧取得)
    - [個別取得](#個別取得)
    - [作成](#作成)
    - [更新](#更新)
    - [削除](#削除)
    - [API index.ts](#api-indexts)
  - [ステップ4: ルート(ページ)コンポーネントを作成](#ステップ4-ルートページコンポーネントを作成)
    - [一覧ページ](#一覧ページ)
    - [作成ページ(フォーム統合)](#作成ページフォーム統合)
  - [ステップ5: Feature index.tsでエクスポート](#ステップ5-feature-indextsでエクスポート)
  - [ステップ6: ルーティングを追加](#ステップ6-ルーティングを追加)
    - [paths.tsに追加](#pathstsに追加)
    - [App Routerにページを追加](#app-routerにページを追加)
  - [ステップ7: MSWモックハンドラーを追加](#ステップ7-mswモックハンドラーを追加)
  - [🎯 チェックリスト](#-チェックリスト)
  - [参考リンク](#参考リンク)

---

## 📋 完成イメージ

```text
src/features/posts/
├── api/
│   ├── get-posts.ts
│   ├── get-post.ts
│   ├── create-post.ts
│   ├── update-post.ts
│   ├── delete-post.ts
│   └── index.ts
├── routes/
│   ├── posts/              # 一覧ページ
│   ├── new-post/           # 作成ページ
│   ├── edit-post/          # 編集ページ
│   └── delete-post/        # 削除ページ
├── components/             # 共有コンポーネント
│   └── post-form.tsx       # フォームコンポーネント
├── types/
│   └── index.ts
└── index.ts
```

---

## ステップ1: Featureディレクトリを作成

```bash
# 新しいFeatureディレクトリを作成
mkdir -p src/features/posts/{api,routes,components,types}
```

---

## ステップ2: 型定義を作成

```typescript
// src/features/posts/types/index.ts

/**
 * 投稿
 */
export type Post = {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

/**
 * 投稿作成入力
 */
export type CreatePostInput = {
  title: string
  content: string
}

/**
 * 投稿更新入力
 */
export type UpdatePostInput = {
  title?: string
  content?: string
}
```

---

## ステップ3: API関数を作成

### 一覧取得

```typescript
// src/features/posts/api/get-posts.ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/tanstack-query'
import type { Post } from '../types'

export const getPosts = (): Promise<{ data: Post[] }> => {
  return api.get('/posts')
}

export const getPostsQueryOptions = () => {
  return queryOptions({
    queryKey: ['posts'],
    queryFn: getPosts,
  })
}

type UsePostsOptions = {
  queryConfig?: QueryConfig<typeof getPostsQueryOptions>
}

export const usePosts = ({ queryConfig }: UsePostsOptions = {}) => {
  return useQuery({
    ...getPostsQueryOptions(),
    ...queryConfig,
  })
}
```

### 個別取得

```typescript
// src/features/posts/api/get-post.ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/tanstack-query'
import type { Post } from '../types'

export const getPost = (postId: string): Promise<{ data: Post }> => {
  return api.get(`/posts/${postId}`)
}

export const getPostQueryOptions = (postId: string) => {
  return queryOptions({
    queryKey: ['posts', postId],
    queryFn: () => getPost(postId),
  })
}

type UsePostOptions = {
  postId: string
  queryConfig?: QueryConfig<typeof getPostQueryOptions>
}

export const usePost = ({ postId, queryConfig }: UsePostOptions) => {
  return useQuery({
    ...getPostQueryOptions(postId),
    enabled: !!postId,
    ...queryConfig,
  })
}
```

### 作成

```typescript
// src/features/posts/api/create-post.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'
import type { Post, CreatePostInput } from '../types'

export const createPost = (data: CreatePostInput): Promise<{ data: Post }> => {
  return api.post('/posts', data)
}

type UseCreatePostOptions = {
  mutationConfig?: MutationConfig<typeof createPost>
}

export const useCreatePost = ({ mutationConfig }: UseCreatePostOptions = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess?.(data, ...args)
    },
    ...restConfig,
  })
}
```

### 更新

```typescript
// src/features/posts/api/update-post.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'
import type { Post, UpdatePostInput } from '../types'

export const updatePost = ({
  postId,
  data,
}: {
  postId: string
  data: UpdatePostInput
}): Promise<{ data: Post }> => {
  return api.patch(`/posts/${postId}`, data)
}

type UseUpdatePostOptions = {
  mutationConfig?: MutationConfig<typeof updatePost>
}

export const useUpdatePost = ({ mutationConfig }: UseUpdatePostOptions = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (response, variables, ...args) => {
      const updatedPost = response.data
      queryClient.setQueryData(['posts', updatedPost.id], updatedPost)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess?.(response, variables, ...args)
    },
    ...restConfig,
  })
}
```

### 削除

```typescript
// src/features/posts/api/delete-post.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/tanstack-query'

export const deletePost = (postId: string): Promise<void> => {
  return api.delete(`/posts/${postId}`)
}

type UseDeletePostOptions = {
  mutationConfig?: MutationConfig<typeof deletePost>
}

export const useDeletePost = ({ mutationConfig }: UseDeletePostOptions = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (data, deletedPostId, ...args) => {
      queryClient.removeQueries({ queryKey: ['posts', deletedPostId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess?.(data, deletedPostId, ...args)
    },
    ...restConfig,
  })
}
```

### API index.ts

```typescript
// src/features/posts/api/index.ts
export * from './get-posts'
export * from './get-post'
export * from './create-post'
export * from './update-post'
export * from './delete-post'
```

---

## ステップ4: ルート(ページ)コンポーネントを作成

### 一覧ページ

```bash
mkdir -p src/features/posts/routes/posts
```

```typescript
// src/features/posts/routes/posts/posts.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { usePosts } from './posts.hook'

export default function PostsPage() {
  const { data, isLoading, error } = usePosts()

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error.message} fullScreen />

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">投稿一覧</h1>
        <Link href="/posts/new">
          <Button>新規作成</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {data?.data.map((post) => (
          <Card key={post.id} className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.content}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline" size="sm">編集</Button>
              </Link>
              <Link href={`/posts/${post.id}/delete`}>
                <Button variant="destructive" size="sm">削除</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

```typescript
// src/features/posts/routes/posts/posts.hook.ts
import { usePosts as usePostsQuery } from '@/features/posts/api/get-posts'

export const usePosts = () => {
  const postsQuery = usePostsQuery()

  return {
    data: postsQuery.data,
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
  }
}
```

```typescript
// src/features/posts/routes/posts/index.ts
export { default } from './posts'
```

### 作成ページ(フォーム統合)

```bash
mkdir -p src/features/posts/routes/new-post
```

```typescript
// src/features/posts/routes/new-post/new-post.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { useNewPost } from './new-post.hook'

export default function NewPostPage() {
  const { register, handleSubmit, errors, isSubmitting, handleCancel } = useNewPost()

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-3xl font-bold">新規投稿</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="タイトル" error={errors.title} required>
          <Input {...register('title')} />
        </FormField>

        <FormField label="内容" error={errors.content} required>
          <textarea
            {...register('content')}
            rows={10}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </FormField>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '作成中...' : '作成'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
```

```typescript
// src/features/posts/routes/new-post/new-post.hook.ts
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePost } from '@/features/posts/api/create-post'

const postSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  content: z.string().min(1, '内容は必須です'),
})

type PostFormData = z.infer<typeof postSchema>

export const useNewPost = () => {
  const router = useRouter()
  const createPost = useCreatePost({
    mutationConfig: {
      onSuccess: () => {
        router.push('/posts')
      },
    },
  })

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  })

  const handleSubmit = handleFormSubmit(async (data: PostFormData) => {
    await createPost.mutateAsync(data)
  })

  const handleCancel = () => {
    router.back()
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleCancel,
  }
}
```

```typescript
// src/features/posts/routes/new-post/index.ts
export { default } from './new-post'
```

---

## ステップ5: Feature index.tsでエクスポート

```typescript
// src/features/posts/index.ts
export * from './api'
export * from './types'
```

---

## ステップ6: ルーティングを追加

### paths.tsに追加

```typescript
// src/config/paths.ts
export const paths = {
  // ... 既存のパス

  posts: {
    list: {
      getHref: () => '/posts',
    },
    create: {
      getHref: () => '/posts/new',
    },
    edit: {
      getHref: (id: string) => `/posts/${id}/edit`,
    },
    delete: {
      getHref: (id: string) => `/posts/${id}/delete`,
    },
  },
} as const
```

### App Routerにページを追加

```bash
mkdir -p src/app/\(sample\)/posts/{new,\[id\]/{edit,delete}}
```

```typescript
// src/app/(sample)/posts/page.tsx
import PostsPage from '@/features/posts/routes/posts'

export default function Page() {
  return <PostsPage />
}
```

```typescript
// src/app/(sample)/posts/new/page.tsx
import NewPostPage from '@/features/posts/routes/new-post'

export default function Page() {
  return <NewPostPage />
}
```

---

## ステップ7: MSWモックハンドラーを追加

```typescript
// src/mocks/handlers/api/v1/post-handlers.ts
import { http, HttpResponse, delay } from 'msw'
import type { Post } from '@/features/posts/types'

let posts: Post[] = [
  {
    id: '1',
    title: 'サンプル投稿1',
    content: 'これはサンプルの投稿内容です',
    authorId: '1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]

export const postHandlers = [
  // GET /api/v1/posts
  http.get('/api/v1/posts', async () => {
    await delay(500)
    return HttpResponse.json({ data: posts })
  }),

  // GET /api/v1/posts/:id
  http.get('/api/v1/posts/:id', ({ params }) => {
    const { id } = params
    const post = posts.find((p) => p.id === id)

    if (!post) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: post })
  }),

  // POST /api/v1/posts
  http.post('/api/v1/posts', async ({ request }) => {
    const body = await request.json()
    const newPost: Post = {
      id: String(Date.now()),
      authorId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(body as Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>),
    }

    posts.push(newPost)
    return HttpResponse.json({ data: newPost }, { status: 201 })
  }),

  // PATCH /api/v1/posts/:id
  http.patch('/api/v1/posts/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    const postIndex = posts.findIndex((p) => p.id === id)

    if (postIndex === -1) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...(body as Partial<Post>),
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({ data: posts[postIndex] })
  }),

  // DELETE /api/v1/posts/:id
  http.delete('/api/v1/posts/:id', ({ params }) => {
    const { id } = params
    posts = posts.filter((p) => p.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

```typescript
// src/mocks/handlers.ts に追加
import { postHandlers } from './handlers/api/v1/post-handlers'

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...postHandlers, // ← 追加
]
```

---

## 🎯 チェックリスト

- [ ] Featureディレクトリを作成
- [ ] 型定義を作成(`types/index.ts`)
- [ ] API関数を作成
  - [ ] 一覧取得(`get-{resource}s.ts`)
  - [ ] 個別取得(`get-{resource}.ts`)
  - [ ] 作成(`create-{resource}.ts`)
  - [ ] 更新(`update-{resource}.ts`)
  - [ ] 削除(`delete-{resource}.ts`)
  - [ ] `api/index.ts`でエクスポート
- [ ] ルート(ページ)コンポーネントを作成
  - [ ] 一覧ページ(`routes/posts/`)
  - [ ] 作成ページ(`routes/new-post/`)
  - [ ] 編集ページ(`routes/edit-post/`, 必要なら)
  - [ ] 削除ページ(`routes/delete-post/`, 必要なら)
  - [ ] 各ルートにカスタムフック(`.hook.ts`)を作成
- [ ] `features/{resource}/index.ts`でエクスポート
- [ ] `paths.ts`にルート追加
- [ ] App Routerにページ追加
- [ ] MSWハンドラーを追加
- [ ] 動作確認

---

## 参考リンク

- [プロジェクト構造](../02-architecture/01-project-structure.md)
- [API関数作成](./02-create-api.md)
- [コンポーネント作成](./01-create-component.md)
- [ページ追加](./04-add-page.md)
- [フォーム作成](./05-add-form.md)
