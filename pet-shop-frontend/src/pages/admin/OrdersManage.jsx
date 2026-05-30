import { useState, useEffect } from 'react';
import api from '../../api';
import Loading from '../../components/Loading';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [msg, setMsg] = useState('');

  const fetchOrders = () => {
    const params = filter ? { status: filter } : {};
    api.get('/admin/orders', { params })
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      setMsg(`✅ 訂單 #${orderId} 狀態已更新為 ${status}`);
      fetchOrders();
    } catch {
      setMsg('❌ 更新失敗');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: '24px' }}>📋 訂單管理</h2>

      {msg && <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('')}>全部</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFF8F0' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>編號</th>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>會員</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>總金額</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>狀態</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>操作</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>日期</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderTop: '1px solid #F5F0EB' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{order.id}</td>
                <td style={{ padding: '12px 16px' }}>{order.user.name}<br /><span style={{ fontSize: '12px', color: '#888' }}>{order.user.email}</span></td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    style={{ padding: '4px 8px', border: '2px solid #F0E8E0', borderRadius: '8px', fontSize: '13px' }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                    disabled={order.status !== 'paid'}
                  >
                    出貨
                  </button>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#888', fontSize: '14px' }}>
                  {new Date(order.createdAt).toLocaleDateString('zh-HK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ padding: '24px', textAlign: 'center', color: '#888' }}>暫無訂單</p>}
      </div>
    </div>
  );
}
