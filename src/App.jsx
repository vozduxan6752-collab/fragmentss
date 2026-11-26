import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const URL = 'https://eyaexwhktlshxrxwyios.supabase.co'
const KEY = 'sb_publishable_X-HntrYRakqxRJWoQmHP_g_H440SSYI'

const supabase = createClient(URL, KEY)

export default function App() {
  const [status, setStatus] = useState('Вход...')
  const [me, setMe] = useState(null)
  const [lots, setLots] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    async function login() {
      const tg = window.Telegram?.WebApp
      if (!tg || !tg.initData) {
        setStatus('Открой сайт через бота в Telegram')
        return
      }
      tg.ready()
      try {
        const r = await fetch(URL + '/functions/v1/swift-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: KEY },
          body: JSON.stringify({ initData: tg.initData }),
        })
        const j = await r.json()
        if (!j.session) throw new Error(j.error || 'нет сессии')
        await supabase.auth.setSession({
          access_token: j.session.access_token,
          refresh_token: j.session.refresh_token,
        })
        const { data: p } = await supabase.from('profiles').select('*').single()
        setMe(p)
        setStatus('ok')
        const { data, error } = await supabase
          .from('auctions')
          .select('id, current_bid, start_price, ends_at, usernames(name)')
          .eq('status', 'active')
        if (error) setErr(error.message)
        else setLots(data || [])
      } catch (e) {
        setStatus('Ошибка входа: ' + e.message)
      }
    }
    login()
  }, [])

  if (status !== 'ok') {
    return <div style={{ padding: 16, fontFamily: 'sans-serif' }}>{status}</div>
  }

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Маркет юзернеймов</h2>
      <p>
        @{me?.tg_username || 'без username'} · баланс: {me?.balance}
      </p>
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
