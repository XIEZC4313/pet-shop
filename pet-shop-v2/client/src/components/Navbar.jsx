import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore(s => s.count());
  const toggleCart = useCartStore(s => s.toggle);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold shrink-0">
            <span className="text-2xl">🐾</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PawPaw
            </span>
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索宠物..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-warm border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
              />
            </div>
          </form>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
              全部宠物
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm font-medium text-text-light hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  {user.name}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-text-light hover:bg-warm hover:text-primary transition-colors">
                    <Package className="w-4 h-4" /> 我的订单
                  </Link>
                  <Link to="/favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-text-light hover:bg-warm hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" /> 收藏夹
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-light hover:bg-warm hover:text-primary transition-colors">
                    <User className="w-4 h-4" /> 个人中心
                  </Link>
                  <hr className="my-1 border-border" />
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50 w-full transition-colors">
                    <LogOut className="w-4 h-4" /> 退出登录
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
                登录
              </Link>
            )}

            <button onClick={toggleCart} className="relative p-2 text-text-light hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleCart} className="relative p-2 text-text-light">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-text-light">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜索宠物..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-warm border border-border outline-none text-sm"
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/shop" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-text-light">全部宠物</Link>
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-text-light">我的订单</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-text-light">个人中心</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="py-2 text-sm text-danger text-left">退出登录</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-primary">登录 / 注册</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
