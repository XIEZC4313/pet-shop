import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Share2, Shield, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(s => s.add);
  const isLoggedIn = useAuthStore(s => !!s.token);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
    }).catch(() => {
      navigate('/shop');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    addToCart(product.id, quantity);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 w-1/3 skeleton" />
            <div className="h-6 w-1/2 skeleton" />
            <div className="h-20 w-full skeleton" />
            <div className="h-12 w-1/3 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-light mb-6">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">全部宠物</Link>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-warm shadow-lg">
            <img
              src={product.image || 'https://placekitten.com/600/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full">
              推荐
            </span>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{product.category?.emoji}</span>
            <span className="text-sm text-text-muted">{product.category?.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">{product.name}</h1>

          <div className="flex flex-wrap gap-3 mb-4">
            {product.breed && (
              <span className="px-3 py-1 bg-warm rounded-full text-xs font-medium text-text-light">{product.breed}</span>
            )}
            {product.age && (
              <span className="px-3 py-1 bg-warm rounded-full text-xs font-medium text-text-light">{product.age}</span>
            )}
            <span className="px-3 py-1 bg-green-50 rounded-full text-xs font-medium text-green-600">库存 {product.stock}</span>
          </div>

          <div className="text-3xl font-extrabold text-primary mb-6">
            ¥{product.price.toLocaleString()}
          </div>

          {product.description && (
            <p className="text-text-light leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-text">数量</span>
            <div className="flex items-center gap-3 bg-warm rounded-xl border border-border">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg font-bold hover:bg-white rounded-l-xl transition-colors"
              >-</button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-4 py-2 text-lg font-bold hover:bg-white rounded-r-xl transition-colors"
              >+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/30"
            >
              <ShoppingCart className="w-5 h-5" />
              加入购物车
            </button>
            <button className="p-3.5 border-2 border-border rounded-xl hover:border-danger hover:text-danger transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-3.5 border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, text: '30天健康保障' },
              { icon: Truck, text: '全国包邮' },
              { icon: RefreshCw, text: '7天退换' },
            ].map(g => (
              <div key={g.text} className="flex flex-col items-center gap-1.5 p-3 bg-warm rounded-xl text-center">
                <g.icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-text-light">{g.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
