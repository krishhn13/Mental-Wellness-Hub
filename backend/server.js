const express = require('express');

const path = require('path');
require('dotenv').config(); // Load environment variables from .env

const app = express();

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/journal', require('./routes/journal'));
app.use('/api/jokes', require('./routes/jokes'));
app.use('/api/games', require('./routes/games'));
app.use('/api/breathe', require('./routes/breathe'));
app.use('/api/stress', require('./routes/stress'));

// Serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} : http://localhost:${PORT}`));