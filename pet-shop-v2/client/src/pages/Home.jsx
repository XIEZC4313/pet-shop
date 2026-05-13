import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, RefreshCw, Shield, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import PetCard from '../components/PetCard';
import { PetGridSkeleton } from '../components/Skeleton';

const BANNERS = [
  { title: '新朋友到家', subtitle: '幼宠用品全场 8 折，给毛孩最温暖的开始', emoji: '🐕', gradient: 'from-orange-400 to-pink-400' },
  { title: '猫咪派对', subtitle: '精选猫咪买二送一，让喵星人不再孤单', emoji: '🐱', gradient: 'from-purple-400 to-blue-400' },
  { title: '小宠新居', subtitle: '仓鼠、兔兔新到货，笼具配件超值组合', emoji: '🐹', gradient: 'from-green-400 to-teal-400' },
];

const CATEGORIES = [
  { slug: 'cat', name: '猫咪', emoji: '🐱', color: 'bg-orange-50 border-orange-200' },
  { slug: 'dog', name: '狗狗', emoji: '🐶', color: 'bg-amber-50 border-amber-200' },
  { slug: 'rabbit', name: '兔兔', emoji: '🐰', color: 'bg-pink-50 border-pink-200' },
  { slug: 'bird', name: '鸟类', emoji: '🐦', color: 'bg-sky-50 border-sky-200' },
  { slug: 'hamster', name: '仓鼠', emoji: '🐹', color: 'bg-purple-50 border-purple-200' },
];

const FEATURES = [
  { icon: Truck, title: '全国包邮', desc: '订单满 299 免运费' },
  { icon: RefreshCw, title: '7天退换', desc: '不满意无条件退换' },
  { icon: Shield, title: '健康保障', desc: '30天健康质保' },
  { icon: Headphones, title: '专业客服', desc: '饲养问题随时咨询' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    api.get('/products?limit=8&sort=popular').then(res => {
      setProducts(res.data.products);
    }).finally(() => setLoading(false));

    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${BANNERS[bannerIdx].gradient} py-16 sm:py-24`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="text-white max-w-lg">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-5xl font-extrabold mb-4"
                >
                  {BANNERS[bannerIdx].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl text-white/90 mb-6"
                >
                  {BANNERS[bannerIdx].subtitle}
                </motion.p>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <Link to="/shop" className="inline-block bg-white text-gray-800 font-bold px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all">
                    立即选购 →
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="hidden sm:block text-[120px] lg:text-[160px]"
              >
                {BANNERS[bannerIdx].emoji}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Banner controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === bannerIdx ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
        <button onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors hidden sm:block">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors hidden sm:block">
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            选择你的毛孩
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-2" />
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 ${cat.color} hover:shadow-md hover:scale-105 transition-all min-w-[100px]`}
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="font-bold text-sm text-text">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            热门推荐
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-2" />
          </h2>
          {loading ? (
            <PetGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <PetCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-full transition-all">
              浏览全部 →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(feat => (
              <div key={feat.title} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-text mb-1">{feat.title}</h3>
                <p className="text-sm text-text-light">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
