import { useEffect, useState } from 'react'

export default function Sell({ supabase, meId, onDone }) {
  const [mine, setMine] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState(100)
  const [hours, setHours] = useState(24)
  const [info, setInfo] = useState('')

  async function loadMine() {
    const { data } = await supabase.from('usernames').select('id,name').eq('owner_id', meId)
    setMine(data || [])
  }
  useEffect(() => { loadMine() }, [])

  async function claim() {
    const { error } = await supabase.rpc('claim_username', { p_name: name })
    setInfo(error ? error.message : 'Юзернейм зарегистрирован')
    if (!error) { setName(''); loadMine() }
  }
  async function list(id) {
    const { error } = await supabase.rpc('create_auction',
      { p_username: id, p_price: Number(price), p_hours: Number(hours) })
    setInfo(error ? error.message : 'Лот выставлен')
    if (!error) onDone()
  }

  return (
    <div>
      <div style={{ marginBottom: 6, color: '#7d8a98' }}>Новый юзернейм</div>
      <input className="srch" placeholder="например mycoolname" value={name}
        onChange={(e) => setName(e.target.value)} />
      <button className="bt" onClick={claim}>Зарегистрировать</button>

      <div style={{ margin: '18px 0 6px', color: '#7d8a98' }}>Условия лота</div>
      <input className="srch" type="number" placeholder="Стартовая цена" value={price}
        onChange={(e) => setPrice(e.target.value)} />
      <input className="srch" type="number" placeholder="Часов (1-168)" value={hours}
        onChange={(e) => setHours(e.target.value)} />

      {mine.length === 0 && <p style={{ color: '#7d8a98' }}>У тебя пока нет юзернеймов</p>}
      {mine.map((u) => (
        <div className="row" key={u.id}>
          <div className="nm">@{u.name}</div>
          <button className="bt" onClick={() => list(u.id)}>Выставить</button>
        </div>
      ))}
      {info && <p style={{ color: '#35c27a' }}>{info}</p>}
    </div>
  )
}
