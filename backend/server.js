const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// FIX #1: Correct default password to match docker-compose
const pool = new Pool({
   user: process.env.DB_USER || 'devops',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'devops',
   password: process.env.DB_PASSWORD || 'devops123',
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

// // FIX #2: Added validation for empty title
// app.post('/api/todos', async (req, res) => {
//    try {
//       const { title, completed = false } = req.body;

//       if (!title || title.trim() === '') {
//          return res.status(400).json({ error: 'Title is required' });
//       }

//       const result = await pool.query(
//          'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
//          [title, completed]
//       );
//       res.status(201).json(result.rows[0]);
//    } catch (err) {
//       res.status(500).json({ error: err.message });
//    }
// });

// FIX #3: Implemented DELETE endpoint
app.delete('/api/todos/:id', async (req, res) => {
   try {
      const id  = req.params.id;
      const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
         return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(200).end();
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// FIX #4: Implemented PUT endpoint
app.put('/api/todos/:id', async (req, res) => {
   try{
      const id = req.params.id;
      const newTitle = req.body.title;
      const newCompleted = req.body.completed;
      
      if (!newTitle || newTitle.trim() === '') {
         return res.status(400).json({ success: false, message: 'New title is required' });
      }
      
      const result = await pool.query(
         'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *', 
         [newTitle, newCompleted, id]
      );

      if (result.rowCount === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

const port = process.env.PORT || 8080;

// FIX #5: Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
   });
}

// FIX #6: Export the app module for testing
module.exports = app;