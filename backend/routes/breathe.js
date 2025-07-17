const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const breathingFile = path.join(__dirname,"../data/breathing_sessions.json");

// Save breathing session
router.post('/', async (req, res) => {
  const { duration, breathCount } = req.body;
  try {
    // Ensure the file exists, create empty array if it doesn't
    await fs.ensureFile(breathingFile);
    
    let sessions = [];
    try {
      sessions = await fs.readJson(breathingFile);
    } catch (readError) {
      // If file is empty or corrupted, start with empty array
      sessions = [];
    }
    
    const newSession = { duration, breathCount, date: new Date().toISOString() };
    sessions.push(newSession);
    await fs.writeJson(breathingFile, sessions, { spaces: 2 });
    res.status(201).json(newSession);
  } catch (err) {
    console.error('Error saving breathing session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions
router.get('/', async (req, res) => {
  try {
    // Ensure the file exists
    await fs.ensureFile(breathingFile);
    
    let sessions = [];
    try {
      sessions = await fs.readJson(breathingFile);
    } catch (readError) {
      // If file is empty or corrupted, return empty array
      sessions = [];
    }
    
    res.json(sessions);
  } catch (err) {
    console.error('Error reading breathing sessions:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;