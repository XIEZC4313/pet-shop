import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../api';
import PetCard from '../components/PetCard';
import { PetGridSkeleton } from '../components/Skeleton';

const PET_TYPES = [
  { value: '', label: '全部', emoji: '✨' },
  { value: 'cat', label: '猫咪', emoji: '🐱' },
  { value: 'dog', label: '狗狗', emoji: '🐶' },
  { value: 'rabbit', label: '兔兔', emoji: '🐰' },
  { value: 'bird', label: '鸟类', emoji: '🐦' },
  { value: 'hamster', label: '仓鼠', emoji: '🐹' },
];

const SORTS = [
  { value: 'popular', label: '推荐排序' },
  { value: 'newest', label: '最新上架' },
  { value: 'price_asc', label: '价格低→高' },
  { value: 'price_desc', label: '价格高→低' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const petType = searchParams.get('petType') || '';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'popular';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (petType) params.set('petType', petType);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    params.set('sort', sort);
    params.set('page', page);
    params.set('limit', 12);

    api.get(`/products?${params}`).then(res => {
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    }).finally(() => setLoading(false));
  }, [petType, category, search, sort, page]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {category ? PET_TYPES.find(t => t.value === category)?.label + '专区' : '全部宠物'}
        </h1>
        <p className="text-text-light">共 {total} 只毛孩等待你的到来</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="搜索宠物名称..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-warm border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
          />
        </form>

        {/* Pet type tabs */}
        <div className="flex flex-wrap gap-2">
          {PET_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => { updateParam('petType', t.value); updateParam('category', ''); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (petType === t.value && !category) || (!petType && !category && t.value === '')
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-warm text-text-light hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-text-muted" />
          <div className="flex gap-2 flex-wrap">
            {SORTS.map(s => (
              <button
                key={s.value}
                onClick={() => updateParam('sort', s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sort === s.value
                    ? 'bg-primary text-white'
                    : 'bg-warm text-text-light hover:bg-primary/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <PetGridSkeleton count={12} />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-text-light text-lg">没有找到匹配的宠物</p>
          <button onClick={() => { setSearchInput(''); setSearchParams({}); }} className="mt-4 text-primary font-medium hover:underline">
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <PetCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => updateParam('page', String(p))}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                page === p
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-light hover:bg-primary/10 border border-border'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
