from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecintoBase(BaseModel):
    nombre: str
    capacidad_maxima: int
    ubicacion: str

class RecintoCreate(RecintoBase):
    pass

class RecintoResponse(RecintoBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class MovimientoBase(BaseModel):
    tipo: str
    cantidad: int

class MovimientoCreate(MovimientoBase):
    pass

class MovimientoResponse(MovimientoBase):
    id: int
    recinto_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class OcupacionResponse(BaseModel):
    recinto_id: int
    nombre: str
    ocupacion_actual: int
    capacidad_maxima: int
    porcentaje_ocupacion: float
    estado: str  # NORMAL, CERCA_DEL_LIMITE, AFORO_COMPLETO
