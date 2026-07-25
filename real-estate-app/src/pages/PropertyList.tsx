import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Property {
  id: number
  name: string
  rent: number
  area: string
}

// ダミーの物件データ
const dummyProperties: Property[] = [
  { id: 1, name: 'サンライトマンション101', rent: 85000, area: '東京都渋谷区' },
  { id: 2, name: 'グリーンハイツ203', rent: 62000, area: '東京都世田谷区' },
  { id: 3, name: 'パークサイドレジデンス305', rent: 120000, area: '東京都港区' },
  { id: 4, name: 'コーポ桜台', rent: 55000, area: '神奈川県横浜市' },
  { id: 5, name: 'メゾン中央', rent: 98000, area: '東京都新宿区' },
]

export function PropertyList() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{session?.user.email} でログイン中</p>
        </div>
        <button onClick={handleLogout}>ログアウト</button>
      </header>

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">家賃: {property.rent.toLocaleString()}円</p>
            <p className="property-area">エリア: {property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
