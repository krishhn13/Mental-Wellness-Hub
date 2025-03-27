const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const stressFile = path.join(__dirname, '../data/stress_tests.json');

// Save stress test
router.post('/', async (req, res) => {
  const { answers } = req.body;
  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  try {
    const tests = await fs.readJson(stressFile);
    const newTest = { answers, totalScore, date: new Date().toISOString() };
    tests.push(newTest);
    await fs.writeJson(stressFile, tests, { spaces: 2 });
    res.status(201).json(newTest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all stress tests
router.get('/', async (req, res) => {
  try {
    const tests = await fs.readJson(stressFile);
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;