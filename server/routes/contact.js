const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact — Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.status(201).json({ message: 'Message received successfully' });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/contact — Retrieve submissions (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.json(contacts);
  } catch (error) {
    console.error('Fetch contacts error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
