import { useState, useEffect } from 'react';
import api from '../../api';
import Loading from '../../components/Loading';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'percent', discountValue: '', minAmount: '', maxUses: '', expiresAt: '' });
  const [msg, setMsg] = useState('');

  const fetchCoupons = () => {
    api.get('/admin/coupons').then((res) => setCoupons(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchCoupons().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', form);
      setMsg('✅ 優惠碼已建立');
      setShowForm(false);
      setForm({ code: '', discountType: 'percent', discountValue: '', minAmount: '', maxUses: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.error || '操作失敗'}`);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontWeight: 700 }}>🏷️ 優惠碼管理</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '＋ 新增優惠碼'}
        </button>
      </div>

      {msg && <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginBottom: '16px' }}>新增優惠碼</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>優惠碼 *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="SUMMER2025" />
            </div>
            <div className="input-group">
              <label>折扣類型</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percent">百分比 (%)</option>
                <option value="fixed">固定金額</option>
              </select>
            </div>
            <div className="input-group">
              <label>折扣值 *</label>
              <input type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required placeholder={form.discountType === 'percent' ? '10' : '100'} />
            </div>
            <div className="input-group">
              <label>最低消費</label>
              <input type="number" step="0.01" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} placeholder="0" />
            </div>
            <div className="input-group">
              <label>使用上限</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="不限" />
            </div>
            <div className="input-group">
              <label>到期日</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>建立優惠碼</button>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFF8F0' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>優惠碼</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>折扣</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>使用次數</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>到期日</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>狀態</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid #F5F0EB' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace' }}>{c.code}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('zh-HK') : '永久'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span className={`badge ${c.isActive ? 'badge-green' : 'badge-secondary'}`}>
                    {c.isActive ? '啟用' : '停用'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p style={{ padding: '24px', textAlign: 'center', color: '#888' }}>暫無優惠碼</p>}
      </div>
    </div>
  );
}
