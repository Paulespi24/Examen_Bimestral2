from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
from pathlib import Path
from config import AFORO_SERVICE_URL, PERMISOS_SERVICE_URL

app = FastAPI(title="CarnavalLogistics API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Encontrar frontend compilado
frontend_paths = [
    Path("/app/frontend_dist"),  
    Path(__file__).parent.parent / "frontend" / "dist",
    Path(__file__).parent.parent / "frontend",
]

frontend_path = None
for path in frontend_paths:
    if path.exists():
        frontend_path = path
        print(f"✓ Frontend encontrado en: {frontend_path}")
        break

if frontend_path:
    assets_path = frontend_path / "assets"
    if assets_path.exists():
        print(f"✓ Assets montados desde: {assets_path}")
        app.mount("/assets", StaticFiles(directory=str(assets_path)), name="static")

@app.get("/health")
async def health():
    return {"status": "ok"}

# ============ Aforo Service Routes ============

@app.post("/aforo/recintos")
async def create_recinto(request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AFORO_SERVICE_URL}/recintos", json=request_data)
        return response.json()

@app.get("/aforo/recintos")
async def list_recintos():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AFORO_SERVICE_URL}/recintos")
        return response.json()

@app.get("/aforo/recintos/{recinto_id}")
async def get_recinto(recinto_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AFORO_SERVICE_URL}/recintos/{recinto_id}")
        return response.json()

@app.post("/aforo/recintos/{recinto_id}/movimientos")
async def register_movement(recinto_id: int, request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AFORO_SERVICE_URL}/recintos/{recinto_id}/movimientos", json=request_data)
        return response.json()

@app.get("/aforo/recintos/{recinto_id}/ocupacion")
async def get_ocupacion(recinto_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AFORO_SERVICE_URL}/recintos/{recinto_id}/ocupacion")
        return response.json()

# ============ Permisos Service Routes ============

@app.get("/permisos/comerciantes")
async def list_comerciantes():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PERMISOS_SERVICE_URL}/comerciantes")
        return response.json()

@app.post("/permisos/comerciantes")
async def create_comerciante(request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{PERMISOS_SERVICE_URL}/comerciantes", json=request_data)
        return response.json()

@app.get("/permisos/puestos")
async def list_puestos():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PERMISOS_SERVICE_URL}/puestos")
        return response.json()

@app.post("/permisos/puestos")
async def create_puesto(request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{PERMISOS_SERVICE_URL}/puestos", json=request_data)
        return response.json()

@app.get("/permisos/permisos")
async def list_permisos():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PERMISOS_SERVICE_URL}/permisos")
        return response.json()

@app.post("/permisos/permisos")
async def create_permiso(request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{PERMISOS_SERVICE_URL}/permisos", json=request_data)
        return response.json()

@app.get("/permisos/permisos/{permiso_id}")
async def get_permiso(permiso_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PERMISOS_SERVICE_URL}/permisos/{permiso_id}")
        return response.json()

@app.patch("/permisos/permisos/{permiso_id}")
async def update_permiso(permiso_id: int, request_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.patch(f"{PERMISOS_SERVICE_URL}/permisos/{permiso_id}", json=request_data)
        return response.json()

# ============ Frontend SPA Routes ============

@app.get("/")
async def root():
    """Servir la página principal"""
    if not frontend_path:
        return {"message": "Welcome to CarnavalLogistics API Gateway"}
    index_path = frontend_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "Welcome"}

@app.get("/{path:path}")
async def serve_static(path: str):
    """Servir archivos estáticos y SPA fallback"""
    if not frontend_path:
        raise HTTPException(status_code=404, detail="Frontend not found")
    
    file_path = (frontend_path / path).resolve()
    
    # Prevenir path traversal
    if not str(file_path).startswith(str(frontend_path.resolve())):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Servir archivo si existe
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    
    # SPA fallback a index.html
    index_path = frontend_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    
    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
