const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/payments/create-payment-intent
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: '訂單不存在' });
    }

    if (order.payment.length > 0) {
      return res.status(400).json({ error: '此訂單已建立付款' });
    }

    // Stripe integration placeholder
    // In production: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({ ... });

    const paymentIntent = {
      id: `pi_placeholder_${Date.now()}`,
      client_secret: `cs_placeholder_${Date.now()}`,
      amount: Math.round(order.total * 100),
    };

    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: order.total,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Create payment intent error:', err);
    res.status(500).json({ error: '建立付款失敗' });
  }
});

// POST /api/payments/webhook - Stripe webhook (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  res.json({ received: true });
});

module.exports = router;
