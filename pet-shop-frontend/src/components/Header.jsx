import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          🐾 <span>寵物</span>樂園
        </Link>

        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="搜尋寵物用品..." />
        </div>

        <nav className="header-nav">
          <Link to="/products">所有商品</Link>

          {user ? (
            <>
              <Link to="/orders">📦 訂單</Link>
              <Link to="/favorites">❤️</Link>
              <Link to="/profile">👤 {user.name}</Link>
              {user.isAdmin && <Link to="/admin">⚙️ 管理</Link>}
              <button onClick={logout} className="btn btn-sm btn-outline">
                登出
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              登入 / 註冊
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative' }}>
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
