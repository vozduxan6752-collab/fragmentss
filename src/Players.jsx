import { useEffect, useState } from 'react'

export default function Players({ supabase, reload }) {
  const [list, setList] = useState([])
  const [me, setMe] = useState(null)
  const [q, setQ] = useState('')
  const [amt, setAmt] = useState(100)
  const [info, setInfo] = useState('')

  async function refresh() {
    const { data, error } = await supabase.rpc('admin_players')
    if (error) setInfo(error.message)
    else setList(data || [])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data?.user?.id))
    refresh()
  }, [])

  async function give(id) {
    const { error } = await supabase.rpc('admin_give_to', { p_id: id, p_amount: Number(amt) })
    setInfo(error ? error.message : 'Баланс изменён')
    if (!error) { refresh(); reload() }
  }

  const s = q.toLowerCase().replace('@', '')
  const shown = list.filter((p) =>
    (p.tg_username || '').toLowerCase().includes(s) || String(p.tg_id).includes(s))

  return (
    <div>
      <div style={{ color: '#8795a5', fontSize: 14, margin: '16px 0 6px' }}>
        Игроки ({list.length})
      </div>
      <input className="srch" style={{ paddingLeft: 18 }} type="number"
        placeholder="Сумма ★ (можно минус)" value={amt}
        onChange={(e) => setAmt(e.target.value)} />
      <button className="bt" style={{ marginBottom: 12 }}
        onClick={() => me && give(me)}>
        Выдать себе
      </button>
      <input className="srch" style={{ paddingLeft: 18 }} placeholder="Поиск по @username или id"
        value={q} onChange={(e) => setQ(e.target.value)} />
      {info && <p style={{ color: '#35c27a', fontSize: 14 }}>{info}</p>}
      {shown.map((p) => (
        <div className="row" key={p.id} style={{ borderRadius: 10, marginBottom: 4 }}>
          <div className="l">
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              {p.tg_username ? '@' + p.tg_username : 'без username'}
              {p.id === me ? ' (ты)' : ''}
            </div>
            <div className="tm">
              id {p.tg_id} · ★ {Number(p.balance).toLocaleString('en-US')}
              {Number(p.held) > 0 ? ` (в ставках ${Number(p.held)})` : ''} · имён: {p.owned}
            </div>
          </div>
          <button className="bt" onClick={() => give(p.id)}>+ ★</button>
        </div>
      ))}
    </div>
  )
}
