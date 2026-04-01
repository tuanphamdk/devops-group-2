const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const sslConfig = shouldUseSsl ? { rejectUnauthorized: false } : false;

const pool = process.env.DATABASE_URL
   ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslConfig,
     })
   : new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'tododb',
        password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
        ssl: sslConfig,
     });

// ✅ AUTO-CREATE TABLE ON STARTUP
const initializeDatabase = async () => {
   try {
      await pool.query(`
         CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
      `);
      
      // Insert seed data if table is empty
      const result = await pool.query('SELECT COUNT(*) FROM todos');
      if (parseInt(result.rows[0].count) === 0) {
         await pool.query(`
            INSERT INTO todos (title, completed) VALUES
              ('Learn Docker', false),
              ('Setup CI/CD', true),
              ('Deploy to production', false)
            ON CONFLICT DO NOTHING;
         `);
         console.log('✅ Database initialized with seed data');
      } else {
         console.log('✅ Database table already exists');
      }
   } catch (err) {
      console.error('❌ Database initialization error:', err.message);
   }
};

// Initialize database on startup (not in test mode)
if (process.env.NODE_ENV !== 'test') {
   initializeDatabase();
}

// In-memory fallback for tests (avoids needing a running Postgres)
const useMemoryDb = process.env.NODE_ENV === 'test';
const memDb = {
   todos: [],
   nextId: 1,
};

app.get('/health', (req, res) => {
   res.json({ status: 'healthy', version: '1.0.0' });
});

// GET todos
app.get('/api/todos', async (req, res) => {
   try {
      if (useMemoryDb) return res.json(memDb.todos.slice().sort((a,b)=>a.id-b.id));
      const result = await pool.query('SELECT * FROM todos ORDER BY id');
      res.json(result.rows);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #2: Missing validation - will cause test to fail!
// STUDENT TODO: Add validation to reject empty title
app.post('/api/todos', async (req, res) => {
   try {
      const { title, completed = false } = req.body;

      // Validate title
      if (typeof title !== 'string' || title.trim().length === 0) {
         return res.status(400).json({ error: 'Title is required and cannot be empty' });
      }

      if (useMemoryDb) {
         const todo = { id: memDb.nextId++, title: title.trim(), completed: !!completed, created_at: new Date().toISOString() };
         memDb.todos.push(todo);
         return res.status(201).json(todo);
      }

      const result = await pool.query(
         'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
         [title, completed]
      );
      res.status(201).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #3: Missing DELETE endpoint - but test expects it!
// STUDENT TODO: Implement DELETE /api/todos/:id endpoint

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      if (useMemoryDb) {
         const idx = memDb.todos.findIndex(t => t.id === Number(id));
         if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
         memDb.todos.splice(idx, 1);
         return res.status(200).json({ message: 'Deleted' });
      }

      const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
      return res.status(200).json({ message: 'Deleted' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// BUG #4: Missing PUT endpoint for updating todos
// STUDENT TODO: Implement PUT /api/todos/:id endpoint

// UPDATE todo
app.put('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const { title, completed } = req.body;

      if (title !== undefined) {
         if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title cannot be empty' });
         }
      }
      if (useMemoryDb) {
         const todo = memDb.todos.find(t => t.id === Number(id));
         if (!todo) return res.status(404).json({ error: 'Todo not found' });
         if (title !== undefined) todo.title = title.trim();
         if (completed !== undefined) todo.completed = !!completed;
         return res.status(200).json(todo);
      }

      const result = await pool.query(
         'UPDATE todos SET title = COALESCE($2, title), completed = COALESCE($3, completed) WHERE id = $1 RETURNING *',
         [id, title, completed]
      );

      if (result.rowCount === 0) return res.status(404).json({ error: 'Todo not found' });
      return res.status(200).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

const port = process.env.PORT || 8080;

// Only start server when not running tests
if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
   });
}

// Export app for testing
module.exports = app;
