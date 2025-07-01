-- ESQUEMA DE BASE DE DATOS ALLWAYS ENERGY
-- Para MariaDB/MySQL

CREATE DATABASE allways_energy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE allways_energy;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    nif VARCHAR(20) UNIQUE NOT NULL,
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    codigo_postal VARCHAR(10),
    contacto VARCHAR(100),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de presupuestos
CREATE TABLE presupuestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    numero VARCHAR(50) UNIQUE NOT NULL,
    fecha DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'convertido') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabla de items de presupuesto
CREATE TABLE items_presupuesto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    presupuesto_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE CASCADE
);

-- Tabla de facturas
CREATE TABLE facturas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    presupuesto_id INT,
    numero VARCHAR(50) UNIQUE NOT NULL,
    fecha DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'pagada') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE SET NULL
);

-- Tabla de items de factura
CREATE TABLE items_factura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE
);

-- Tabla de eventos/calendario
CREATE TABLE eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    cliente_id INT,
    tipo ENUM('reunion', 'instalacion', 'mantenimiento', 'otro') DEFAULT 'otro',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_clientes_nif ON clientes(nif);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_presupuestos_cliente ON presupuestos(cliente_id);
CREATE INDEX idx_presupuestos_numero ON presupuestos(numero);
CREATE INDEX idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX idx_facturas_numero ON facturas(numero);
CREATE INDEX idx_eventos_fecha ON eventos(fecha_inicio);
CREATE INDEX idx_eventos_cliente ON eventos(cliente_id);

-- Datos de ejemplo
INSERT INTO usuarios (username, password_hash, email, nombre) VALUES 
('admin', '$2b$10$example_hash_here', 'admin@allwaysenergy.com', 'Administrador');

INSERT INTO clientes (nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones) VALUES 
('Juan Pérez García', '+34 612 345 678', 'juan.perez@email.com', 'Calle Mayor, 123', '12345678A', 'Madrid', 'Madrid', '28001', 'Juan Pérez', 'Cliente interesado en instalación solar'),
('María López Fernández', '+34 623 456 789', 'maria.lopez@email.com', 'Avenida de la Paz, 45', '87654321B', 'Barcelona', 'Barcelona', '08001', 'María López', 'Empresa mediana, necesita estudio energético'),
('Sistemas Energéticos SL', '+34 634 567 890', 'info@sistemasenerg.com', 'Polígono Industrial, Nave 12', 'B12345678', 'Valencia', 'Valencia', '46001', 'Carlos Ruiz', 'Cliente corporativo, instalaciones de gran tamaño');