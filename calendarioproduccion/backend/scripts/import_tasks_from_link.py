import argparse, csv, json, sys, os
from urllib.parse import urlparse
from datetime import datetime
import requests

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from db import SessionLocal, Base, engine
from models import Task

def parse_dt(v):
  if not v: return None
  v = v.replace('Z', '+00:00')
  for try_fn in (
    lambda x: datetime.fromisoformat(x),
    lambda x: datetime.strptime(x, '%Y-%m-%d'),
    lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M'),
    lambda x: datetime.strptime(x, '%d/%m/%Y'),
    lambda x: datetime.strptime(x, '%d/%m/%Y %H:%M'),
  ):
    try: return try_fn(v)
    except Exception: pass
  return None

def upsert_task(db, data, fieldmap):
  def m(field, default=None):
    key = fieldmap.get(field)
    if key and key in data: return data.get(key)
    return data.get(field, default)
  source_id = m('source_id')
  existing = db.query(Task).filter(Task.source_id == str(source_id)).first() if source_id else None
  if existing:
    existing.titulo = m('titulo', existing.titulo)
    existing.descripcion = m('descripcion', existing.descripcion)
    existing.estado = m('estado', existing.estado)
    existing.prioridad = m('prioridad', existing.prioridad)
    existing.responsable = m('responsable', existing.responsable)
    existing.fecha_vencimiento = parse_dt(m('fecha_vencimiento')) or existing.fecha_vencimiento
    existing.created_at = parse_dt(m('created_at')) or existing.created_at
    existing.updated_at = parse_dt(m('updated_at')) or existing.updated_at
    return existing, False
  else:
    t = Task(
      source_id = str(source_id) if source_id is not None else None,
      titulo = m('titulo') or "Sin título",
      descripcion = m('descripcion'),
      estado = m('estado'),
      prioridad = m('prioridad'),
      responsable = m('responsable'),
      fecha_vencimiento = parse_dt(m('fecha_vencimiento')),
      created_at = parse_dt(m('created_at')),
      updated_at = parse_dt(m('updated_at')),
    )
    db.add(t); return t, True

def fetch_all_json(url, headers):
  out, next_url = [], url
  while next_url:
    r = requests.get(next_url, headers=headers, timeout=60)
    r.raise_for_status()
    ct = r.headers.get('Content-Type','').lower()
    data = r.json() if 'json' in ct or r.text.strip().startswith(('{','[')) else json.loads(r.text)
    if isinstance(data, dict) and 'data' in data:
      out.extend(data['data']); next_url = data.get('next')
    elif isinstance(data, dict) and 'results' in data:
      out.extend(data['results']); next_url = data.get('next')
    elif isinstance(data, list):
      out.extend(data); next_url = None
    else:
      out.append(data); next_url = None
  return out

def fetch_csv(url, headers):
  r = requests.get(url, headers=headers, timeout=60)
  r.raise_for_status()
  r.encoding = r.apparent_encoding or 'utf-8'
  return list(csv.DictReader(r.text.splitlines()))

if __name__ == '__main__':
  p = argparse.ArgumentParser(description="Importar tareas desde una liga (JSON/CSV)")
  p.add_argument('--url', required=True)
  p.add_argument('--auth', help='Header Authorization, ej: "Bearer TOKEN"')
  p.add_argument('--format', choices=['auto','json','csv'], default='auto')
  p.add_argument('--map', dest='fieldmap', default='')
  args = p.parse_args()

  headers = {'Authorization': args.auth} if args.auth else {}
  fm = {}
  if args.fieldmap:
    for pair in args.fieldmap.split(','):
      if not pair.strip(): continue
      left,right = pair.split('=',1)
      fm[left.strip()] = right.strip()

  fmt = args.format
  if fmt == 'auto':
    ext = os.path.splitext(urlparse(args.url).path)[1].lower()
    fmt = 'csv' if ext in ('.csv','.tsv') else 'json'

  if fmt == 'json':
    items = fetch_all_json(args.url, headers)
  else:
    items = fetch_csv(args.url, headers)

  Base.metadata.create_all(bind=engine)
  inserted = updated = 0
  with SessionLocal() as db:
    for raw in items:
      t, is_new = upsert_task(db, raw, fm)
      if is_new: inserted += 1
      else: updated += 1
    db.commit()
  print(f"OK - Insertadas: {inserted} | Actualizadas: {updated}")
