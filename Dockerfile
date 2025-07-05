# Usar Node.js como imagen base
FROM node:18-alpine

# Instalar dependencias del sistema para MariaDB
RUN apk add --no-cache mysql-client

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Instalar dependencias adicionales para backend
RUN npm install express mysql2 cors bcryptjs jsonwebtoken

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puertos (3000 para frontend, 3001 para backend)
EXPOSE 3000 3001

# Crear script de inicio
COPY start.sh ./
RUN chmod +x start.sh

# Comando para iniciar ambos servicios
CMD ["./start.sh"]