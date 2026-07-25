import { useState } from 'react'
import type { FormEvent } from 'react'
import type { PropertyInput } from '../types/property'

interface PropertyFormProps {
  initialValue?: PropertyInput
  submitLabel: string
  onSubmit: (input: PropertyInput) => Promise<void>
  onCancel: () => void
}

// 物件の新規登録・編集で共通して使うフォーム
export function PropertyForm({ initialValue, submitLabel, onSubmit, onCancel }: PropertyFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [rent, setRent] = useState(initialValue?.rent.toString() ?? '')
  const [area, setArea] = useState(initialValue?.area ?? '')
  const [layout, setLayout] = useState(initialValue?.layout ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const rentNumber = Number(rent)
    if (!name || !area || !layout || Number.isNaN(rentNumber) || rentNumber < 0) {
      setError('すべての項目を正しく入力してください')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ name, rent: rentNumber, area, layout })
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <form className="property-form" onSubmit={handleSubmit}>
        <h2>{submitLabel}</h2>

        <label htmlFor="name">物件名</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="rent">家賃（円）</label>
        <input
          id="rent"
          type="number"
          min={0}
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />

        <label htmlFor="area">エリア名</label>
        <input id="area" value={area} onChange={(e) => setArea(e.target.value)} required />

        <label htmlFor="layout">間取り</label>
        <input
          id="layout"
          placeholder="例: 1LDK"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? '保存中...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
