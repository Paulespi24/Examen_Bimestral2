FROM node:18-alpine as frontend-build

WORKDIR /frontend

COPY ./frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY ./frontend/ .

# Usar index-new.html como index.html para el build
RUN rm -f index.html && mv index-new.html index.html

RUN npm run build

# Build final con Python
FROM python:3.11-slim

WORKDIR /app

COPY ./api-gateway/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./api-gateway/ .

# Copiar frontend compilado
COPY --from=frontend-build /frontend/dist /app/frontend_dist

CMD ["python", "main.py"]
