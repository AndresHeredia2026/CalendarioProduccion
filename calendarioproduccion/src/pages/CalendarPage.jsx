import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import SidebarViews from '../components/SidebarViews'
import EventForm from '../components/EventForm'
import api from '../api/client'
import { CATEGORY_COLORS } from '../data/categories'

export default function CalendarPage(){
  const ref = useRef(null)
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load(){
    const res = await api.get('/events')
    setEvents(res.data.map(e => ({
      ...e,
      backgroundColor: CATEGORY_COLORS[e.category] || '#64748b',
      borderColor: CATEGORY_COLORS[e.category] || '#64748b'
    })))
  }
  useEffect(() => { load() }, [])

  function handleAction(action){
    const apiCal = ref.current?.getApi()
    if(!apiCal) return
    if(action === 'new'){ setEditing(null); setShowForm(true); return }
    if(action === 'today') apiCal.today()
    else apiCal.changeView(action)
  }

  function dateSelect(arg){
    setEditing({ start: arg.startStr.slice(0,16), end: arg.endStr.slice(0,16) })
    setShowForm(true)
  }
  function eventClick(info){
    const e = info.event
    setEditing({
      id: e.id, title: e.title, start: e.startStr.slice(0,16),
      end: e.endStr ? e.endStr.slice(0,16) : '', allDay: e.allDay, category: e.extendedProps.category, description: e.extendedProps.description || ''
    })
    setShowForm(true)
  }

  async function handleSaved(){
    setShowForm(false)
    await load()
  }
  async function handleDeleted(){
    setShowForm(false)
    await load()
  }

  return (
    <div className="container">
      <div className="legend">
        {Object.entries(CATEGORY_COLORS).map(([k,v]) => (
          <span key={k} className="badge"><span className="dot" style={{background:v}}></span>{k}</span>
        ))}
      </div>
      <div className="layout">
        <SidebarViews onAction={handleAction} />
        <section className="content-card">
          {showForm && <EventForm initial={editing} onClose={() => setShowForm(false)} onSaved={handleSaved} onDeleted={handleDeleted} />}
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            select={dateSelect}
            eventClick={eventClick}
            events={events}
            height="auto"
            headerToolbar={false}
          />
        </section>
      </div>
    </div>
  )
}
