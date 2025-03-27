const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const gameScoresFile = path.join(__dirname, '../data/game_scores.json');

// Save game score
router.post('/score', async (req, res) => {
  const { game, score } = req.body;
  try {
    const scores = await fs.readJson(gameScoresFile);
    const newScore = { game, score, date: new Date().toISOString() };
    scores.push(newScore);
    await fs.writeJson(gameScoresFile, scores, { spaces: 2 });
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all scores
router.get('/scores', async (req, res) => {
  try {
    const scores = await fs.readJson(gameScoresFile);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;