import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const URL = 'https://eyaexwhktlshxrxwyios.supabase.co'
const KEY = 'sb_publishable_X-HntrYRakqxRJWoQmHP_g_H440SSYI'
const supabase = createClient(URL, KEY)

const css = `
body{margin:0;background:#0d1117;color:#e6edf3;font-family:-apple-system,sans-serif}
.w{padding:16px;max-width:480px;margin:auto}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.pill{background:#1c2430;border-radius:20px;padding:6px 12px;font-size:14px}
.card{background:#161b22;border:1px solid #232c38;border-radius:16px;padding:16px;margin-bottom:12px}
.n{font-size:22px;font-weight:700}
.row{display:flex;justify-content:space-between;margin-top:10px;color:#8b98a5;font-size:14px}
.v{color:#e6edf3;font-weight:600}
button{width:100%;margin-top:14px;padding:12px;border:0;border-radius:12px;background:#2f81f7;color:#fff;font-size:16px;font-weight:600}
.msg{margin-top:8px;font-size:13px;color:#f85149}
`

function left(t) {
  const s = Math.max(0, Math.floor((new Date(t) - Date.now()) / 1000))
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600)
  const m = Math.floor(s % 3600 / 60), c = s % 60
  return d ? `${d}д ${h}ч` : `${h}ч ${m}м ${c}с`
}

export default function App() {
  const [status, setStatus] = useState('Вход...')
  const [me, setMe] = useState(null)
  const [lots, setLots] = useState([])
  const [msg, setMsg] = useState({})
  const [, tick] = useState(0)

  async function load() {
    const { data: p } = await supabase.from('profiles').select('*').single()
    setMe(p)
    const { data } = await supabase.from('auctions')
      .select('id,current_bid,start_price,ends_at,usernames(name)')
      .eq('status', 'active').order('ends_at')
    setLots(data || [])
  }

  useEffect(() => {
    (async () => {
      const tg = window.Telegram?.WebApp
      if (!tg?.initData) return setStatus('Открой сайт через бота в Telegram')
      tg.ready(); tg.expand()
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
        await load()
        setStatus('ok')
      } catch (e) { setStatus('Ошибка входа: ' + e.message) }
    })()
    const a = setInterval(() => tick((x) => x + 1), 1000)
    const b = setInterval(() => load().catch(() => {}), 15000)
    return () => { clearInterval(a); clearInterval(b) }
  }, [])

  async function bid(l) {
    const min = l.current_bid ? Math.ceil(l.current_bid * 1.05) : l.start_price
    const { error } = await supabase.rpc('place_bid', { p_auction: l.id, p_amount: min })
    setMsg({ ...msg, [l.id]: error ? error.message : '' })
    await load()
  }

  if (status !== 'ok') {
    return <><style>{css}</style><div className="w">{status}</div></>
  }

  return (
    <>
      <style>{css}</style>
      <div className="w">
        <div className="top">
          <b style={{ fontSize: 20 }}>Маркет</b>
          <span className="pill">💰 {me?.balance - me?.held} монет</span>
        </div>
        {lots.length === 0 && <p>Лотов пока нет</p>}
        {lots.map((l) => {
          const min = l.current_bid ? Math.ceil(l.current_bid * 1.05) : l.start_price
          return (
            <div className="card" key={l.id}>
              <div className="n">@{l.usernames?.name}</div>
              <div className="row"><span>Текущая ставка</span>
                <span className="v">{l.current_bid ?? l.start_price}</span></div>
              <div className="row"><span>Осталось</span>
                <span className="v">{left(l.ends_at)}</span></div>
              <button onClick={() => bid(l)}>Сделать ставку {min}</button>
              {msg[l.id] && <div className="msg">{msg[l.id]}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
        }
