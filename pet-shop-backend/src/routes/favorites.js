const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/favorites
router.get('/', authenticate, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: '獲取收藏失敗' });
  }
});

// POST /api/favorites
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, productId },
    });

    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: '已收藏過此商品' });
    }
    console.error('Create favorite error:', err);
    res.status(500).json({ error: '收藏失敗' });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!favorite || favorite.userId !== req.user.id) {
      return res.status(404).json({ error: '收藏不存在' });
    }

    await prisma.favorite.delete({ where: { id: favorite.id } });
    res.json({ message: '已取消收藏' });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: '取消收藏失敗' });
  }
});

module.exports = router;
