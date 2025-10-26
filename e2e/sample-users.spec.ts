import { expect, test } from '@playwright/test';

/**
 * ユーザー管理機能のE2Eテスト
 *
 * このテストは、MSWモックを使用してAPIをモックしています。
 * 実際のバックエンドAPIに接続する場合は、環境変数を設定してください。
 */

test.describe('ユーザー管理', () => {
  test.beforeEach(async ({ page }) => {
    // ユーザー一覧ページに遷移
    await page.goto('/sample-users');
  });

  test('ユーザー一覧が表示される', async ({ page }) => {
    // ユーザーが表示されることを確認
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('Bob Johnson')).toBeVisible();
  });

  test('新規ユーザーを作成できる', async ({ page }) => {
    // 新規作成ボタンをクリック
    await page.getByRole('button', { name: '新規作成' }).click();

    // フォームに入力
    await page.getByLabel('名前').fill('Test User');
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('ロール').selectOption('user');

    // 作成ボタンをクリック
    await page.getByRole('button', { name: '作成' }).click();

    // 一覧ページにリダイレクトされることを確認
    await expect(page).toHaveURL('/sample-users');

    // 新しいユーザーが表示されることを確認
    await expect(page.getByText('Test User')).toBeVisible();
  });

  test('ユーザーを編集できる', async ({ page }) => {
    // 編集ボタンをクリック
    await page.getByRole('button', { name: '編集' }).first().click();

    // フォームに入力
    await page.getByLabel('名前').fill('Updated Name');

    // 更新ボタンをクリック
    await page.getByRole('button', { name: '更新' }).click();

    // 一覧ページにリダイレクトされることを確認
    await expect(page).toHaveURL('/sample-users');

    // 更新されたユーザーが表示されることを確認
    await expect(page.getByText('Updated Name')).toBeVisible();
  });

  test('ユーザーを削除できる', async ({ page }) => {
    // 削除対象のユーザー名を取得
    const userName = await page.getByText('John Doe').textContent();

    // 削除ボタンをクリック
    await page.getByRole('button', { name: '削除' }).first().click();

    // 確認ダイアログでOKをクリック
    page.on('dialog', (dialog) => dialog.accept());

    // ユーザーが削除されたことを確認
    if (userName) {
      await expect(page.getByText(userName)).not.toBeVisible();
    }
  });

  test('検索機能が動作する', async ({ page }) => {
    // 検索フォームに入力
    await page.getByPlaceholder('検索').fill('John');

    // 検索結果が表示されることを確認
    await expect(page.getByText('John Doe')).toBeVisible();

    // 他のユーザーが非表示になることを確認
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('ページネーションが動作する', async ({ page }) => {
    // 2ページ目に遷移
    await page.getByRole('button', { name: '次へ' }).click();

    // URLが更新されることを確認
    await expect(page).toHaveURL(/page=2/);

    // 1ページ目に戻る
    await page.getByRole('button', { name: '前へ' }).click();

    // URLが更新されることを確認
    await expect(page).toHaveURL(/page=1/);
  });
});
