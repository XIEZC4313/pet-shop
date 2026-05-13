import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const PET_TYPES = [
  { type: '', label: '全部', emoji: '🐾' },
  { type: 'dog', label: '狗狗', emoji: '🐕' },
  { type: 'cat', label: '貓咪', emoji: '🐈' },
  { type: 'bird', label: '鳥類', emoji: '🐦' },
  { type: 'fish', label: '魚類', emoji: '🐟' },
  { type: 'small_pet', label: '小動物', emoji: '🐹' },
];

const SORT_OPTIONS = [
  { value: '', label: '最新上架' },
  { value: 'price_asc', label: '價格由低到高' },
  { value: 'price_desc', label: '價格由高到低' },
  { value: 'popular', label: '最受歡迎' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const petType = searchParams.get('pet_type') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (petType) params.pet_type = petType;
    if (category) params.category = category;
    if (search) params.search = search;

    api.get('/products', { params })
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [petType, category, sort, page, search]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">🐾 所有商品</h1>

        {/* Pet type filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {PET_TYPES.map((p) => (
            <button
              key={p.type}
              className={`pet-tag ${petType === p.type ? 'pet-tag-active' : ''}`}
              onClick={() => updateParams('pet_type', p.type)}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>

        {/* Category + Sort bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', padding: '12px 16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={category}
              onChange={(e) => updateParams('category', e.target.value)}
              style={{ padding: '8px 12px', border: '2px solid #F0E8E0', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="">全部分類</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#888' }}>共 {total} 件商品</span>
            <select
              value={sort}
              onChange={(e) => updateParams('sort', e.target.value)}
              style={{ padding: '8px 12px', border: '2px solid #F0E8E0', borderRadius: '8px', fontSize: '14px' }}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>😔 沒有找到商品</h3>
            <p>試試看其他搜尋條件</p>
          </div>
        ) : (
          <>
            <div className="grid-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => updateParams('page', String(page - 1))}
                >
                  上一頁
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => updateParams('page', String(p))}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => updateParams('page', String(page + 1))}
                >
                  下一頁
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
