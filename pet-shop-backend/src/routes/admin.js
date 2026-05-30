const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'cancelled' } } }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: '獲取儀表板資料失敗' });
  }
});

// Products CRUD
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, _count: { select: { orderItems: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    console.error('Admin get products error:', err);
    res.status(500).json({ error: '獲取商品列表失敗' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, slug, description, price, stock, images, categoryId } = req.body;

    if (!name || !slug || !price || !categoryId) {
      return res.status(400).json({ error: '請填寫所有必填欄位' });
    }

    const product = await prisma.product.create({
      data: { name, slug, description, price: parseFloat(price), stock: parseInt(stock) || 0, images: images ? JSON.stringify(images) : "[]", categoryId: parseInt(categoryId) },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: '商品 slug 已存在' });
    }
    console.error('Create product error:', err);
    res.status(500).json({ error: '建立商品失敗' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, stock, images, isActive, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price: price ? parseFloat(price) : undefined, stock: stock !== undefined ? parseInt(stock) : undefined, images: images ? JSON.stringify(images) : undefined, isActive, categoryId: categoryId ? parseInt(categoryId) : undefined },
      include: { category: true },
    });

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: '更新商品失敗' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: '商品已下架' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: '刪除商品失敗' });
  }
});

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error('Admin get orders error:', err);
    res.status(500).json({ error: '獲取訂單列表失敗' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: '無效的訂單狀態' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: '更新訂單狀態失敗' });
  }
});

// Coupons management
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons);
  } catch (err) {
    console.error('Get coupons error:', err);
    res.status(500).json({ error: '獲取優惠碼列表失敗' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, discountType, discountValue, minAmount, maxUses, expiresAt } = req.body;
    const coupon = await prisma.coupon.create({
      data: { code, discountType, discountValue: parseFloat(discountValue), minAmount: minAmount ? parseFloat(minAmount) : null, maxUses: maxUses ? parseInt(maxUses) : null, expiresAt: expiresAt ? new Date(expiresAt) : null },
    });
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: '優惠碼 code 已存在' });
    }
    console.error('Create coupon error:', err);
    res.status(500).json({ error: '建立優惠碼失敗' });
  }
});

module.exports = router;
