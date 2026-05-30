import { Link, Outlet, useLocation } from 'react-router-dom';

const ADMIN_LINKS = [
  { path: '/admin', label: '📊 儀表板', exact: true },
  { path: '/admin/products', label: '📦 商品管理' },
  { path: '/admin/orders', label: '📋 訂單管理' },
  { path: '/admin/coupons', label: '🏷️ 優惠碼' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">⚙️ 管理後台</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
          <nav>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '100px' }}>
              {ADMIN_LINKS.map((link) => {
                const active = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      background: active ? '#FFF3E0' : 'transparent',
                      color: active ? '#F5A623' : '#3D3D3D',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
