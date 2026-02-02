from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Comerciante(Base):
    __tablename__ = "comerciantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    cedula = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    telefono = Column(String)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())

class Puesto(Base):
    __tablename__ = "puestos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(Text)
    ubicacion = Column(String)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)
    comerciante_id = Column(Integer, ForeignKey("comerciantes.id"), index=True)
    puesto_id = Column(Integer, ForeignKey("puestos.id"), index=True)
    estado = Column(String)  # SOLICITADO, APROBADO, RECHAZADO, VENCIDO
    fecha_inicio = Column(DateTime(timezone=True))
    fecha_fin = Column(DateTime(timezone=True))
    motivo_rechazo = Column(Text, nullable=True)
    fecha_solicitud = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
