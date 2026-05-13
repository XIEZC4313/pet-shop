const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'pawpaw-secret-key';

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '请先登录' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: '登录已过期' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).json({ error: '无权限' });
  next();
}

module.exports = { auth, adminOnly, SECRET };
