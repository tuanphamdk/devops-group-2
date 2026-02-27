const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// BUG #1: Wrong default password - doesn't match docker-compose!
const pool = new Pool({
   user: process.env.DB_USER || 'postgres',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'todoapp', // Bug Fix Might be postgres will check later 
   password: process.env.DB_PASSWORD || 'postgres', //Bug fix 1, 
   port: process.env.DB_PORT || 5432,
});

app.get('/health', (req, res) => {
   res.json({ status: 'healthy', version: '1.0.0' });
});

// GET todos
app.get('/api/todos', async (req, res) => {
   try {
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

      // STUDENT FIX: Add validation here!
      if(!title || title.trim() === '') { //Bug fix
         return res.status(400).json({ error: 'Title is required'}); // Bug fix 
      }
      // Hint: Check if title is empty or undefined
      // Return 400 status with error message if invalid

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
app.delete('/api/todos/:id', async (req, res) => { // Bug Fix
   try { 
      const { id } = req.params; 
      const result = await pool.query(
         'DELETE FROM todos WHERE id = $1 RETURNING *',
         [id]
      );
      if (result.rowCount === 0){
         return res.status(404).json({ error: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted', todo: result.rows[0]});
   } catch (err) {
      res.status(500).json({error: err.message});
   }
});
// BUG #4: Missing PUT endpoint for updating todos
// STUDENT TODO: Implement PUT /api/todos/:id endpoint
app.put('/api/todos/:id', async (req, res) => { // Bug Fix
   try {
      const {id} = req.params;
      const {title, completed} = req.body;
      
      const result = await pool.query(
         'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
         [title, completed, id]
      );
      if (result.rowCount === 0) {
         return res.status(404).json({ error: 'Todo not found'});
      }
      res.json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message});
   }
})

const port = process.env.PORT || 8080;

// BUG #5: Server starts even in test mode, causing port conflicts
// STUDENT FIX: Only start server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {  //Bug fix
app.listen(port, () => {
   console.log(`Backend running on port ${port}`);
});
}

// BUG #6: App not exported - tests can't import it!
// STUDENT FIX: Export the app module

module.exports = app; //Bug fix