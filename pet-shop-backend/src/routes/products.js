const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, pet_type, search, sort, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };

    if (category) {
      where.categoryId = parseInt(category);
    }

    if (pet_type) {
      where.category = { petType: pet_type };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { reviews: { _count: 'desc' } };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, reviews: { select: { rating: true } } },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((p) => {
      const avgRating = p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null;
      const { reviews, ...productData } = p;
      return { ...productData, avgRating, reviewCount: p.reviews.length };
    });

    res.json({
      products: productsWithRating,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: '獲取商品列表失敗' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: '商品不存在' });
    }

    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

    res.json({ ...product, avgRating });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: '獲取商品詳情失敗' });
  }
});

module.exports = router;
