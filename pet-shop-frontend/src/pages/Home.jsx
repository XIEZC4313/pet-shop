import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import '../styles/home.css';

const PET_TYPES = [
  { type: 'dog', label: '狗狗', emoji: '🐕', color: '#FFE0B2' },
  { type: 'cat', label: '貓咪', emoji: '🐈', color: '#E8F5E9' },
  { type: 'bird', label: '鳥類', emoji: '🐦', color: '#BBDEFB' },
  { type: 'fish', label: '魚類', emoji: '🐟', color: '#B2EBF2' },
  { type: 'small_pet', label: '小動物', emoji: '🐹', color: '#F3E5F5' },
];

const BANNER_ITEMS = [
  { emoji: '🐕', title: '新朋友到家？', subtitle: '幼犬用品全面 8 折', color: '#FF6B6B' },
  { emoji: '🐈', title: '貓咪派對', subtitle: '精選貓玩具買二送一', color: '#F5A623' },
  { emoji: '🐹', title: '小動物新居', subtitle: '籠具配件超值組合', color: '#81C784' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    api.get('/products?limit=8&sort=popular')
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));

    const timer = setInterval(() => {
      setBannerIdx((i) => (i + 1) % BANNER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="hero-banner" style={{ background: BANNER_ITEMS[bannerIdx].color }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              {BANNER_ITEMS[bannerIdx].emoji} {BANNER_ITEMS[bannerIdx].title}
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
              {BANNER_ITEMS[bannerIdx].subtitle}
            </p>
            <Link to="/products" className="btn btn-lg" style={{ background: 'white', color: BANNER_ITEMS[bannerIdx].color, fontWeight: 700 }}>
              立即選購 →
            </Link>
          </div>
          <div style={{ fontSize: '120px', lineHeight: 1 }}>
            {BANNER_ITEMS[bannerIdx].emoji}
          </div>
        </div>
        <div className="banner-dots">
          {BANNER_ITEMS.map((_, i) => (
            <span
              key={i}
              className={`banner-dot ${i === bannerIdx ? 'active' : ''}`}
              onClick={() => setBannerIdx(i)}
            />
          ))}
        </div>
      </div>

      {/* Pet Type Navigation */}
      <div className="section">
        <div className="container">
          <h2 className="section-title">毛孩種類</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {PET_TYPES.map((pet) => (
              <Link
                key={pet.type}
                to={`/products?pet_type=${pet.type}`}
                className="pet-type-card"
                style={{ background: pet.color }}
              >
                <span style={{ fontSize: '40px' }}>{pet.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#3D3D3D' }}>{pet.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Products */}
      <div className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">🔥 熱門商品</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/products" className="btn btn-outline btn-lg">
              瀏覽全部商品 →
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div style={{ padding: '24px' }}>
              <span style={{ fontSize: '40px' }}>🚚</span>
              <h4 style={{ margin: '12px 0 8px' }}>全港免運</h4>
              <p style={{ color: '#888', fontSize: '14px' }}>訂單滿 $300 免運費</p>
            </div>
            <div style={{ padding: '24px' }}>
              <span style={{ fontSize: '40px' }}>🔄</span>
              <h4 style={{ margin: '12px 0 8px' }}>七天退換</h4>
              <p style={{ color: '#888', fontSize: '14px' }}>不滿意包退換</p>
            </div>
            <div style={{ padding: '24px' }}>
              <span style={{ fontSize: '40px' }}>💳</span>
              <h4 style={{ margin: '12px 0 8px' }}>安全付款</h4>
              <p style={{ color: '#888', fontSize: '14px' }}>SSL 加密保護</p>
            </div>
            <div style={{ padding: '24px' }}>
              <span style={{ fontSize: '40px' }}>💬</span>
              <h4 style={{ margin: '12px 0 8px' }}>專業客服</h4>
              <p style={{ color: '#888', fontSize: '14px' }}>飼養問題即時解答</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
