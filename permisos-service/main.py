from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import Comerciante, Puesto, Permiso
from schemas import ComercianteCreate, ComercianteResponse, PuestoCreate, PuestoResponse, PermisoCreate, PermisoUpdate, PermisoResponse
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Permisos Service", version="1.0.0")

@app.get("/health")
async def health():
    return {"status": "ok"}

# ===== COMERCIANTES =====

@app.post("/comerciantes", response_model=ComercianteResponse)
async def create_comerciante(comerciante: ComercianteCreate, db: Session = Depends(get_db)):
    existing = db.query(Comerciante).filter(Comerciante.cedula == comerciante.cedula).first()
    if existing:
        raise HTTPException(status_code=400, detail="Comerciante already exists")
    
    db_comerciante = Comerciante(
        nombre=comerciante.nombre,
        cedula=comerciante.cedula,
        email=comerciante.email,
        telefono=comerciante.telefono
    )
    db.add(db_comerciante)
    db.commit()
    db.refresh(db_comerciante)
    return db_comerciante

@app.get("/comerciantes", response_model=list[ComercianteResponse])
async def list_comerciantes(db: Session = Depends(get_db)):
    return db.query(Comerciante).all()

@app.get("/comerciantes/{comerciante_id}", response_model=ComercianteResponse)
async def get_comerciante(comerciante_id: int, db: Session = Depends(get_db)):
    comerciante = db.query(Comerciante).filter(Comerciante.id == comerciante_id).first()
    if not comerciante:
        raise HTTPException(status_code=404, detail="Comerciante not found")
    return comerciante

# ===== PUESTOS =====

@app.post("/puestos", response_model=PuestoResponse)
async def create_puesto(puesto: PuestoCreate, db: Session = Depends(get_db)):
    db_puesto = Puesto(
        nombre=puesto.nombre,
        descripcion=puesto.descripcion,
        ubicacion=puesto.ubicacion
    )
    db.add(db_puesto)
    db.commit()
    db.refresh(db_puesto)
    return db_puesto

@app.get("/puestos", response_model=list[PuestoResponse])
async def list_puestos(db: Session = Depends(get_db)):
    return db.query(Puesto).all()

@app.get("/puestos/{puesto_id}", response_model=PuestoResponse)
async def get_puesto(puesto_id: int, db: Session = Depends(get_db)):
    puesto = db.query(Puesto).filter(Puesto.id == puesto_id).first()
    if not puesto:
        raise HTTPException(status_code=404, detail="Puesto not found")
    return puesto

# ===== PERMISOS =====

@app.post("/permisos", response_model=PermisoResponse)
async def create_permiso(permiso: PermisoCreate, db: Session = Depends(get_db)):
    comerciante = db.query(Comerciante).filter(Comerciante.id == permiso.comerciante_id).first()
    if not comerciante:
        raise HTTPException(status_code=404, detail="Comerciante not found")
    
    puesto = db.query(Puesto).filter(Puesto.id == permiso.puesto_id).first()
    if not puesto:
        raise HTTPException(status_code=404, detail="Puesto not found")
    
    db_permiso = Permiso(
        comerciante_id=permiso.comerciante_id,
        puesto_id=permiso.puesto_id,
        estado="SOLICITADO",
        fecha_inicio=permiso.fecha_inicio,
        fecha_fin=permiso.fecha_fin
    )
    db.add(db_permiso)
    db.commit()
    db.refresh(db_permiso)
    return db_permiso

@app.get("/permisos", response_model=list[PermisoResponse])
async def list_permisos(db: Session = Depends(get_db)):
    permisos = db.query(Permiso).all()
    
    for permiso in permisos:
        if permiso.estado != "RECHAZADO" and permiso.fecha_fin < datetime.now():
            permiso.estado = "VENCIDO"
            db.commit()
    
    return permisos

@app.get("/permisos/{permiso_id}", response_model=PermisoResponse)
async def get_permiso(permiso_id: int, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso not found")
    
    if permiso.estado != "RECHAZADO" and permiso.fecha_fin < datetime.now():
        permiso.estado = "VENCIDO"
        db.commit()
    
    return permiso

@app.patch("/permisos/{permiso_id}", response_model=PermisoResponse)
async def update_permiso(permiso_id: int, update: PermisoUpdate, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso not found")
    
    if update.estado not in ["SOLICITADO", "APROBADO", "RECHAZADO", "VENCIDO"]:
        raise HTTPException(status_code=400, detail="Invalid estado")
    
    permiso.estado = update.estado
    if update.motivo_rechazo:
        permiso.motivo_rechazo = update.motivo_rechazo
    
    db.commit()
    db.refresh(permiso)
    return permiso

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
