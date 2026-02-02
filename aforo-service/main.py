from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import Recinto, Movimiento
from schemas import RecintoCreate, RecintoResponse, MovimientoCreate, MovimientoResponse, OcupacionResponse
from sqlalchemy import func

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aforo Service", version="1.0.0")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/recintos", response_model=RecintoResponse)
async def create_recinto(recinto: RecintoCreate, db: Session = Depends(get_db)):
    existing = db.query(Recinto).filter(Recinto.nombre == recinto.nombre).first()
    if existing:
        raise HTTPException(status_code=400, detail="Recinto already exists")
    
    db_recinto = Recinto(
        nombre=recinto.nombre,
        capacidad_maxima=recinto.capacidad_maxima,
        ubicacion=recinto.ubicacion
    )
    db.add(db_recinto)
    db.commit()
    db.refresh(db_recinto)
    return db_recinto

@app.get("/recintos/{recinto_id}", response_model=RecintoResponse)
async def get_recinto(recinto_id: int, db: Session = Depends(get_db)):
    recinto = db.query(Recinto).filter(Recinto.id == recinto_id).first()
    if not recinto:
        raise HTTPException(status_code=404, detail="Recinto not found")
    return recinto

@app.post("/recintos/{recinto_id}/movimientos", response_model=MovimientoResponse)
async def register_movement(recinto_id: int, movimiento: MovimientoCreate, db: Session = Depends(get_db)):
    recinto = db.query(Recinto).filter(Recinto.id == recinto_id).first()
    if not recinto:
        raise HTTPException(status_code=404, detail="Recinto not found")
    
    if movimiento.tipo not in ["entrada", "salida"]:
        raise HTTPException(status_code=400, detail="tipo must be 'entrada' or 'salida'")
    
    db_movimiento = Movimiento(
        recinto_id=recinto_id,
        tipo=movimiento.tipo,
        cantidad=movimiento.cantidad
    )
    db.add(db_movimiento)
    db.commit()
    db.refresh(db_movimiento)
    return db_movimiento

@app.get("/recintos/{recinto_id}/ocupacion", response_model=OcupacionResponse)
async def get_ocupacion(recinto_id: int, db: Session = Depends(get_db)):
    recinto = db.query(Recinto).filter(Recinto.id == recinto_id).first()
    if not recinto:
        raise HTTPException(status_code=404, detail="Recinto not found")
    
    entradas = db.query(func.sum(Movimiento.cantidad)).filter(
        Movimiento.recinto_id == recinto_id,
        Movimiento.tipo == "entrada"
    ).scalar() or 0
    
    salidas = db.query(func.sum(Movimiento.cantidad)).filter(
        Movimiento.recinto_id == recinto_id,
        Movimiento.tipo == "salida"
    ).scalar() or 0
    
    ocupacion_actual = entradas - salidas
    ocupacion_actual = max(0, ocupacion_actual)
    
    porcentaje = (ocupacion_actual / recinto.capacidad_maxima * 100) if recinto.capacidad_maxima > 0 else 0
    
    if porcentaje >= 100:
        estado = "AFORO_COMPLETO"
    elif porcentaje >= 85:
        estado = "CERCA_DEL_LIMITE"
    else:
        estado = "NORMAL"
    
    return OcupacionResponse(
        recinto_id=recinto_id,
        nombre=recinto.nombre,
        ocupacion_actual=ocupacion_actual,
        capacidad_maxima=recinto.capacidad_maxima,
        porcentaje_ocupacion=round(porcentaje, 2),
        estado=estado
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
