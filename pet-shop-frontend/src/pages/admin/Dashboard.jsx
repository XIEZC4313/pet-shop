import { useState, useEffect } from 'react';
import api from '../../api';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!stats) return <div>無法載入資料</div>;

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: '24px' }}>📊 儀表板</h2>

      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>總訂單數</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#4A90D9' }}>{stats.totalOrders}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>總營業額</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#81C784' }}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>商品總數</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#F5A623' }}>{stats.totalProducts}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>會員總數</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#A78BFA' }}>{stats.totalUsers}</p>
        </div>
      </div>

      <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>近期訂單</h3>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFF8F0' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>訂單編號</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>會員</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px' }}>金額</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px' }}>狀態</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px' }}>日期</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id} style={{ borderTop: '1px solid #F5F0EB' }}>
                <td style={{ padding: '12px 16px' }}>#{order.id}</td>
                <td style={{ padding: '12px 16px' }}>{order.user.name}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span className={`badge badge-${order.status === 'cancelled' ? 'secondary' : order.status === 'delivered' ? 'green' : 'primary'}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#888', fontSize: '14px' }}>
                  {new Date(order.createdAt).toLocaleDateString('zh-HK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
