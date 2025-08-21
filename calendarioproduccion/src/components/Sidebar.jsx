import React from 'react'
export default function Sidebar({ onNew }){
  return(<aside className='sidebar'>
    <h4>Vistas</h4>
    <div className='stack'>
      <button className='btn full'>Hoy</button>
      <button className='btn full'>Mes</button>
      <button className='btn full'>Semana</button>
      <button className='btn full'>Día</button>
      <button className='btn full'>Agenda</button>
    </div>
    <h4 style={{marginTop:16}}>Acciones</h4>
    <button className='btn primary full' onClick={onNew}>Nuevo evento</button>
  </aside>)
}
