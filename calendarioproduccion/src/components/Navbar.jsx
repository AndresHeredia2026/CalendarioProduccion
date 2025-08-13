import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <div className="brand"><Link to="/">PRODUCCIÓN ASSEMBLED</Link></div>
        <div className="spacer" />
        <NavLink className="navlink" to="/">Calendario</NavLink>
        <NavLink className="navlink" to="/maquila">Vista Maquila</NavLink>
        <NavLink className="navlink" to="/tareas">Tareas nuevas</NavLink>
      </div>
    </nav>
  )
}
