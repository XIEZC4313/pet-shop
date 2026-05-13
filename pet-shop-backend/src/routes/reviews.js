const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/reviews
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: '請提供有效的評分（1-5）' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    const existing = await prisma.review.findFirst({
      where: { productId, userId: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ error: '您已經評價過此商品' });
    }

    const review = await prisma.review.create({
      data: { productId, userId: req.user.id, rating, comment },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: '建立評價失敗' });
  }
});

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: '獲取評價失敗' });
  }
});

module.exports = router;
