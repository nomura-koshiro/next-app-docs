# Prettier設定

Prettierはコードフォーマッターとして、一貫したコードスタイルを自動的に適用します。

## 目次

1. [基本設定](#基本設定)
2. [セミコロンの使用](#1-セミコロンの使用)
3. [末尾カンマ](#2-末尾カンマ)
4. [クォートのスタイル](#3-クォートのスタイル)
5. [1行の最大文字数](#4-1行の最大文字数)
6. [インデント幅](#5-インデント幅)
7. [タブ文字の使用](#6-タブ文字の使用)
8. [アロー関数の引数の括弧](#7-アロー関数の引数の括弧)
9. [改行コード](#8-改行コード)

---

## 基本設定

```javascript
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'auto',
};
```

---

## 1. セミコロンの使用

```javascript
semi: true
```

### 設定の効果

ステートメントの末尾に常にセミコロンを追加します。

### ❌ `semi: false` の場合

```typescript
const user = getUser()
const name = user.name
console.log(name)
```

### ✅ `semi: true` の場合

```typescript
const user = getUser();
const name = user.name;
console.log(name);
```

### なぜセミコロンを使用するのか

1. **明示性**: ステートメントの終わりが明確
2. **ASI（自動セミコロン挿入）の問題回避**: セミコロン省略時の予期しない動作を防ぐ
3. **TypeScriptの慣習**: TypeScriptコミュニティではセミコロン使用が一般的

---

## 2. 末尾カンマ

```javascript
trailingComma: 'es5'
```

### 設定の効果

ES5で有効な箇所（オブジェクト、配列など）に末尾カンマを追加します。関数の引数には追加しません。

### ✅ 有効な箇所

```typescript
// オブジェクト
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com', // 末尾カンマ
};

// 配列
const numbers = [
  1,
  2,
  3, // 末尾カンマ
];

// import文
import {
  useState,
  useEffect,
  useCallback, // 末尾カンマ
} from 'react';
```

### ❌ 追加されない箇所

```typescript
// 関数の引数（ES5では無効）
const sum = (
  a: number,
  b: number // 末尾カンマなし
) => a + b;
```

### なぜES5スタイルの末尾カンマなのか

1. **差分の明瞭性**: 新しい行を追加した時の差分が1行だけになる
2. **バージョン管理**: gitの差分が読みやすくなる
3. **互換性**: 古いブラウザでも安全（関数引数には追加しない）

### 差分の例

```diff
// 末尾カンマなしの場合
const config = {
  apiUrl: 'https://api.example.com',
- timeout: 3000
+ timeout: 3000,
+ retries: 3
};

// 末尾カンマありの場合
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 3000,
+ retries: 3,
};
```

---

## 3. クォートのスタイル

```javascript
singleQuote: true
```

### 設定の効果

文字列にシングルクォートを使用します。

### ❌ `singleQuote: false` の場合

```typescript
const message = "Hello, world!";
const greeting = "こんにちは";
```

### ✅ `singleQuote: true` の場合

```typescript
const message = 'Hello, world!';
const greeting = 'こんにちは';
```

### 例外：JSX

```tsx
// JSXの属性ではダブルクォートを使用（Prettier標準）
const Component = () => {
  return <div className="container" data-testid="main">Content</div>;
};
```

### なぜシングルクォートなのか

1. **視覚的なノイズ削減**: シングルクォートの方が目立たない
2. **JavaScript慣習**: JavaScriptコミュニティではシングルクォートが主流
3. **タイプ数**: シフトキーが不要（一部のキーボード配列）

---

## 4. 1行の最大文字数

```javascript
printWidth: 140
```

### 設定の効果

1行が140文字を超える場合、自動的に改行します。

### Before（長い行）

```typescript
const result = await fetchUserData(userId).then((data) => processUserData(data)).then((processed) => validateData(processed)).catch((error) => handleError(error));
```

### After（140文字で改行）

```typescript
const result = await fetchUserData(userId)
  .then((data) => processUserData(data))
  .then((processed) => validateData(processed))
  .catch((error) => handleError(error));
```

### なぜ140文字なのか

1. **可読性**: 横スクロールなしで読める（フルHD以上のモニター）
2. **コードレビュー**: GitHubなどのレビュー画面でも読みやすい
3. **バランス**: 80文字（従来の標準）では短すぎ、無制限では長すぎる

---

## 5. インデント幅

```javascript
tabWidth: 2
```

### 設定の効果

インデントは2スペースで統一します。

### ✅ 2スペースインデント

```typescript
const fetchData = async () => {
  await fetch('/api/data')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed');
      }

      return response.json();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    })
};
```

### なぜ2スペースなのか

1. **JavaScript/TypeScript慣習**: 2スペースがデファクトスタンダード
2. **ネストの深さ**: Reactコンポーネントなどでネストが深くなる場合も読みやすい
3. **画面の有効活用**: 4スペースより横幅を取らない

---

## 6. タブ文字の使用

```javascript
useTabs: false
```

### 設定の効果

タブ文字ではなくスペースを使用します。

### なぜスペースなのか

1. **一貫性**: すべてのエディタで同じ見た目になる
2. **差分の明確性**: スペースの方がgit diffで見やすい
3. **Web標準**: Webフロントエンドではスペースが一般的

---

## 7. アロー関数の引数の括弧

```javascript
arrowParens: 'always'
```

### 設定の効果

アロー関数の引数が1つでも常に括弧で囲みます。

### ❌ `arrowParens: 'avoid'` の場合

```typescript
const double = n => n * 2;
const greet = name => `Hello, ${name}`;
```

### ✅ `arrowParens: 'always'` の場合

```typescript
const double = (n) => n * 2;
const greet = (name) => `Hello, ${name}`;
```

### なぜ常に括弧を使用するのか

1. **一貫性**: 引数の数が変わっても書き方が変わらない
2. **型注釈**: TypeScriptで型を追加する際に括弧が必要
3. **可読性**: 引数であることが明確

### 引数追加時の差分

```diff
// 括弧なしの場合
- const greet = name => `Hello, ${name}`;
+ const greet = (name, age) => `Hello, ${name}, ${age}`;

// 括弧ありの場合
- const greet = (name) => `Hello, ${name}`;
+ const greet = (name, age) => `Hello, ${name}, ${age}`;
```

---

## 8. 改行コード

```javascript
endOfLine: 'auto'
```

### 設定の効果

既存ファイルの改行コードを維持します。新規ファイルはOSのデフォルトを使用します。

### なぜautoなのか

1. **クロスプラットフォーム**: Windows（CRLF）とUnix（LF）の両方に対応
2. **Gitとの連携**: `.gitattributes`でline ending設定がある場合はそちらを優先
3. **柔軟性**: チーム開発で異なるOSを使用していても問題なし

---

## フォーマット例

以下は、上記の設定を適用した実際のコード例です：

```typescript
// Prettierによるフォーマット結果

// シングルクォート
const message = 'Hello, World!';

// トレイリングカンマ（ES5）
const user = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com', // ← カンマあり
};

// 括弧内のスペース
const obj = { key: 'value' }; // ← スペースあり

// アロー関数の引数を括弧で囲む
const double = (x) => x * 2; // ← 引数が1つでも括弧

// 140文字で自動改行
const longFunction = (param1, param2, param3, param4) => {
  return processData(param1, param2, param3, param4);
};

// セミコロン使用
const result = calculate();
console.log(result);
```

---

## 設定ファイル

`.prettierrc.config.mjs`:

```javascript
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'auto',
};
```

---

## 関連リンク

- [ESLint設定](./01-eslint.md) - ESLintの詳細設定
- [Stylelint設定](./03-stylelint.md) - CSSのフォーマット設定
- [コマンド・IDE統合](./04-commands-ide.md) - Prettierの実行方法
- [Prettier公式ドキュメント](https://prettier.io/) - 公式ドキュメント
