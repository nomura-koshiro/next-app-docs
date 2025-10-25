# React 19 機能活用 - 改善タスクリスト

**作成日**: 2025-01-XX
**対象**: FastAPI + TanStack Query + React 19 構成の最適化

---

## 📋 改善タスク概要

このドキュメントは、React 19の新機能（useOptimistic、useTransition）を活用して、
ユーザー体験を向上させるための改善タスクをまとめたものです。

---

## 🎯 改善目標

- チャット機能のレスポンス速度向上（体感）
- ユーザー削除操作の即座のフィードバック
- ページ遷移時のスムーズな体験
- FastAPIのレスポンス遅延を感じさせないUI

---

## ✅ タスクリスト

### 🟢 優先度: 最高（Phase 1）

#### Task 1: useOptimistic をチャット機能に追加

**目的**: メッセージ送信時の即座のUI反映

**対象ファイル**:
- `src/features/sample-chat/routes/sample-chat/sample-chat.hook.ts`

**実装内容**:
- useOptimistic フックを導入
- ユーザーメッセージの楽観的更新
- エラー時の自動ロールバック

**期待効果**:
- メッセージ送信が即座に画面に反映
- チャットアプリのような滑らかなUX
- FastAPIのレスポンス待ちを感じさせない

**工数**: 30分〜1時間

**テスト項目**:
- [ ] メッセージ送信時に即座にUI更新される
- [ ] FastAPIからのレスポンスが正しく反映される
- [ ] エラー時に楽観的更新がロールバックされる
- [ ] 連続送信が正しく動作する

---

#### Task 2: useOptimistic をユーザー削除に追加

**目的**: ユーザー削除操作の即座のフィードバック

**対象ファイル**:
- `src/features/sample-users/routes/sample-users/users.hook.ts`

**実装内容**:
- useOptimistic フックを導入
- ユーザーリストからの楽観的削除
- エラー時の自動ロールバック

**期待効果**:
- 削除ボタンを押した瞬間にUIから消える
- FastAPIの削除処理を待たずに次の操作が可能
- エラー時は元に戻る

**工数**: 30分

**テスト項目**:
- [ ] 削除ボタン押下時に即座にリストから消える
- [ ] FastAPIの削除が成功する
- [ ] エラー時にユーザーが元に戻る
- [ ] TanStack Queryのキャッシュが正しく更新される

---

### 🟡 優先度: 高（Phase 2）

#### Task 3: useTransition でナビゲーション改善

**目的**: ページ遷移時のノンブロッキング処理

**対象ファイル**:
- `src/features/sample-users/routes/sample-new-user/new-user.hook.ts`
- `src/features/sample-users/routes/sample-edit-user/edit-user.hook.ts`
- `src/features/sample-auth/routes/sample-login/login.hook.ts`

**実装内容**:
- useTransition フックを導入
- router.push をstartTransitionでラップ
- isPending状態の反映

**期待効果**:
- ナビゲーション中もUIが応答性を保つ
- 大量データの画面遷移がスムーズ
- ユーザーがブロックされない

**工数**: 2〜3時間

**テスト項目**:
- [ ] フォーム送信後のナビゲーションがスムーズ
- [ ] 遷移中にUIが応答する
- [ ] ローディング状態が正しく表示される

---

#### Task 4: useOptimistic をファイルアップロードに追加

**目的**: ファイルアップロード開始時の即座のフィードバック

**対象ファイル**:
- `src/features/sample-file/routes/sample-file/sample-file.hook.ts`

**実装内容**:
- useOptimistic フックを導入
- ファイルリストへの楽観的追加
- プログレス更新との統合

**期待効果**:
- ファイル選択後、即座にリストに表示
- アップロード進行状況がリアルタイム更新
- エラー時の適切なハンドリング

**工数**: 1〜2時間

**テスト項目**:
- [ ] ファイル選択後、即座にリストに表示される
- [ ] プログレスバーが正しく更新される
- [ ] アップロード成功時のステータス更新
- [ ] エラー時のステータス表示

---

### 🔵 優先度: 中（Phase 3）

#### Task 5: ドキュメント更新

**目的**: React 19の新機能使用方法をドキュメント化

**対象ファイル**:
- `docs/04-development/01-coding-standards/07-react-nextjs-rules.md`
- `docs/04-development/05-custom-hooks/03-data-hooks.md`
- 新規: `docs/04-development/09-react19-features/01-use-optimistic.md`
- 新規: `docs/04-development/09-react19-features/02-use-transition.md`

**実装内容**:
- useOptimistic の使用方法とベストプラクティス
- useTransition の使用方法とベストプラクティス
- useフックの詳細説明
- FastAPI連携時の注意点

**期待効果**:
- 開発者が新機能を正しく理解できる
- 実装パターンの統一
- 保守性の向上

**工数**: 3〜4時間

**タスク項目**:
- [ ] useOptimistic のドキュメント作成
- [ ] useTransition のドキュメント作成
- [ ] useフックの説明追加
- [ ] 既存ドキュメントの更新

---

## 📈 実装スケジュール

### Phase 1（最優先 - 1日目）
1. Task 1: useOptimistic をチャット機能に追加（30分〜1時間）
2. Task 2: useOptimistic をユーザー削除に追加（30分）
3. テスト・動作確認（30分）

**合計工数**: 2〜2.5時間

### Phase 2（高優先 - 2日目）
1. Task 3: useTransition でナビゲーション改善（2〜3時間）
2. Task 4: useOptimistic をファイルアップロードに追加（1〜2時間）
3. テスト・動作確認（1時間）

**合計工数**: 4〜6時間

### Phase 3（ドキュメント - 3日目）
1. Task 5: ドキュメント更新（3〜4時間）

**合計工数**: 3〜4時間

---

## 🧪 テスト計画

### 単体テスト
- 各フックの動作確認
- 楽観的更新のロジック検証
- エラーハンドリングの確認

### 統合テスト
- FastAPI連携の動作確認
- TanStack Queryキャッシュとの整合性
- 複数操作の連続実行

### E2Eテスト（Playwright）
- チャット機能の送信フロー
- ユーザー削除フロー
- フォーム送信〜遷移フロー
- ファイルアップロードフロー

---

## 📝 実装ガイドライン

### useOptimistic 使用時の注意点

1. **状態の型安全性**
   - useOptimisticの型パラメータを明示的に指定
   - 楽観的更新の関数は純粋関数にする

2. **エラーハンドリング**
   - try-catch で適切にエラーをキャッチ
   - エラー時は楽観的更新が自動ロールバックされることを理解

3. **TanStack Query との統合**
   - Mutation成功時にqueryClient.invalidateQueriesを実行
   - 楽観的更新とキャッシュ更新のタイミングに注意

### useTransition 使用時の注意点

1. **ナビゲーションのタイミング**
   - Mutation成功後にstartTransitionでラップ
   - isPending状態をUIに反映

2. **ローディング状態の管理**
   - Mutation のisPendingとTransitionのisPendingを併用
   - ユーザーに適切なフィードバックを提供

---

## 🎯 成功基準

### パフォーマンス
- [ ] チャットメッセージ送信のUI反映が100ms以内
- [ ] ユーザー削除のUI反映が即座（<50ms）
- [ ] ページ遷移がノンブロッキング

### ユーザー体験
- [ ] 操作が即座にフィードバックされる
- [ ] FastAPIのレスポンス遅延を感じさせない
- [ ] エラー時も適切なフィードバック

### コード品質
- [ ] 型安全性が保たれている
- [ ] エラーハンドリングが適切
- [ ] ドキュメントが整備されている
- [ ] テストが通過する

---

## 🔄 ロールバック計画

各Taskは独立しているため、問題が発生した場合は個別にロールバック可能です。

### ロールバック手順
1. 該当ファイルをgit revertで戻す
2. pnpm run check で確認
3. pnpm run build で動作確認

---

## 📚 参考リソース

- [React 19 - useOptimistic](https://react.dev/reference/react/useOptimistic)
- [React 19 - useTransition](https://react.dev/reference/react/useTransition)
- [React 19 - use](https://react.dev/reference/react/use)
- [TanStack Query - Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

---

## ✅ 完了チェックリスト

### Phase 1
- [ ] Task 1: チャット機能の実装完了
- [ ] Task 2: ユーザー削除の実装完了
- [ ] Phase 1のテスト完了
- [ ] コミット・プッシュ完了

### Phase 2
- [ ] Task 3: ナビゲーション改善完了
- [ ] Task 4: ファイルアップロード改善完了
- [ ] Phase 2のテスト完了
- [ ] コミット・プッシュ完了

### Phase 3
- [ ] Task 5: ドキュメント更新完了
- [ ] レビュー・校正完了
- [ ] コミット・プッシュ完了

---

**最終更新**: 2025-01-XX
**ステータス**: 準備完了 ✅
