import React, { useEffect, useState } from 'react'
import api from '../api/client'

function formatDateShort(iso){
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', { day:'2-digit', month:'long'})
}

export default function MaquilaView(){
  const [events, setEvents] = useState([])
  useEffect(() => {
    (async () => {
      const res = await api.get('/events?category=MAQUILA')
      setEvents(res.data)
    })()
  }, [])

  // Group by week rows (two weeks like the screenshot)
  const byWeek = {}
  events.forEach(e => {
    const key = new Date(e.start).toISOString().slice(0,10).substring(0,7) // month key
    if(!byWeek[key]) byWeek[key] = []
    byWeek[key].push(e)
  })

  return (
    <div className="container">
      <div className="content-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2>PRODUCCIÓN ASSEMBLED</h2>
          <a className="navlink" href="/">VER CALENDARIO</a>
        </div>
        <div className="legend" style={{marginTop:'.5rem'}}>
          <span className="badge"><span className="dot" style={{background:'#6d28d9'}}></span>MAQUILA</span>
          <span className="badge"><span className="dot" style={{background:'#2563eb'}}></span>FLEXO</span>
          <span className="badge"><span className="dot" style={{background:'#f59e0b'}}></span>SUAJADORA</span>
          <span className="badge"><span className="dot" style={{background:'#16a34a'}}></span>ENTREGA</span>
          <span className="badge"><span className="dot" style={{background:'aquamarine'}}></span>RECIBOS MAQUILA</span>
          <span className="badge"><span className="dot" style={{background:'#ef4444'}}></span>HEINZ</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', marginTop:'1rem'}}>
            <thead>
              <tr>
                {['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'].map(h => (
                  <th key={h} style={{textAlign:'left', padding:'.5rem', border:'1px solid #e5e7eb', background:'#f9fafb'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Simplified: render rows of dates & events in order */}
              {events.sort((a,b)=> new Date(a.start)-new Date(b.start)).map(ev => (
                <tr key={ev.id}>
                  <td colSpan={7} style={{border:'1px solid #e5e7eb', padding:'.5rem'}}>
                    <strong>{formatDateShort(ev.start)}</strong> — {ev.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
