# 複雑なフォーム

ネストしたオブジェクト構造や配列フィールドを持つ複雑なフォームの実装方法を説明します。

---

## ネストしたフィールド

### スキーマ定義

```typescript
import { z } from 'zod'

export const profileSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "名は必須です"),
    lastName: z.string().min(1, "姓は必須です"),
  }),
  contact: z.object({
    email: z.string().email("正しいメールアドレスを入力してください"),
    phone: z.string().regex(/^\d{10,11}$/, "正しい電話番号を入力してください"),
    address: z.object({
      postalCode: z.string().regex(/^\d{7}$/, "7桁の郵便番号を入力してください"),
      city: z.string().min(1, "市区町村は必須です"),
      street: z.string().min(1, "番地は必須です"),
    }).optional(),
  }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
```

### フォーム実装

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 個人情報 */}
      <h3>個人情報</h3>
      <input {...register('personalInfo.firstName')} placeholder="名" />
      {errors.personalInfo?.firstName && (
        <p>{errors.personalInfo.firstName.message}</p>
      )}

      <input {...register('personalInfo.lastName')} placeholder="姓" />
      {errors.personalInfo?.lastName && (
        <p>{errors.personalInfo.lastName.message}</p>
      )}

      {/* 連絡先 */}
      <h3>連絡先</h3>
      <input {...register('contact.email')} placeholder="メールアドレス" />
      {errors.contact?.email && <p>{errors.contact.email.message}</p>}

      <input {...register('contact.phone')} placeholder="電話番号" />
      {errors.contact?.phone && <p>{errors.contact.phone.message}</p>}

      {/* 住所（オプショナル） */}
      <h3>住所</h3>
      <input {...register('contact.address.postalCode')} placeholder="郵便番号" />
      {errors.contact?.address?.postalCode && (
        <p>{errors.contact.address.postalCode.message}</p>
      )}

      <input {...register('contact.address.city')} placeholder="市区町村" />
      {errors.contact?.address?.city && (
        <p>{errors.contact.address.city.message}</p>
      )}

      <input {...register('contact.address.street')} placeholder="番地" />
      {errors.contact?.address?.street && (
        <p>{errors.contact.address.street.message}</p>
      )}

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## 配列フィールド

### スキーマ定義

```typescript
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "説明は必須です"),
        completed: z.boolean().default(false),
      })
    )
    .min(1, '少なくとも1つのアイテムを追加してください'),
})

export type TaskFormValues = z.infer<typeof taskSchema>
```

### useFieldArrayを使った実装

```typescript
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const TaskForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      items: [{ description: '', completed: false }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const onSubmit = (data: TaskFormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>タイトル</label>
        <input {...register('title')} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <h3>アイテム</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 mb-2">
          <input
            {...register(`items.${index}.description`)}
            placeholder="説明"
          />
          {errors.items?.[index]?.description && (
            <p>{errors.items[index]?.description?.message}</p>
          )}

          <label>
            <input type="checkbox" {...register(`items.${index}.completed`)} />
            完了
          </label>

          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            削除
          </button>
        </div>
      ))}

      {errors.items && <p>{errors.items.message}</p>}

      <button
        type="button"
        onClick={() => append({ description: '', completed: false })}
      >
        アイテムを追加
      </button>

      <button type="submit">送信</button>
    </form>
  )
}
```

---

## 複雑な配列（オブジェクトのネスト）

### スキーマ定義

```typescript
import { z } from 'zod'

export const orderSchema = z.object({
  customerName: z.string().min(1),
  items: z
    .array(
      z.object({
        productName: z.string().min(1, "商品名は必須です"),
        quantity: z.number().min(1, "数量は1以上必要です"),
        price: z.number().min(0, "価格は0以上必要です"),
        options: z
          .array(
            z.object({
              name: z.string(),
              value: z.string(),
            })
          )
          .optional(),
      })
    )
    .min(1, '少なくとも1つの商品を追加してください'),
})

export type OrderFormValues = z.infer<typeof orderSchema>
```

### フォーム実装

```typescript
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const OrderForm = () => {
  const { register, control, handleSubmit, watch } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      items: [{ productName: '', quantity: 1, price: 0, options: [] }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const items = watch('items')

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <div>
        <label>顧客名</label>
        <input {...register('customerName')} />
      </div>

      <h3>商品</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 mb-4">
          <input
            {...register(`items.${index}.productName`)}
            placeholder="商品名"
          />

          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            placeholder="数量"
          />

          <input
            type="number"
            {...register(`items.${index}.price`, { valueAsNumber: true })}
            placeholder="価格"
          />

          <p>小計: {items[index]?.quantity * items[index]?.price || 0}円</p>

          <button type="button" onClick={() => remove(index)}>
            削除
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({ productName: '', quantity: 1, price: 0, options: [] })
        }
      >
        商品を追加
      </button>

      <div className="mt-4">
        <strong>合計: {calculateTotal()}円</strong>
      </div>

      <button type="submit">注文を確定</button>
    </form>
  )
}
```

---

## ネストした配列のバリデーション

### 各アイテムのバリデーション

```typescript
items: z
  .array(
    z.object({
      name: z.string().min(1, "名前は必須です"),
      quantity: z.number().min(1, "1以上の数値を入力してください"),
    })
  )
  .min(1, "少なくとも1つのアイテムが必要です")
  .max(10, "アイテムは最大10個までです")
```

### カスタムバリデーション

```typescript
items: z
  .array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  )
  .refine(
    (items) => items.reduce((sum, item) => sum + item.quantity * item.price, 0) <= 100000,
    {
      message: "合計金額は100,000円以下にしてください",
    }
  )
```

---

## useFieldArrayのメソッド

| メソッド | 説明 |
|---------|------|
| `fields` | フィールドの配列 |
| `append(value)` | 末尾に追加 |
| `prepend(value)` | 先頭に追加 |
| `insert(index, value)` | 指定位置に挿入 |
| `remove(index)` | 指定位置を削除 |
| `swap(indexA, indexB)` | 位置を入れ替え |
| `move(from, to)` | 移動 |
| `update(index, value)` | 更新 |

---

## 関連リンク

- [バリデーションルール](./02-validation-rules.md) - 配列のバリデーション
- [動的バリデーション](./06-dynamic-validation.md) - 条件に応じたバリデーション
- [React Hook Form - useFieldArray](https://react-hook-form.com/docs/usefieldarray) - 公式ドキュメント
