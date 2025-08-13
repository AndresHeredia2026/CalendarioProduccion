import React, { useState, useEffect } from 'react'
import { CATEGORY_OPTIONS } from '../data/categories'
import api from '../api/client'

export default function EventForm({ initial, onClose, onSaved, onDeleted }){
  const [form, setForm] = useState(initial || {
    title: '', category: 'MAQUILA', start: '', end: '', allDay: false, description: ''
  })
  useEffect(() => { if(initial) setForm({ ...initial }) }, [initial])

  function change(e){
    const {name, value, type, checked} = e.target
    setForm(f => ({...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function save(e){
    e.preventDefault()
    const payload = { ...form }
    if(!payload.title || !payload.start) return alert('Título e inicio son obligatorios')
    const res = form.id ? await api.put(`/events/${form.id}`, payload) : await api.post('/events', payload)
    onSaved && onSaved(res.data)
  }

  async function del(){
    if(form.id && confirm('¿Eliminar evento?')){
      await api.delete(`/events/${form.id}`)
      onDeleted && onDeleted(form.id)
    }
  }

  return (
    <div className="content-card" style={{marginBottom:'1rem'}}>
      <h3>{form.id ? 'Editar evento' : 'Nuevo evento'}</h3>
      <form onSubmit={save}>
        <div className="form-row">
          <div>
            <label>Título</label>
            <input name="title" value={form.title} onChange={change} required />
          </div>
          <div>
            <label>Categoría</label>
            <select name="category" value={form.category} onChange={change}>
              {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Inicio</label>
            <input type="datetime-local" name="start" value={form.start} onChange={change} required />
          </div>
          <div>
            <label>Fin</label>
            <input type="datetime-local" name="end" value={form.end || ''} onChange={change} />
          </div>
        </div>
        <div className="form-row-single">
          <label><input type="checkbox" name="allDay" checked={!!form.allDay} onChange={change}/> Todo el día</label>
          <label>Descripción</label>
          <textarea name="description" value={form.description || ''} onChange={change} rows={3}></textarea>
        </div>
        <div className="actions">
          {form.id && <button type="button" className="btn" onClick={del}>Eliminar</button>}
          <button type="button" className="btn" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
