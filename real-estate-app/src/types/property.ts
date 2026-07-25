// propertiesテーブルの行を表す型
export interface Property {
  id: string
  user_id: string
  name: string
  rent: number
  area: string
  layout: string
  created_at: string
}

// 新規登録・編集フォームで扱う入力値の型
export interface PropertyInput {
  name: string
  rent: number
  area: string
  layout: string
}
