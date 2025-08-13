import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CalendarPage from './pages/CalendarPage'
import MaquilaView from './pages/MaquilaView'
import TasksPage from './pages/TasksPage'

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/maquila" element={<MaquilaView />} />
        <Route path="/tareas" element={<TasksPage />} />
      </Routes>
    </>
  )
}
