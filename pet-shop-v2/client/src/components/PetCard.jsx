import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function PetCard({ product }) {
  const addToCart = useCartStore(s => s.add);
  const isLoggedIn = useAuthStore(s => !!s.token);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/shop/${product.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/50">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-warm">
          <img
            src={product.image || `https://placekitten.com/400/400`}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.isFeatured && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              推荐
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">{product.category?.emoji}</span>
            <span className="text-xs text-text-muted">{product.breed || product.category?.name}</span>
          </div>
          <h3 className="font-bold text-text text-base mb-1 truncate">{product.name}</h3>
          <div className="flex items-center gap-2 text-xs text-text-light mb-3">
            {product.age && <span>{product.age}</span>}
            {product.age && <span>·</span>}
            <span>库存 {product.stock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ¥{product.price.toLocaleString()}
            </span>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              加入购物车
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
