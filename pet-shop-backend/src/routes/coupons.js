const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code, total } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ valid: false, error: '無效的優惠碼' });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ valid: false, error: '優惠碼已過期' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ valid: false, error: '優惠碼已達使用上限' });
    }

    if (total < coupon.minAmount) {
      return res.status(400).json({
        valid: false,
        error: `訂單金額需滿 $${coupon.minAmount} 才能使用此優惠碼`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = total * (coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
      },
    });
  } catch (err) {
    console.error('Validate coupon error:', err);
    res.status(500).json({ error: '驗證優惠碼失敗' });
  }
});

module.exports = router;
