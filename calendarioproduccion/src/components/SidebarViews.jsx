import React from 'react'

export default function SidebarViews({ onAction }){
  return (
    <aside className="sidebar">
      <div className="side-title">Vistas</div>
      <button className="btn" onClick={() => onAction('today')}>Hoy</button>
      <button className="btn" onClick={() => onAction('dayGridMonth')}>Mes</button>
      <button className="btn" onClick={() => onAction('timeGridWeek')}>Semana</button>
      <button className="btn" onClick={() => onAction('timeGridDay')}>Día</button>
      <button className="btn" onClick={() => onAction('listWeek')}>Agenda</button>
      <div className="side-title" style={{marginTop:'1rem'}}>Acciones</div>
      <button className="btn btn-primary" onClick={() => onAction('new')}>Nuevo evento</button>
    </aside>
  )
}
