const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const breathingFile = path.join(__dirname, );

// Save breathing session
router.post('/', async (req, res) => {
  const { duration, breathCount } = req.body;
  try {
    const sessions = await fs.readJson(breathingFile);
    const newSession = { duration, breathCount, date: new Date().toISOString() };
    sessions.push(newSession);
    await fs.writeJson(breathingFile, sessions, { spaces: 2 });
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await fs.readJson(breathingFile);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;