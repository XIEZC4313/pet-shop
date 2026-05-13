const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 获取商品列表
router.get('/', async (req, res) => {
  try {
    const { category, petType, search, sort, page = 1, limit = 12 } = req.query;
    const where = { isActive: true };

    if (category) where.category = { slug: category };
    if (petType) where.petType = petType;
    if (search) where.name = { contains: search };

    const orderBy = sort === 'price_asc' ? [{ price: 'asc' }]
      : sort === 'price_desc' ? [{ price: 'desc' }]
      : sort === 'newest' ? [{ createdAt: 'desc' }]
      : [{ isFeatured: 'asc' }, { createdAt: 'desc' }];

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, orderBy, skip, take: Number(limit),
        include: { category: { select: { name: true, slug: true, emoji: true } } }
      }),
      prisma.product.count({ where })
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取分类列表
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: { select: { name: true, slug: true, emoji: true } } }
    });
    if (!product) return res.status(404).json({ error: '商品不存在' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
