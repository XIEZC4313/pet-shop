const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Cart is managed client-side with Zustand
// This provides server-side sync endpoints if needed

// POST /api/cart/sync - Sync cart to server (optional)
router.post('/sync', authenticate, async (req, res) => {
  // For now, cart is client-side only
  res.json({ message: 'Cart sync endpoint' });
});

module.exports = router;
