import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Loading from '../components/Loading';

const STATUS_MAP = {
  pending: { label: '待付款', color: '#FFB74D' },
  paid: { label: '已付款', color: '#4A90D9' },
  shipped: { label: '已出貨', color: '#81C784' },
  delivered: { label: '已送達', color: '#66BB6A' },
  cancelled: { label: '已取消', color: '#FF6B6B' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!order) return <div className="page"><div className="container"><h2>訂單不存在</h2></div></div>;

  const status = STATUS_MAP[order.status] || STATUS_MAP.pending;

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span>›</span>
          <Link to="/orders">我的訂單</Link>
          <span>›</span>
          <span>訂單 #{order.id}</span>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontWeight: 700 }}>訂單 #{order.id}</h2>
              <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                建立時間：{new Date(order.createdAt).toLocaleString('zh-HK')}
              </p>
            </div>
            <span style={{ background: `${status.color}20`, color: status.color, padding: '6px 16px', borderRadius: '20px', fontWeight: 700 }}>
              {status.label}
            </span>
          </div>

          <h3 style={{ marginBottom: '12px' }}>商品列表</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F0E8E0' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>商品</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>數量</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>單價</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>小計</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F5F0EB' }}>
                  <td style={{ padding: '12px 8px' }}>{item.product.name}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '12px 8px' }}>${item.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 700, fontSize: '18px' }}>總計</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 700, fontSize: '18px', color: '#FF6B6B' }}>
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {order.shippingAddress && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#FFF8F0', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '8px' }}>📮 收件資訊</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{order.shippingAddress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
