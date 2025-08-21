from db import engine, Base
from models import Event
print('Creating tables...'); Base.metadata.create_all(bind=engine); print('Done')
