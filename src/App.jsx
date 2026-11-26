import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null
let initError = null
try {
  if (url && key) supabase = createClient(url, key)
} catch (e) {
  initError = e.message
}

export default function App() {
  const [lots, setLots] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('auctions')
      .select('id, current_bid, start_price, ends_at, usernames(name)')
      .eq('status', 'active')
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setLots(data || [])
      })
  }, [])

  if (!supabase) {
    return (
      <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
        <h3>Проблема с настройкой</h3>
        <p>URL: {url ? 'есть' : 'НЕТ'}</p>
        <p>KEY: {key ? 'есть' : 'НЕТ'}</p>
        {initError && <p>Ошибка: {initError}</p>}
      </div>
    )
  }

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Маркет юзернеймов</h2>
      {err && <p style={{ color: 'red' }}>Ошибка базы: {err}</p>}
      {!err && lots.length === 0 && <p>Лотов пока нет</p>}
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
