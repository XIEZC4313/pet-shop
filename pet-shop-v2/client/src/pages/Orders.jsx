import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const STATUS_MAP = {
  pending: { label: '待发货', color: 'text-amber-600 bg-amber-50', icon: Clock },
  paid: { label: '已付款', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  shipped: { label: '已发货', color: 'text-purple-600 bg-purple-50', icon: Truck },
  delivered: { label: '已完成', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="w-20 h-20 mx-auto text-text-muted mb-6" />
        <h2 className="text-2xl font-bold mb-2">暂无订单</h2>
        <p className="text-text-light mb-6">快去挑选你喜欢的毛孩吧</p>
        <Link to="/shop" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors">
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">我的订单</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
          const StatusIcon = status.icon;
          return (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-muted">订单号: #{order.id}</span>
                  <span className="text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.image || 'https://placekitten.com/50/50'}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-text-muted">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">¥{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-sm text-text-light">
                  共 {order.items.reduce((s, i) => s + i.quantity, 0)} 件
                </span>
                <span className="text-lg font-bold text-primary">
                  合计: ¥{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
