from flask import Blueprint, request, jsonify
from sqlalchemy import select
from datetime import datetime
from ..db import SessionLocal
from ..models import Task

bp = Blueprint('tasks', __name__, url_prefix='/api')

def _parse_dt(v):
    if not v:
        return None
    try:
        v = v.replace('Z', '+00:00')
        return datetime.fromisoformat(v)
    except Exception:
        for fmt in ('%Y-%m-%d', '%Y-%m-%d %H:%M', '%d/%m/%Y', '%d/%m/%Y %H:%M'):
            try:
                return datetime.strptime(v, fmt)
            except Exception:
                pass
    return None

def to_dict(t: Task):
    return {
        "id": t.id,
        "source_id": t.source_id,
        "titulo": t.titulo,
        "descripcion": t.descripcion,
        "estado": t.estado,
        "prioridad": t.prioridad,
        "responsable": t.responsable,
        "fecha_vencimiento": t.fecha_vencimiento.isoformat() if t.fecha_vencimiento else None,
        "created_at": t.created_at.isoformat() if t.created_at else None,
        "updated_at": t.updated_at.isoformat() if t.updated_at else None,
    }

@bp.get('/tareas')
def list_tasks():
    estado = request.args.get('estado')
    with SessionLocal() as db:
        stmt = select(Task)
        if estado:
            stmt = stmt.filter(Task.estado == estado)
        rows = db.execute(stmt).scalars().all()
        return jsonify([to_dict(r) for r in rows])

@bp.post('/tareas')
def create_task():
    data = request.get_json() or {}
    if 'titulo' not in data:
        return {"message":"Falta 'titulo'"}, 400
    t = Task(
        source_id=data.get('source_id'),
        titulo=data['titulo'],
        descripcion=data.get('descripcion'),
        estado=data.get('estado'),
        prioridad=data.get('prioridad'),
        responsable=data.get('responsable'),
        fecha_vencimiento=_parse_dt(data.get('fecha_vencimiento')),
        created_at=_parse_dt(data.get('created_at')),
        updated_at=_parse_dt(data.get('updated_at')),
    )
    with SessionLocal() as db:
        db.add(t); db.commit(); db.refresh(t)
        return to_dict(t), 201

@bp.put('/tareas/<int:pk>')
def update_task(pk):
    data = request.get_json() or {}
    with SessionLocal() as db:
        t = db.get(Task, pk)
        if not t:
            return {"message":"No encontrado"}, 404
        for k in ['titulo','descripcion','estado','prioridad','responsable','source_id']:
            if k in data:
                setattr(t, k, data[k])
        if 'fecha_vencimiento' in data:
            t.fecha_vencimiento = _parse_dt(data['fecha_vencimiento'])
        if 'created_at' in data:
            t.created_at = _parse_dt(data['created_at'])
        if 'updated_at' in data:
            t.updated_at = _parse_dt(data['updated_at'])
        db.commit(); db.refresh(t)
        return to_dict(t)

@bp.delete('/tareas/<int:pk>')
def delete_task(pk):
    with SessionLocal() as db:
        t = db.get(Task, pk)
        if not t:
            return {"message":"No encontrado"}, 404
        db.delete(t); db.commit()
        return {"deleted": True}
