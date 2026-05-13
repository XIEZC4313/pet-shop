import { useState, useEffect } from 'react';
import api from '../../api';
import Loading from '../../components/Loading';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', stock: '0', categoryId: '' });
  const [msg, setMsg] = useState('');

  const fetchProducts = () => {
    api.get('/admin/products').then((res) => setProducts(res.data)).catch(() => {});
  };

  useEffect(() => {
    Promise.all([
      api.get('/admin/products'),
      api.get('/categories'),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, form);
        setMsg('✅ 商品已更新');
      } else {
        await api.post('/admin/products', form);
        setMsg('✅ 商品已建立');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', slug: '', description: '', price: '', stock: '0', categoryId: '' });
      fetchProducts();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.error || '操作失敗'}`);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.categoryId),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('確定要下架此商品？')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
      setMsg('✅ 商品已下架');
    } catch {
      setMsg('❌ 操作失敗');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontWeight: 700 }}>📦 商品管理</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', slug: '', description: '', price: '', stock: '0', categoryId: '' }); }}>
          {showForm ? '取消' : '＋ 新增商品'}
        </button>
      </div>

      {msg && <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginBottom: '16px' }}>{editing ? '編輯商品' : '新增商品'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>商品名稱 *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="product-name" />
            </div>
            <div className="input-group">
              <label>價格 *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>庫存</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="input-group">
              <label>分類 *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">選擇分類</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>描述</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: '80px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
            {editing ? '更新商品' : '建立商品'}
          </button>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFF8F0' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>名稱</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>分類</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>價格</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>庫存</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>狀態</th>
              <th style={{ textAlign: 'center', padding: '12px 16px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #F5F0EB' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{p.category?.name || '-'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{p.stock}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span className={`badge ${p.isActive ? 'badge-green' : 'badge-secondary'}`}>
                    {p.isActive ? '上架中' : '已下架'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button className="btn btn-sm btn-outline" style={{ marginRight: '8px' }} onClick={() => handleEdit(p)}>編輯</button>
                  <button className="btn btn-sm" style={{ color: '#FF6B6B' }} onClick={() => handleDelete(p.id)}>下架</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
