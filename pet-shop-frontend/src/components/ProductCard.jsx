import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span style={{ color: '#F5A623', fontSize: '14px' }}>
        {'★'.repeat(full)}
        {half && '½'}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  const petEmoji = {
    dog: '🐕', cat: '🐈', bird: '🐦', fish: '🐟', small_pet: '🐹', other: '🐾',
  };

  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <div
          style={{
            height: '200px',
            background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
          }}
        >
          {petEmoji[product.category?.petType] || '🎁'}
        </div>
      </Link>
      <div style={{ padding: '16px' }}>
        {product.category && (
          <span className="badge badge-primary" style={{ marginBottom: '8px', display: 'inline-block' }}>
            {petEmoji[product.category.petType] || ''} {product.category.name}
          </span>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 style={{ fontSize: '16px', margin: '8px 0', color: '#3D3D3D', fontWeight: 600 }}>
            {product.name}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {renderStars(product.avgRating)}
          {product.reviewCount > 0 && (
            <span style={{ fontSize: '12px', color: '#888' }}>({product.reviewCount})</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#FF6B6B' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? '加入購物車' : '已售完'}
          </button>
        </div>
      </div>
    </div>
  );
}
