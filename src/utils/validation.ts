/**
 * バリデーションユーティリティ
 * 各種データ形式のバリデーション関数
 */

/**
 * メールアドレスの形式をチェック
 * @param email - チェックするメールアドレス
 * @returns 有効な場合true
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

/**
 * URLの形式をチェック
 * @param url - チェックするURL
 * @returns 有効な場合true
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)

    return true
  } catch {
    return false
  }
}

/**
 * 日本の電話番号の形式をチェック
 * @param phoneNumber - チェックする電話番号
 * @returns 有効な場合true
 * @example
 * isValidPhoneNumber('090-1234-5678') // true
 * isValidPhoneNumber('09012345678') // true
 * isValidPhoneNumber('invalid') // false
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '')

  // 固定電話（10桁）または携帯電話（11桁）
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * 日本の郵便番号の形式をチェック
 * @param postalCode - チェックする郵便番号
 * @returns 有効な場合true
 * @example
 * isValidPostalCode('123-4567') // true
 * isValidPostalCode('1234567') // true
 * isValidPostalCode('invalid') // false
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  const cleaned = postalCode.replace(/\D/g, '')

  return cleaned.length === 7
}

/**
 * パスワードの強度をチェック
 * @param password - チェックするパスワード
 * @returns 強度レベル（0-4）
 * @example
 * getPasswordStrength('abc') // 0
 * getPasswordStrength('abc123') // 1
 * getPasswordStrength('Abc123') // 2
 * getPasswordStrength('Abc123!') // 3
 * getPasswordStrength('Abc123!@#$') // 4
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0

  // 最低8文字
  if (password.length >= 8) strength++

  // 小文字を含む
  if (/[a-z]/.test(password)) strength++

  // 大文字を含む
  if (/[A-Z]/.test(password)) strength++

  // 数字を含む
  if (/[0-9]/.test(password)) strength++

  // 特殊文字を含む
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  // 最低3つの条件を満たす必要がある
  if (strength < 3) return 0

  return Math.min(strength - 2, 4)
}

/**
 * パスワードの強度が十分かチェック
 * @param password - チェックするパスワード
 * @param minStrength - 最低強度（デフォルト: 2）
 * @returns 十分な強度の場合true
 * @example
 * isStrongPassword('Abc123!') // true
 * isStrongPassword('abc123') // false
 */
export const isStrongPassword = (password: string, minStrength = 2): boolean => {
  return getPasswordStrength(password) >= minStrength
}

/**
 * クレジットカード番号をLuhnアルゴリズムでチェック
 * @param cardNumber - チェックするカード番号
 * @returns 有効な場合true
 * @example
 * isValidCreditCard('4532015112830366') // true
 * isValidCreditCard('1234567890123456') // false
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '')

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * 数値が範囲内かチェック
 * @param value - チェックする数値
 * @param min - 最小値
 * @param max - 最大値
 * @returns 範囲内の場合true
 * @example
 * isInRange(5, 1, 10) // true
 * isInRange(15, 1, 10) // false
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * 文字列が空白のみかチェック
 * @param text - チェックする文字列
 * @returns 空白のみの場合true
 * @example
 * isBlank('   ') // true
 * isBlank('  text  ') // false
 */
export const isBlank = (text: string): boolean => {
  return text.trim().length === 0
}

/**
 * オブジェクトが空かチェック
 * @param obj - チェックするオブジェクト
 * @returns 空の場合true
 * @example
 * isEmpty({}) // true
 * isEmpty({ key: 'value' }) // false
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * 配列が空かチェック
 * @param array - チェックする配列
 * @returns 空の場合true
 * @example
 * isEmptyArray([]) // true
 * isEmptyArray([1, 2, 3]) // false
 */
export const isEmptyArray = <T>(array: T[]): boolean => {
  return array.length === 0
}

/**
 * 値がnullまたはundefinedかチェック
 * @param value - チェックする値
 * @returns nullまたはundefinedの場合true
 * @example
 * isNullOrUndefined(null) // true
 * isNullOrUndefined(undefined) // true
 * isNullOrUndefined(0) // false
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}

/**
 * ひらがなのみかチェック
 * @param text - チェックする文字列
 * @returns ひらがなのみの場合true
 * @example
 * isHiragana('ひらがな') // true
 * isHiragana('ひらがなカタカナ') // false
 */
export const isHiragana = (text: string): boolean => {
  return /^[\u3040-\u309F]+$/.test(text)
}

/**
 * カタカナのみかチェック
 * @param text - チェックする文字列
 * @returns カタカナのみの場合true
 * @example
 * isKatakana('カタカナ') // true
 * isKatakana('カタカナひらがな') // false
 */
export const isKatakana = (text: string): boolean => {
  return /^[\u30A0-\u30FF]+$/.test(text)
}

/**
 * 数値文字列かチェック
 * @param text - チェックする文字列
 * @returns 数値文字列の場合true
 * @example
 * isNumericString('12345') // true
 * isNumericString('123.45') // true
 * isNumericString('abc') // false
 */
export const isNumericString = (text: string): boolean => {
  return !isNaN(Number(text)) && text.trim() !== ''
}

/**
 * 英数字のみかチェック
 * @param text - チェックする文字列
 * @returns 英数字のみの場合true
 * @example
 * isAlphanumeric('abc123') // true
 * isAlphanumeric('abc-123') // false
 */
export const isAlphanumeric = (text: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(text)
}
