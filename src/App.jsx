import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sell from './Sell.jsx'

const URL = 'https://eyaexwhktlshxrxwyios.supabase.co'
const KEY = 'sb_publishable_X-HntrYRakqxRJWoQmHP_g_H440SSYI'
const supabase = createClient(URL, KEY)

const css = `
*{box-sizing:border-box}
body{margin:0;background:#0b0f14;color:#e8edf2;font-family:-apple-system,Roboto,sans-serif}
.w{max-width:520px;margin:auto;padding:14px}
.hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.logo{font-size:20px;font-weight:800;letter-spacing:.3px}
.bal{background:#17202b;border-radius:18px;padding:6px 12px;font-size:14px}
.tabs{display:flex;gap:8px;margin-bottom:12px}
.tab{flex:1;text-align:center;padding:9px;border-radius:10px;background:#131a22;color:#7d8a98;font-size:14px}
.tab.on{background:#1d6fe8;color:#fff;font-weight:600}
.srch{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #1f2a36;background:#111820;color:#e8edf2;font-size:15px;margin-bottom:10px}
.chips{display:flex;gap:8px;margin-bottom:12px;overflow-x:auto}
.chip{padding:6px 12px;border-radius:16px;background:#131a22;color:#7d8a98;font-size:13px;white-space:nowrap}
.chip.on{background:#1f2a36;color:#fff}
.row{display:flex;justify-content:space-between;align-items:center;padding:14px 4px;border-bottom:1px solid #18212b}
.nm{font-size:17px;font-weight:700}
.st{font-size:12px;margin-top:4px;color:#7d8a98}
.st b{color:#35c27a}
.pr{text-align:right}
.pv{font-size:16px;font-weight:700}
.bt{margin-top:6px;padding:6px 12px;border:0;border-radius:10px;background:#1d6fe8;color:#fff;font-size:13px;font-weight:600}
.er{color:#f85149;font-size:12px;margin-top:4px}
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
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('list')
  const [sort, setSort] = useState('time')
  const [msg, setMsg] = useState({})
  const [, tick] = useState(0)

  async function load() {
    const { d
