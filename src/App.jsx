import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const URL = 'https://eyaexwhktlshxrxwyios.supabase.co'
const KEY = 'sb_publishable_X-HntrYRakqxRJWoQmHP_g_H440SSYI'

const supabase = createClient(URL, KEY)

export default function App() {
  const [lots, setLots] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    supabase
      .from('auctions')
      .select('id, current_bid, start_price, ends_at, usernames(name)')
      .eq('status', 'active')
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setLots(data || [])
      })
  }, [])

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Маркет юзернеймов</h2>
      {err && <p style={{ color: 'red' }}>Ошибка: {err}</p>}
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
