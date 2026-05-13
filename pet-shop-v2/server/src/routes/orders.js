const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(auth);

// 创建订单
router.post('/', async (req, res) => {
  try {
    const { shippingName, shippingPhone, shippingAddress, paymentMethod = 'cod' } = req.body;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) return res.status(400).json({ error: '购物车为空' });

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        shippingName,
        shippingPhone,
        shippingAddress,
        paymentMethod,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // 清空购物车
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取订单列表
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个订单
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: '订单不存在' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
