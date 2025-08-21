import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import SidebarViews from '../components/SidebarViews'
import EventForm from '../components/EventForm'
import api from '../api/client'
import { CATEGORY_COLORS } from '../data/categories'

export default function CalendarPage(){
  const ref = useRef(null)
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')

  async function load(){
    const res = await api.get('/events')
    setEvents(
      res.data.map(e => ({
        ...e,
        backgroundColor: CATEGORY_COLORS[e.category] || '#64748b',
        borderColor:    CATEGORY_COLORS[e.category] || '#64748b'
      }))
    )
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
    setEditing({
      start: arg.startStr.slice(0,16),
      end: arg.endStr.slice(0,16),
      op: ''
    })
    setShowForm(true)
  }

  function eventClick(info){
    const e = info.event
    setEditing({
      id: e.id,
      title: e.title,
      start: e.startStr.slice(0,16),
      end: e.endStr ? e.endStr.slice(0,16) : '',
      allDay: e.allDay,
      category: e.extendedProps.category,
      description: e.extendedProps.description || '',
      op: e.extendedProps.op ?? ''
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

  // Flechas (mes; con Alt: año)
  const goPrev = (e) => {
    const api = ref.current?.getApi()
    if(!api) return
    e?.altKey ? api.prevYear() : api.prev()
  }
  const goNext = (e) => {
    const api = ref.current?.getApi()
    if(!api) return
    e?.altKey ? api.nextYear() : api.next()
  }

  return (
    <div className="container">
      <div className="legend">
        {Object.entries(CATEGORY_COLORS).map(([k,v]) => (
          <span key={k} className="badge">
            <span className="dot" style={{background:v}}></span>{k}
          </span>
        ))}
      </div>

      <div className="layout">
        <SidebarViews onAction={handleAction} />

        <section className="content-card">
          {showForm && (
            <EventForm
              initial={editing}
              onClose={() => setShowForm(false)}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
              className="event-form"
            />
          )}

          {/* Header minimal como en tu captura */}
          <div className="cal-minihead">
            <button
              className="cal-minihead__arrow"
              onClick={goPrev}
              aria-label="Mes anterior (Alt: año anterior)"
              title="Anterior (Alt: año)"
              type="button"
            >
              ‹
            </button>

            <span className="cal-minihead__title" aria-live="polite">
              {title}
            </span>

            <button
              className="cal-minihead__arrow"
              onClick={goNext}
              aria-label="Mes siguiente (Alt: año siguiente)"
              title="Siguiente (Alt: año)"
              type="button"
            >
              ›
            </button>
          </div>

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
            headerToolbar={false}   // usamos nuestro header minimal

            /* Actualiza el título (ej: "AGOSTO 2025") */
            datesSet={(arg) => setTitle(arg.view.title.toUpperCase())}

            locales={[esLocale]}
            locale="es"
            firstDay={1}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            dayHeaderFormat={{ weekday: 'short' }}
          />
        </section>
      </div>
    </div>
  )
}
