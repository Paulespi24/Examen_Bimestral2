from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ComercianteBase(BaseModel):
    nombre: str
    cedula: str
    email: str
    telefono: str

class ComercianteCreate(ComercianteBase):
    pass

class ComercianteResponse(ComercianteBase):
    id: int
    fecha_registro: datetime

    class Config:
        from_attributes = True

class PuestoBase(BaseModel):
    nombre: str
    descripcion: str
    ubicacion: str

class PuestoCreate(PuestoBase):
    pass

class PuestoResponse(PuestoBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class PermisoBase(BaseModel):
    comerciante_id: int
    puesto_id: int
    estado: str
    fecha_inicio: datetime
    fecha_fin: datetime

class PermisoCreate(BaseModel):
    comerciante_id: int
    puesto_id: int
    fecha_inicio: datetime
    fecha_fin: datetime

class PermisoUpdate(BaseModel):
    estado: str
    motivo_rechazo: Optional[str] = None

class PermisoResponse(BaseModel):
    id: int
    comerciante_id: int
    puesto_id: int
    estado: str
    fecha_inicio: datetime
    fecha_fin: datetime
    motivo_rechazo: Optional[str]
    fecha_solicitud: datetime
    fecha_actualizacion: Optional[datetime]

    class Config:
        from_attributes = True
