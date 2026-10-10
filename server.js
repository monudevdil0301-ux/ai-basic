/**
 * server.js
 * Express server entry point.
 */

require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  console.warn('\n⚠️  GEMINI_API_KEY is not set in .env');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/habits', require('./routes/habits'));
app.use('/api/coach', require('./routes/coach'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ AI Habit Coach running at http://localhost:${PORT}\n`);
});
