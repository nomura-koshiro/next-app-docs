# 新しいFeature作成手順

このガイドでは、新しいFeature（機能モジュール）を作成する手順を説明します。

## 📋 完成イメージ

```
src/features/posts/
├── api/
│   ├── get-posts.ts
│   ├── get-post.ts
│   ├── create-post.ts
│   ├── update-post.ts
│   ├── delete-post.ts
│   └── index.ts
├── components/
│   ├── posts-page/
│   ├── new-post-page/
│   ├── edit-post-page/
│   └── delete-post-page/
├── types/
│   └── index.ts
└── index.ts
```

---

## ステップ1: Featureディレクトリを作成

```bash
# 新しいFeatureディレクトリを作成
mkdir -p src/features/posts/{api,components,types}
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

## ステップ4: コンポーネントを作成

### 一覧ページ

```bash
mkdir -p src/features/posts/components/posts-page
```

```typescript
// src/features/posts/components/posts-page/posts-page.tsx
'use client'

import Link from 'next/link'
import { usePosts } from '@/features/posts/api/get-posts'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const PostsPage = () => {
  const { data, isLoading, error } = usePosts()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

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
// src/features/posts/components/posts-page/index.ts
export { PostsPage } from './posts-page'
```

### 作成ページ（フォーム統合）

```bash
mkdir -p src/features/posts/components/new-post-page
```

```typescript
// src/features/posts/components/new-post-page/new-post-page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePost } from '@/features/posts/api/create-post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'

const postSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  content: z.string().min(1, '内容は必須です'),
})

type PostFormData = z.infer<typeof postSchema>

export const NewPostPage = () => {
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
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = async (data: PostFormData) => {
    await createPost.mutateAsync(data)
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-3xl font-bold">新規投稿</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
```

```typescript
// src/features/posts/components/new-post-page/index.ts
export { NewPostPage } from './new-post-page'
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
import { PostsPage } from '@/features/posts/components/posts-page'

export default function Page() {
  return <PostsPage />
}
```

```typescript
// src/app/(sample)/posts/new/page.tsx
import { NewPostPage } from '@/features/posts/components/new-post-page'

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
- [ ] 型定義を作成（`types/index.ts`）
- [ ] API関数を作成
  - [ ] 一覧取得（`get-{resource}s.ts`）
  - [ ] 個別取得（`get-{resource}.ts`）
  - [ ] 作成（`create-{resource}.ts`）
  - [ ] 更新（`update-{resource}.ts`）
  - [ ] 削除（`delete-{resource}.ts`）
  - [ ] `api/index.ts`でエクスポート
- [ ] コンポーネントを作成
  - [ ] 一覧ページ
  - [ ] 作成ページ
  - [ ] 編集ページ（必要なら）
  - [ ] 削除ページ（必要なら）
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
