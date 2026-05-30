import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>🐾 寵物樂園</h4>
          <p>為您和毛孩打造最温暖的購物體驗</p>
        </div>
        <div>
          <h4>購物指南</h4>
          <Link to="/products">所有商品</Link>
          <Link to="/about">關於我們</Link>
          <Link to="/contact">聯絡我們</Link>
        </div>
        <div>
          <h4>會員服務</h4>
          <Link to="/orders">我的訂單</Link>
          <Link to="/favorites">收藏清單</Link>
          <Link to="/profile">個人資料</Link>
        </div>
        <div>
          <h4>聯絡資訊</h4>
          <p>📧 service@pet-shop.com</p>
          <p>📞 (02) 1234-5678</p>
          <p>🕐 週一至週五 09:00-18:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 寵物樂園 Pet Paradise. All rights reserved.</p>
      </div>
    </footer>
  );
}
