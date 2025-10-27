/**
 * ユーザーロール型
 */
export type UserRole = 'user' | 'admin' | 'guest';

/**
 * ユーザー型
 *
 * アプリケーション全体で使用する統一User型定義
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

/**
 * 新規ユーザー作成用のDTO
 */
export type CreateUserDTO = {
  name: string;
  email: string;
  role: UserRole;
};

/**
 * ユーザー更新用のDTO
 */
export type UpdateUserDTO = Partial<CreateUserDTO>;
