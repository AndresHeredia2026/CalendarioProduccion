# Backend Flask (API de eventos)

## Uso rápido
```bash
cd backend
python -m venv .venv
# En Windows PowerShell:
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env  # opcional
python app.py
# La API correrá en http://127.0.0.1:5000/api
```

Por defecto se usa SQLite (`events.db`). Para Postgres/MySQL cambia `DATABASE_URL` en `.env` (por ejemplo: `postgresql+psycopg://user:pass@host/db`).

## Endpoints
- `GET /api/events?category=MAQUILA`
- `POST /api/events` (JSON: title, start, end?, category?, allDay?, description?)
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
