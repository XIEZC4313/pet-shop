import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../api';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.phone) {
      setError('請填寫收件資訊');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders', {
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        shippingAddress: form.address,
        paymentMethod: 'stripe',
      });

      // Create payment intent
      const paymentRes = await api.post('/payments/create-payment-intent', {
        orderId: res.data.id,
      });

      clearCart();
      navigate('/orders', { state: { message: '訂單已建立！' } });
    } catch (err) {
      setError(err.response?.data?.error || '建立訂單失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">🔐 結帳</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ marginBottom: '20px' }}>收件資訊</h3>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>收件人</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>聯絡電話 *</label>
                <input
                  type="tel" placeholder="09xx-xxx-xxx"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>收件地址 *</label>
                <textarea
                  placeholder="請填寫完整收件地址"
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>備註</label>
                <textarea
                  placeholder="如有特殊需求請註明..."
                  value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  style={{ minHeight: '60px', resize: 'vertical' }}
                />
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
              {loading ? '處理中...' : `確認付款 $${getTotal().toFixed(2)}`}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ marginBottom: '16px' }}>訂單摘要</h3>
              {items.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5F0EB', fontSize: '14px' }}>
                  <span>{product.name} × {quantity}</span>
                  <span style={{ fontWeight: 600 }}>${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '18px', fontWeight: 700 }}>
                <span>總計</span>
                <span style={{ color: '#FF6B6B' }}>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
