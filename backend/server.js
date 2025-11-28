// Place at: backend/server.js
// Minimal REST API matching the frontend storage API

import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

/* USERS */
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, name, age, weight, height, healthConditions, createdAt } = req.body;
    await pool.query(
      `INSERT INTO users (id, name, age, weight, height, health_conditions, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         age = VALUES(age),
         weight = VALUES(weight),
         height = VALUES(height),
         health_conditions = VALUES(health_conditions)`,
      [id, name, age, weight, height, healthConditions || null, createdAt || new Date()]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GOALS */
app.get('/api/goals/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM goals WHERE user_id = ?', [req.params.userId]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const { userId, dailyCalories, exerciseMinutes, waterIntake, medicines, createdAt } = req.body;
    await pool.query(
      `INSERT INTO goals (user_id, daily_calories, exercise_minutes, water_intake, medicines, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         daily_calories = VALUES(daily_calories),
         exercise_minutes = VALUES(exercise_minutes),
         water_intake = VALUES(water_intake),
         medicines = VALUES(medicines)`,
      [userId, dailyCalories, exerciseMinutes, waterIntake, JSON.stringify(medicines || []), createdAt || new Date()]
    );
    const [rows] = await pool.query('SELECT * FROM goals WHERE user_id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/goals/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM goals WHERE user_id = ?', [req.params.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PLANS */
app.get('/api/plans/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM weekly_plans WHERE user_id = ?', [req.params.userId]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    const { userId, days, generatedAt } = req.body;
    await pool.query(
      `INSERT INTO weekly_plans (user_id, days, generated_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         days = VALUES(days),
         generated_at = VALUES(generated_at)`,
      [userId, JSON.stringify(days || []), generatedAt || new Date()]
    );
    const [rows] = await pool.query('SELECT * FROM weekly_plans WHERE user_id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/plans/:userId', async (req, res) => {
  try {
    await pool.query('DELETE FROM weekly_plans WHERE user_id = ?', [req.params.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});