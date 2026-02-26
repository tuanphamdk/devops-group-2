-- init.sql: Database initialization script for PostgreSQL
-- Creates todos table and seeds initial rows

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (title, completed) VALUES
  ('Learn Docker', false),
  ('Setup CI/CD', true),
  ('Deploy to production', false)
ON CONFLICT DO NOTHING;
