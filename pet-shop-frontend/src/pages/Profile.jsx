import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api';

export default function Profile() {
  const { user, login } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', form);
      // Refresh user data
      const res = await api.get('/auth/me');
      useAuthStore.setState({ user: res.data });
      setMsg('✅ 資料已更新');
    } catch {
      setMsg('❌ 更新失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="page-title">👤 個人資料</h1>

        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Email</label>
            <input type="email" value={user?.email || ''} readOnly style={{ background: '#F5F5F5' }} />
          </div>

          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>暱稱</label>
            <input
              type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>電話</label>
            <input
              type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="09xx-xxx-xxx"
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label>地址</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="填寫預設收件地址"
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          {msg && <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '儲存中...' : '儲存變更'}
          </button>
        </form>
      </div>
    </div>
  );
}
