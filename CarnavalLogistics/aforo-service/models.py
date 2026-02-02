from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from database import Base

class Recinto(Base):
    __tablename__ = "recintos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    capacidad_maxima = Column(Integer)
    ubicacion = Column(String)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

class Movimiento(Base):
    __tablename__ = "movimientos"

    id = Column(Integer, primary_key=True, index=True)
    recinto_id = Column(Integer, index=True)
    tipo = Column(String)  # "entrada" o "salida"
    cantidad = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
