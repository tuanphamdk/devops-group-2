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
   user: process.env.DB_USER || 'devops',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'mydb',
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
      console.log(err);
   }
});

// BUG #2: Missing validation - will cause test to fail!
// STUDENT TODO: Add validation to reject empty title
app.post('/api/todos', async (req, res) => {
   try {
      const { title, completed = false } = req.body;

      // STUDENT FIX: Add validation here!
      // Hint: Check if title is empty or undefined
      // Return 400 status with error message if invalid

      if (!title || title.trim() === '') {
         return res.status(400).json({error: 'Title is required'})
      }

      const result = await pool.query(
         'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
         [title, completed]
      );
      res.status(201).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
   }
});

// BUG #3: Missing DELETE endpoint - but test expects it!
// STUDENT TODO: Implement DELETE /api/todos/:id endpoint
app.delete('/api/todos/:id', async (req, res) => {
   try {
      const id  = req.params.id;
      const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      //validation if there is no todo
      if (result.rowCount === 0) {
         return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(200).end()
   }catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
      
   }
});


// BUG #4: Missing PUT endpoint for updating todos
// STUDENT TODO: Implement PUT /api/todos/:id endpoint
app.put('/api/todos/:id', async (req, res) => {
   try{
      const id= req.params.id;
      const newTitle = req.body.title;
      const newCompleted = req.body.completed;
      if (!newTitle || newTitle.trim() === '') {
         return res.status(400).json({success: false, message: 'New title is required'});
      }
      const result = await pool.query('UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *', [newTitle, newCompleted, id]);

      if (result.rowCount === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(result.rows[0]);
   }catch (err) {
      res.status(500).json({ error: err.message });
      console.log('error...')
   }
})

const port = process.env.PORT || 8080;

// BUG #5: Server starts even in test mode, causing port conflicts
// STUDENT FIX: Only start server if NOT in test mode
if (process.env.NODE_ENV !== 'test'){
   app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
   })
}
// thg tuan nua dem bat day commit lai

// BUG #6: App not exported - tests can't import it!
// STUDENT FIX: Export the app module
module.exports = app;