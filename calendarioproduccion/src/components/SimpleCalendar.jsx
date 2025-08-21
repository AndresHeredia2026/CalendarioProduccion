import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import '@fullcalendar/core/index.css'
import '@fullcalendar/daygrid/index.css'
export default function SimpleCalendar({events,onSelectRange,onEventClick}){
  return <FullCalendar plugins={[dayGridPlugin,interactionPlugin]} initialView="dayGridMonth" selectable selectMirror
    dayMaxEventRows={2} firstDay={1} locale={esLocale} headerToolbar={false} events={events}
    select={i=>onSelectRange&&onSelectRange({start:i.startStr,end:i.endStr,allDay:i.allDay})}
    eventClick={e=>onEventClick&&onEventClick(e.event)}
    eventContent={arg=>{const op=arg.event.extendedProps?.op??'';return (<div><b>{arg.timeText}</b> <span>{arg.event.title}</span>{op!==''&&<small> • OP:{op}</small>}</div>)}}/>
}