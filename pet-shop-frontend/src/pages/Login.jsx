import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(form.email, form.password, form.name);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '操作失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
            {isRegister ? '🐾 加入寵物樂園' : '🐾 歡迎回來'}
          </h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '24px', fontSize: '14px' }}>
            {isRegister ? '註冊帳號開始購物' : '登入您的帳號'}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>暱稱</label>
                <input
                  type="text" placeholder="您的暱稱"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Email</label>
              <input
                type="email" placeholder="example@email.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label>密碼</label>
              <input
                type="password" placeholder="至少 6 位字元"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required minLength={6}
              />
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? '處理中...' : isRegister ? '註冊' : '登入'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>
            {isRegister ? '已經有帳號？' : '還沒有帳號？'}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ color: '#F5A623', fontWeight: 600, marginLeft: '4px' }}
            >
              {isRegister ? '登入' : '註冊'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
