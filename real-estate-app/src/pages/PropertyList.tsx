import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { PropertyForm } from '../components/PropertyForm'
import type { Property, PropertyInput } from '../types/property'

// フォームの表示状態: 非表示 / 新規登録 / 編集中の物件
type FormState = 'none' | 'create' | Property

export function PropertyList() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<FormState>('none')

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)

    // RLSにより自分が登録した物件のみが返ってくる
    const { data, error: fetchError } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setProperties(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const handleCreate = async (input: PropertyInput) => {
    if (!session) return

    const { error: insertError } = await supabase
      .from('properties')
      .insert({ ...input, user_id: session.user.id })

    if (insertError) throw new Error(insertError.message)

    setFormState('none')
    await fetchProperties()
  }

  const handleUpdate = async (id: string, input: PropertyInput) => {
    const { error: updateError } = await supabase.from('properties').update(input).eq('id', id)

    if (updateError) throw new Error(updateError.message)

    setFormState('none')
    await fetchProperties()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error: deleteError } = await supabase.from('properties').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await fetchProperties()
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{session?.user.email} でログイン中</p>
        </div>
        <div className="property-header-actions">
          <button onClick={() => setFormState('create')}>新規登録</button>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p>登録されている物件はありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">家賃: {property.rent.toLocaleString()}円</p>
              <p className="property-area">エリア: {property.area}</p>
              <p className="property-layout">間取り: {property.layout}</p>
              <div className="property-card-actions">
                <button onClick={() => setFormState(property)}>編集</button>
                <button onClick={() => handleDelete(property.id)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formState === 'create' && (
        <PropertyForm submitLabel="新規登録" onSubmit={handleCreate} onCancel={() => setFormState('none')} />
      )}

      {formState !== 'none' && formState !== 'create' && (
        <PropertyForm
          initialValue={formState}
          submitLabel="更新"
          onSubmit={(input) => handleUpdate(formState.id, input)}
          onCancel={() => setFormState('none')}
        />
      )}
    </div>
  )
}
