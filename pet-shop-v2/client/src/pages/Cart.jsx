import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const { items, total, updateQuantity, remove } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-text-muted mb-6" />
        <h2 className="text-2xl font-bold mb-2">购物车是空的</h2>
        <p className="text-text-light mb-6">快去挑选你喜欢的毛孩吧</p>
        <Link to="/shop" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors">
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">购物车 ({items.length}件)</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-border/50">
            <img
              src={item.product.image || 'https://placekitten.com/100/100'}
              alt={item.product.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/shop/${item.product.id}`} className="font-bold text-text hover:text-primary transition-colors">
                {item.product.name}
              </Link>
              <p className="text-xs text-text-muted mt-0.5">{item.product.breed} · {item.product.age}</p>
              <p className="text-lg font-bold text-primary mt-2">¥{item.product.price.toLocaleString()}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 bg-warm rounded-lg border border-border">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-l-lg transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-r-lg transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-text">¥{(item.product.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => remove(item.id)} className="p-2 text-text-muted hover:text-danger transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-light">商品合计</span>
          <span className="text-2xl font-extrabold text-primary">¥{total.toLocaleString()}</span>
        </div>
        <Link
          to="/checkout"
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          去结算
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
