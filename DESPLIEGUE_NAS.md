# Despliegue en Synology NAS con MariaDB

## Requisitos Previos

1. **Docker instalado** en tu Synology NAS
2. **Acceso SSH** a tu NAS
3. **Puerto 3000** disponible para la aplicación

## Pasos de Instalación

### 1. Conectar a GitHub y descargar código
- Conecta este proyecto a GitHub usando el botón verde "GitHub"
- Clona el repositorio en tu NAS:
```bash
git clone https://github.com/tu-usuario/allways-energy.git
cd allways-energy
```

### 2. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita con tus datos seguros
nano .env
```

**Configura estas variables:**
```env
DB_ROOT_PASSWORD=tu_password_root_muy_seguro
DB_USER=allways_user
DB_PASSWORD=tu_password_muy_seguro
JWT_SECRET=clave_jwt_muy_larga_y_segura_aqui
```

### 3. Desplegar con Docker Compose
```bash
# Construir e iniciar los servicios
docker-compose up -d

# Ver logs para verificar
docker-compose logs -f
```

### 4. Verificar instalación
- **Aplicación**: http://tu-nas-ip:3000
- **API**: http://tu-nas-ip:3001/api/health
- **Login**: usuario `admin`, contraseña `allways2024`

## Estructura del Despliegue

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   React App     │◄──►│   Express API   │
│   Puerto 3000   │    │   Puerto 3001   │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MariaDB       │
                    │   Puerto 3306   │
                    └─────────────────┘
```

## Comandos Útiles

```bash
# Ver estado de servicios
docker-compose ps

# Reiniciar servicios
docker-compose restart

# Ver logs
docker-compose logs app
docker-compose logs mariadb

# Hacer backup de base de datos
docker exec allways_energy_db mysqldump -u root -p allways_energy > backup.sql

# Parar todos los servicios
docker-compose down

# Limpiar y reiniciar
docker-compose down -v
docker-compose up -d
```

## Acceso desde fuera de la red local

Para acceder desde internet, configura en tu router:
- **Puerto 3000** → IP de tu NAS (puerto 3000)
- Opcional: Usar un dominio dinámico (DynDNS)

## Seguridad Recomendada

1. **Cambiar credenciales por defecto**
2. **Usar HTTPS** con certificado SSL
3. **Configurar firewall** en el NAS
4. **Backups regulares** de la base de datos
5. **Actualizar contraseñas** periódicamente

## Troubleshooting

### Base de datos no se conecta
```bash
# Verificar que MariaDB esté corriendo
docker-compose logs mariadb

# Reiniciar solo MariaDB
docker-compose restart mariadb
```

### App no carga
```bash
# Verificar logs del frontend
docker-compose logs app

# Reconstruir contenedor
docker-compose build app
docker-compose up -d app
```

### Permisos de archivos
```bash
# Dar permisos al script de inicio
chmod +x start.sh
```

¡Tu aplicación Allways Energy estará disponible en http://tu-nas-ip:3000!