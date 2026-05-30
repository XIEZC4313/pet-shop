import { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    api.get('/favorites')
      .then((res) => setFavorites(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">❤️ 收藏清單</h1>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <h3>收藏清單是空的</h3>
            <p>瀏覽商品時點擊 ❤️ 即可收藏</p>
          </div>
        ) : (
          <div className="grid-4">
            {favorites.map((fav) => (
              <div key={fav.id}>
                <ProductCard product={fav.product} />
                <button
                  className="btn btn-sm"
                  style={{ color: '#FF6B6B', marginTop: '4px', width: '100%' }}
                  onClick={async () => {
                    await api.delete(`/favorites/${fav.id}`);
                    fetchFavorites();
                  }}
                >
                  移除收藏
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
