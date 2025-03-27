const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const jokesFile = path.join(__dirname, '../data/jokes.json');

// Get all jokes
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const jokes = await fs.readJson(jokesFile);
    const filteredJokes = category ? jokes.filter(joke => joke.category === category) : jokes;
    res.json(filteredJokes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a joke
router.post('/', async (req, res) => {
  const { text, category } = req.body;
  try {
    const jokes = await fs.readJson(jokesFile);
    const newJoke = { text, category };
    jokes.push(newJoke);
    await fs.writeJson(jokesFile, jokes, { spaces: 2 });
    res.status(201).json(newJoke);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;