import requests, json, sys
from urllib.parse import urljoin

CANDIDATES = ["/api/tareas","/api/tasks","/tareas","/tasks","/api/v1/tareas","/api/v1/tasks",
              "/export/tareas.json","/export/tasks.json","/export/tareas.csv","/export/tasks.csv",
              "/tareas.json","/tasks.json"]

def try_fetch(url, headers):
  try:
    r = requests.get(url, headers=headers, timeout=10)
    ct = r.headers.get("Content-Type", "").lower()
    ok = r.status_code == 200
    return ok, ct, r.text
  except Exception as e:
    return False, "", str(e)

def hint_map_from_sample(sample):
  keys = list(sample.keys()) if isinstance(sample, dict) else []
  candidates = {
    "titulo": ["title","nombre","name"],
    "descripcion": ["descripcion","description","desc","notes"],
    "estado": ["estado","status","state"],
    "prioridad": ["prioridad","priority"],
    "responsable": ["responsable","owner","assignee","assigned_to"],
    "fecha_vencimiento": ["due","due_date","fecha_vencimiento","vence","due_on"],
    "source_id": ["id","_id","uuid"],
    "created_at": ["created","created_at","fecha_creacion"],
    "updated_at": ["updated","updated_at","fecha_actualizacion"],
  }
  mapping = []
  for dst, options in candidates.items():
    for k in options:
      if k in keys:
        mapping.append(f"{dst}={k}")
        break
  return ",".join(mapping)

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Uso: python discover_tasks_endpoint.py BASE_URL [Bearer_TOKEN_opcional]")
    sys.exit(1)
  base = sys.argv[1].rstrip("/")
  token = sys.argv[2] if len(sys.argv) >= 3 else None
  headers = {"Authorization": token} if token else {}
  print(f"[i] Probando endpoints comunes en {base} ...\n")
  for path in CANDIDATES:
    from urllib.parse import urljoin
    url = urljoin(base + "/", path.lstrip("/"))
    ok, ct, body = try_fetch(url, headers)
    if not ok: continue
    is_json = "json" in ct
    is_csv  = "csv" in ct or url.lower().endswith(".csv")
    print(f"✅ {url}  (Content-Type: {ct or 'desconocido'})")
    if is_json:
      import json
      try:
        data = json.loads(body)
        if isinstance(data, dict) and "data" in data: items = data["data"]
        elif isinstance(data, dict) and "results" in data: items = data["results"]
        elif isinstance(data, list): items = data
        else: items = [data]
        print(f"   → {len(items)} ítems detectados (muestra 1):")
        if items:
          sample = items[0]
          print(json.dumps(sample, ensure_ascii=False, indent=2)[:1000])
          if isinstance(sample, dict):
            suggest = hint_map_from_sample(sample)
            if suggest: print(f"   Sugerencia --map: \"{suggest}\"")
      except Exception:
        print("   * Parece JSON pero no se pudo parsear. Revisa autenticación o formato.")
    elif is_csv:
      print("   → CSV detectado. Usa --format csv en el importador.")
    else:
      print("   * 200 OK pero no es JSON/CSV típico.")
  print("\n[i] Si nada respondió 200, revisa puerto (5000/3000/8080) o autenticación.")
