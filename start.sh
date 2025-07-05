#!/bin/sh

# Esperar a que MariaDB esté listo
echo "Esperando a que MariaDB esté listo..."
while ! mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    sleep 1
done

echo "MariaDB está listo. Iniciando servicios..."

# Iniciar backend en segundo plano
node server/index.js &

# Iniciar frontend
npm run preview