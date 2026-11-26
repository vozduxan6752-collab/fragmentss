import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [lots, setLots] = useState([])

  useEffect(() => {
    supabase
      .from('auctions')
      .select('id, current_bid, start_price, ends_at, usernames(name)')
      .eq('status', 'active')
      .then(({ data }) => setLots(data || []))
  }, [])

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Маркет юзернеймов</h2>
      {lots.length === 0 && <p>Лотов пока нет</p>}
      {lots.map((l) => (
        <div key={l.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <b>@{l.usernames?.name}</b>
          <div>Ставка: {l.current_bid ?? l.start_price}</div>
          <div>До: {new Date(l.ends_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
