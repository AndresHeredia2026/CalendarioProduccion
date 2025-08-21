import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { fetchEvents } from '../services/apis';

// FullCalendar v6 CSS (importa cada vista que uses)
import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/list/index.css';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => setEvents(await fetchEvents()))();
  }, []);

  return (
    <div className="calendar-wrap card">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[esLocale]}
        locale="es" // <-- idioma español
        firstDay={1} // <-- semana inicia en lunes
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        dayHeaderFormat={{ weekday: 'short' }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={events}
        height="auto"
      />
    </div>
  );
}