

Proyecto fullstack (React + Vite + Flask + SQLAlchemy) para gestionar un calendario de producción con categorías y vista especial de **MAQUILA**.

### Backend (Python)
1. Instala Python 3.10+
2. ```bash
   cd backend
   python -m venv .venv
   # Windows PowerShell:
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   copy .env.example .env
   python app.py
   ```

### Frontend (React)
1. En otra terminal:
   ```bash
   cd calendarioproduccion
   npm install
   # Configura la URL del backend si es necesario:
   # crea un archivo .env con: VITE_API_URL=http://127.0.0.1:5000/api
   npm run dev
   ```

Ahora visita http://localhost:5173

## Dependencias
### Frontend
- React 18, React Router 6
- FullCalendar (react, core, daygrid, timegrid, list, interaction)
- Axios
- Vite + @vitejs/plugin-react

### Backend
- Flask, Flask-CORS, SQLAlchemy, python-dotenv

## Notas
- La vista **Calendario** permite crear/editar/eliminar eventos (seleccionando un rango o clic en un evento).
- La vista **Maquila** lista exclusivamente eventos con categoría *MAQUILA* en un formato de tabla sencillo.
- La app es responsive y la barra lateral contiene los botones: **Hoy, Mes, Semana, Día, Agenda**.
