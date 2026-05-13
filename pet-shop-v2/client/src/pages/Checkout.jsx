import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../api';
import useCartStore from '../store/cartStore';

export default function Checkout() {
  const { items, total, fetch: fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shippingName || !form.shippingPhone || !form.shippingAddress) {
      alert('请填写完整的收货信息');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/orders', form);
      setOrderId(res.data.id);
      setDone(true);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.error || '下单失败');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">下单成功！</h2>
        <p className="text-text-light mb-2">订单号: #{orderId}</p>
        <p className="text-text-light mb-8">我们会尽快安排发货，请耐心等待</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">
            查看订单
          </button>
          <button onClick={() => navigate('/shop')} className="px-6 py-2.5 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all">
            继续逛逛
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">确认订单</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-lg mb-4">收货信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">收货人</label>
                <input
                  name="shippingName"
                  value={form.shippingName}
                  onChange={handleChange}
                  placeholder="请输入收货人姓名"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">手机号</label>
                <input
                  name="shippingPhone"
                  value={form.shippingPhone}
                  onChange={handleChange}
                  placeholder="请输入手机号"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">收货地址</label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  placeholder="请输入详细收货地址"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-lg mb-4">支付方式</h3>
            <div className="space-y-3">
              {[
                { value: 'cod', label: '货到付款', desc: '收到宠物后付款' },
                { value: 'wechat', label: '微信支付', desc: '推荐使用' },
                { value: 'alipay', label: '支付宝', desc: '快捷支付' },
              ].map(m => (
                <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${form.paymentMethod === m.value ? 'bg-primary/5 border-2 border-primary' : 'border-2 border-border hover:border-primary/30'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={form.paymentMethod === m.value}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <div>
                    <div className="font-medium text-sm">{m.label}</div>
                    <div className="text-xs text-text-muted">{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '提交中...' : '确认下单'}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 sticky top-24">
            <h3 className="font-bold text-lg mb-4">订单详情</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.product.image || 'https://placekitten.com/50/50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-text-muted">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold">¥{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-text-light">合计</span>
                <span className="text-2xl font-extrabold text-primary">¥{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
