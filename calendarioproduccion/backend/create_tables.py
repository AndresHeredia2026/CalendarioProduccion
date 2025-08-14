from dotenv import load_dotenv; load_dotenv()
from datetime import datetime, timedelta
from backend.db import Base, engine, SessionLocal
from backend.models import Event, Task

if __name__ == "__main__":
  print("Creating tables...")
  Base.metadata.create_all(bind=engine)
  with SessionLocal() as db:
    if not db.query(Event).first():
      now = datetime.now().replace(minute=0, second=0, microsecond=0)
      samples = [
        Event(title="OP-1001 Corte inicial", start=now, end=now+timedelta(hours=2), tipo="MAQUILA", descripcion="Corte lote A", equipos="Cortadora A"),
        Event(title="FLEXO 8 colores", start=now+timedelta(days=1, hours=1), end=now+timedelta(days=1, hours=5), tipo="FLEXO", descripcion="Imp. etiqueta X", equipos="Flexo-01"),
        Event(title="Entrega Cliente Heinz", start=now+timedelta(days=2, hours=9), end=now+timedelta(days=2, hours=10), tipo="ENTREGA", descripcion="Pedido semanal", equipos="Camión 2"),
      ]
      db.add_all(samples); db.commit()
      print("Seed de eventos insertado.")
    else:
      print("Eventos ya existen; seed omitido.")
  print("Listo.")
