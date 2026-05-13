const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(auth);

// 获取购物车
router.get('/', async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加到购物车
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } }
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true }
      });
    } else {
      item = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity },
        include: { product: true }
      });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新数量
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
      return res.json({ deleted: true });
    }
    const item = await prisma.cartItem.update({
      where: { id: Number(req.params.id) },
      data: { quantity },
      include: { product: true }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
