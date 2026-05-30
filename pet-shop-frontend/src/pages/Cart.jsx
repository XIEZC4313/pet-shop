import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api';

export default function Cart() {
  const { items, updateQuantity, removeItem, coupon, setCoupon, getSubtotal, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponCode.trim(), total: getSubtotal() });
      if (res.data.valid) {
        setCoupon(res.data.coupon);
        setCouponMsg('✅ 優惠碼已套用！');
      }
    } catch (err) {
      setCouponMsg(`❌ ${err.response?.data?.error || '無效的優惠碼'}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h3>🛒 購物車是空的</h3>
            <p>快去逛逛寵物用品吧！</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
              瀏覽商品
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">🛒 購物車</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card" style={{ display: 'flex', gap: '16px', padding: '16px' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px', flexShrink: 0,
                }}>
                  🎁
                </div>
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${product.id}`} style={{ fontWeight: 600, fontSize: '16px', color: '#3D3D3D' }}>
                    {product.name}
                  </Link>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#FF6B6B', margin: '8px 0' }}>
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #F0E8E0', borderRadius: '8px' }}>
                      <button className="btn btn-sm" style={{ padding: '4px 12px', fontSize: '16px' }}
                        onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                      <span style={{ padding: '0 12px', fontWeight: 600 }}>{quantity}</span>
                      <button className="btn btn-sm" style={{ padding: '4px 12px', fontSize: '16px' }}
                        onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                    </div>
                    <button className="btn btn-sm" style={{ color: '#FF6B6B' }}
                      onClick={() => removeItem(product.id)}>🗑️ 移除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>訂單摘要</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#888' }}>小計</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>

              {coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#81C784' }}>
                  <span>優惠折扣 ({coupon.code})</span>
                  <span>-${(getSubtotal() - getTotal()).toFixed(2)}</span>
                </div>
              )}

              <div style={{ borderTop: '2px solid #F0E8E0', paddingTop: '12px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
                  <span>總計</span>
                  <span style={{ color: '#FF6B6B' }}>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div style={{ margin: '16px 0', display: 'flex', gap: '8px' }}>
                <input
                  type="text" placeholder="輸入優惠碼"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '2px solid #F0E8E0', borderRadius: '8px', fontSize: '14px' }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleApplyCoupon}>套用</button>
              </div>
              {couponMsg && <div style={{ fontSize: '13px', marginBottom: '8px' }}>{couponMsg}</div>}

              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
                前往結帳
              </Link>
              <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '14px' }}>
                繼續購物
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
