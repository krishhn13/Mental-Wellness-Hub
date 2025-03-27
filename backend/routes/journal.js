const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const journalFile = path.join(__dirname, '../data/journal.json');

// Get all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await fs.readJson(journalFile);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save journal entry
router.post('/', async (req, res) => {
  const { mood, text, date } = req.body;
  try {
    const entries = await fs.readJson(journalFile);
    const newEntry = { mood, text, date };
    entries.push(newEntry);
    await fs.writeJson(journalFile, entries, { spaces: 2 });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;