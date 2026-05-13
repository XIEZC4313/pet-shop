import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import Loading from '../components/Loading';

const STATUS_MAP = {
  pending: { label: '待付款', color: '#FFB74D', bg: '#FFF3E0' },
  paid: { label: '已付款', color: '#4A90D9', bg: '#E3F2FD' },
  shipped: { label: '已出貨', color: '#81C784', bg: '#E8F5E9' },
  delivered: { label: '已送達', color: '#66BB6A', bg: '#E8F5E9' },
  cancelled: { label: '已取消', color: '#FF6B6B', bg: '#FFEBEE' },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="container">
        {location.state?.message && (
          <div className="alert alert-success" style={{ marginBottom: '16px' }}>{location.state.message}</div>
        )}
        <h1 className="page-title">📦 我的訂單</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>尚無訂單記錄</h3>
            <p>快去挑選寵物用品吧！</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>開始購物</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '14px', color: '#888' }}>訂單編號：#{order.id}</span>
                      <span style={{ fontSize: '14px', color: '#888', marginLeft: '16px' }}>
                        {new Date(order.createdAt).toLocaleDateString('zh-HK')}
                      </span>
                    </div>
                    <span style={{ background: status.bg, color: status.color, padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
                      {status.label}
                    </span>
                  </div>
                  <div>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px' }}>
                        <span>{item.product.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F5F0EB' }}>
                    <span style={{ fontWeight: 700, fontSize: '18px', color: '#FF6B6B' }}>總計 ${order.total.toFixed(2)}</span>
                    <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">查看詳情</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
