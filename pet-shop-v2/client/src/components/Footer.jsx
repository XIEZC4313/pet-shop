import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-warm-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-3">
              <span className="text-2xl">🐾</span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PawPaw</span>
            </div>
            <p className="text-sm text-text-light leading-relaxed">
              用心挑选每一只毛孩，给你最温暖的陪伴。所有宠物均经过健康检查，疫苗齐全。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-text mb-3">快速链接</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop?petType=cat" className="text-sm text-text-light hover:text-primary transition-colors">猫咪专区</Link>
              <Link to="/shop?petType=dog" className="text-sm text-text-light hover:text-primary transition-colors">狗狗专区</Link>
              <Link to="/shop?petType=rabbit" className="text-sm text-text-light hover:text-primary transition-colors">兔兔专区</Link>
              <Link to="/shop" className="text-sm text-text-light hover:text-primary transition-colors">全部宠物</Link>
            </div>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-bold text-text mb-3">服务保障</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-light">7天无理由退换</span>
              <span className="text-sm text-text-light">全国包邮</span>
              <span className="text-sm text-text-light">健康质保30天</span>
              <span className="text-sm text-text-light">终身饲养咨询</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-text mb-3">联系我们</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-light">客服电话: 400-PAW-PAW</span>
              <span className="text-sm text-text-light">微信: PawPawPet</span>
              <span className="text-sm text-text-light">工作时间: 9:00-21:00</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-center gap-1 text-sm text-text-muted">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-danger fill-danger" />
          <span>by PawPaw Team</span>
        </div>
      </div>
    </footer>
  );
}
