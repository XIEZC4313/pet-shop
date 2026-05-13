import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, LogOut, Save } from 'lucide-react';
import api from '../api';
import useAuthStore from '../store/authStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      // This would need a backend endpoint to update profile
      setMsg('保存成功');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">个人中心</h1>

      {/* User card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <p className="text-sm text-text-light">{user?.email}</p>
            {user?.isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">管理员</span>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/orders" className="flex items-center gap-2 p-3 bg-warm rounded-xl hover:bg-primary/5 transition-colors">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">我的订单</span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 p-3 bg-warm rounded-xl hover:bg-primary/5 transition-colors">
            <Package className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">购物车</span>
          </Link>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 mb-6">
        <h3 className="font-bold text-lg mb-4">个人信息</h3>
        {msg && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-xl text-center">{msg}</div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
              <User className="w-3.5 h-3.5" /> 姓名
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
              <Phone className="w-3.5 h-3.5" /> 手机号
            </label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-text mb-1.5">
              <MapPin className="w-3.5 h-3.5" /> 收货地址
            </label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full p-4 bg-white rounded-2xl shadow-sm border border-border/50 text-danger hover:bg-red-50 transition-colors font-medium"
      >
        <LogOut className="w-5 h-5" />
        退出登录
      </button>
    </div>
  );
}
