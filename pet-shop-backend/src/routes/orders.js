const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: '訂單至少需要一個商品' });
    }

    // Validate products and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        return res.status(400).json({ error: `商品 ${item.productId} 不存在` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `${product.name} 庫存不足` });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Apply coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive) {
        return res.status(400).json({ error: '無效的優惠碼' });
      }
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return res.status(400).json({ error: '優惠碼已過期' });
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ error: '優惠碼已達使用上限' });
      }
      if (total < coupon.minAmount) {
        return res.status(400).json({ error: `未達到最低消費金額 $${coupon.minAmount}` });
      }

      if (coupon.discountType === 'percent') {
        total = total * (1 - coupon.discountValue / 100);
      } else {
        total = Math.max(0, total - coupon.discountValue);
      }
    }

    // Create order and decrement stock
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Update coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Create order
      return tx.order.create({
        data: {
          userId: req.user.id,
          total,
          shippingAddress,
          paymentMethod,
          couponId: coupon?.id,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: '建立訂單失敗' });
  }
});

// GET /api/orders - Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: '獲取訂單失敗' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: '訂單不存在' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: '獲取訂單詳情失敗' });
  }
});

module.exports = router;
