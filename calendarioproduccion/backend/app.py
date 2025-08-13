import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import SessionLocal, Event, init_db
from sqlalchemy import select

load_dotenv()
init_db()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/events")
def get_events():
    category = request.args.get("category")
    with SessionLocal() as db:
        stmt = select(Event)
        if category:
            stmt = stmt.where(Event.category == category)
        items = db.scalars(stmt).all()
        res = [{
            "id": e.id, "title": e.title, "category": e.category,
            "start": e.start, "end": e.end, "allDay": e.allDay,
            "description": e.description
        } for e in items]
        return jsonify(res)

@app.post("/api/events")
def create_event():
    data = request.get_json()
    required = ["title", "start"]
    if not all(k in data and data[k] for k in required):
        return {"error": "title y start son obligatorios"}, 400
    ev = Event(
        title=data["title"],
        category=data.get("category","MAQUILA"),
        start=data["start"],
        end=data.get("end"),
        allDay=bool(data.get("allDay", False)),
        description=data.get("description")
    )
    with SessionLocal() as db:
        db.add(ev)
        db.commit()
        db.refresh(ev)
        return {
            "id": ev.id, "title": ev.title, "category": ev.category,
            "start": ev.start, "end": ev.end, "allDay": ev.allDay,
            "description": ev.description
        }, 201

@app.put("/api/events/<int:event_id>")
def update_event(event_id):
    data = request.get_json()
    with SessionLocal() as db:
        ev = db.get(Event, event_id)
        if not ev: return {"error": "no encontrado"}, 404
        for field in ["title","category","start","end","allDay","description"]:
            if field in data: setattr(ev, field, data[field])
        db.commit()
        return {
            "id": ev.id, "title": ev.title, "category": ev.category,
            "start": ev.start, "end": ev.end, "allDay": ev.allDay,
            "description": ev.description
        }

@app.delete("/api/events/<int:event_id>")
def delete_event(event_id):
    with SessionLocal() as db:
        ev = db.get(Event, event_id)
        if not ev: return {"error":"no encontrado"}, 404
        db.delete(ev)
        db.commit()
        return {"ok": True}

if __name__ == "__main__":
    host = os.getenv("HOST","127.0.0.1")
    port = int(os.getenv("PORT","5000"))
    app.run(host=host, port=port)
