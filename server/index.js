const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'allways_energy',
  charset: 'utf8mb4'
};

// Pool de conexiones
const pool = mysql.createPool(dbConfig);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE username = ? AND activo = TRUE',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Rutas de clientes
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY fecha_creacion DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO clientes (nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones]
    );

    res.json({ id: result.insertId, message: 'Cliente creado correctamente' });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.put('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones } = req.body;
    
    await pool.execute(
      'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ?, nif = ?, localidad = ?, provincia = ?, codigo_postal = ?, contacto = ?, observaciones = ? WHERE id = ?',
      [nombre, telefono, email, direccion, nif, localidad, provincia, codigo_postal, contacto, observaciones, id]
    );

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.delete('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('Cerrando pool de conexiones...');
  await pool.end();
  process.exit(0);
});