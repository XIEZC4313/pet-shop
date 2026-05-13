import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Loading from '../components/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { productId: product.id, ...reviewForm });
      setReviewMsg('評價已送出！');
      setReviewForm({ rating: 5, comment: '' });
      // Refresh product to show new review
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      setReviewMsg(err.response?.data?.error || '送出失敗');
    }
  };

  if (loading) return <Loading />;
  if (!product) {
    return <div className="page"><div className="container"><h2>商品不存在</h2></div></div>;
  }

  const petEmoji = { dog: '🐕', cat: '🐈', bird: '🐦', fish: '🐟', small_pet: '🐹', other: '🐾' };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#F5A623' : '#E0E0E0', cursor: 'pointer', fontSize: '24px' }}
        onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}
      >★</span>
    ));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span>›</span>
          <Link to="/products">商品</Link>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          {/* Image */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '160px',
            minHeight: '400px',
          }}>
            {petEmoji[product.category?.petType] || '🎁'}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <span className="badge badge-primary" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {petEmoji[product.category.petType]} {product.category.name}
              </span>
            )}
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '12px 0' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#F5A623', fontSize: '18px' }}>
                {'★'.repeat(Math.floor(product.avgRating || 0))}
                {'☆'.repeat(5 - Math.floor(product.avgRating || 0))}
              </span>
              <span style={{ color: '#888', fontSize: '14px' }}>
                ({product.reviews?.length || 0} 則評價)
              </span>
            </div>

            <div style={{ fontSize: '36px', fontWeight: 800, color: '#FF6B6B', marginBottom: '16px' }}>
              ${product.price.toFixed(2)}
            </div>

            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '20px' }}>
              {product.description || '暫無描述'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge" style={{ background: product.stock > 0 ? '#E8F5E9' : '#FFEBEE', color: product.stock > 0 ? '#2E7D32' : '#C62828' }}>
                {product.stock > 0 ? `庫存 ${product.stock} 件` : '已售完'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #F0E8E0', borderRadius: '12px' }}>
                <button className="btn btn-sm" style={{ border: 'none', fontSize: '20px', padding: '8px 16px' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span style={{ padding: '0 16px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button className="btn btn-sm" style={{ border: 'none', fontSize: '20px', padding: '8px 16px' }}
                  onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
                🛒 加入購物車
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>📝 商品評價</h2>

          {user && (
            <form onSubmit={handleReview} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>撰寫評價</h3>
              <div style={{ marginBottom: '12px' }}>
                {renderStars(reviewForm.rating)}
              </div>
              <textarea
                placeholder="分享您對這個商品的使用心得..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                style={{ width: '100%', minHeight: '80px', padding: '12px', border: '2px solid #F0E8E0', borderRadius: '8px', marginBottom: '12px', resize: 'vertical' }}
              />
              {reviewMsg && <div className={`alert ${reviewMsg.includes('失敗') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '12px' }}>{reviewMsg}</div>}
              <button type="submit" className="btn btn-primary">送出評價</button>
            </form>
          )}

          {product.reviews?.length === 0 ? (
            <p style={{ color: '#888' }}>尚無評價，快來寫下第一個評價吧！</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {product.reviews?.map((review) => (
                <div key={review.id} style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{review.user.name}</strong>
                      <span style={{ color: '#F5A623' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      {new Date(review.createdAt).toLocaleDateString('zh-HK')}
                    </span>
                  </div>
                  {review.comment && <p style={{ color: '#666' }}>{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
