# 宠物乐园 - 全方位宠物用品电商网站

一个功能完整的宠物用品电商平台，支持商品浏览、购物车、下单、用户管理、评价、收藏、优惠券等核心电商功能。

## 功能特性

### 用户端
- **首页展示** - 轮播横幅、分类导航、精选商品推荐
- **商品浏览** - 分类筛选、搜索、排序、分页
- **商品详情** - 商品图片、描述、库存、评价
- **购物车** - 商品添加、数量调整、删除
- **订单结算** - 收货地址、支付方式、优惠券
- **订单管理** - 历史订单、订单状态跟踪
- **商品收藏** - 收藏/取消收藏商品
- **商品评价** - 评分 + 评论
- **用户中心** - 注册/登录、个人信息管理

### 后台管理
- 数据统计仪表盘
- 商品管理（CRUD）
- 订单管理
- 优惠券管理

## 技术栈

### 前端 (`pet-shop-frontend/`)
| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| React Router v7 | 路由管理 |
| Zustand | 状态管理 |
| Axios | HTTP 请求 |
| Vite | 构建工具 |
| Tailwind CSS | 样式框架 |

### 后端 (`pet-shop-backend/`)
| 技术 | 用途 |
|------|------|
| Express 5 | Web 框架 |
| Prisma ORM | 数据库 ORM |
| PostgreSQL | 数据库 |
| bcryptjs | 密码加密 |
| jsonwebtoken | JWT 认证 |
| Docker Compose | 数据库容器化 |

## 项目结构

```
pet-shop/
├── pet-shop-frontend/          # React 前端
│   ├── src/
│   │   ├── api/               # Axios 配置
│   │   ├── assets/            # 静态资源
│   │   ├── components/        # 公共组件
│   │   │   ├── Header.jsx     # 导航栏
│   │   │   ├── Footer.jsx     # 页脚
│   │   │   ├── ProductCard.jsx # 商品卡片
│   │   │   └── ProtectedRoute.jsx # 路由守卫
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home.jsx       # 首页
│   │   │   ├── ProductList.jsx # 商品列表
│   │   │   ├── ProductDetail.jsx # 商品详情
│   │   │   ├── Cart.jsx       # 购物车
│   │   │   ├── Checkout.jsx   # 结算页
│   │   │   ├── Favorites.jsx  # 收藏夹
│   │   │   ├── OrderHistory.jsx # 订单历史
│   │   │   ├── OrderDetail.jsx # 订单详情
│   │   │   ├── Login.jsx      # 登录/注册
│   │   │   ├── Profile.jsx    # 个人中心
│   │   │   └── admin/         # 后台管理页面
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ProductsManage.jsx
│   │   │       ├── OrdersManage.jsx
│   │   │       └── CouponsManage.jsx
│   │   ├── store/             # Zustand 状态
│   │   └── styles/            # CSS 样式
│   └── package.json
│
├── pet-shop-backend/           # Express 后端
│   ├── prisma/
│   │   ├── schema.prisma      # 数据模型
│   │   ├── seed.js            # 种子数据
│   │   └── migrations/        # 数据库迁移
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   │   ├── auth.js        # 认证
│   │   │   ├── products.js    # 商品
│   │   │   ├── categories.js  # 分类
│   │   │   ├── cart.js        # 购物车
│   │   │   ├── orders.js      # 订单
│   │   │   ├── reviews.js     # 评价
│   │   │   ├── favorites.js   # 收藏
│   │   │   ├── coupons.js     # 优惠券
│   │   │   ├── payments.js    # 支付
│   │   │   └── admin.js       # 后台管理
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT 中间件
│   │   └── app.js             # 入口
│   ├── docker-compose.yml     # PostgreSQL 容器
│   └── package.json
│
├── render.yaml                 # Render 部署配置
└── README.md
```

## 数据模型

| 模型 | 说明 | 关键字段 |
|------|------|----------|
| User | 用户 | email, passwordHash, name, phone, isAdmin |
| Category | 商品分类 | name, slug, petType, parentId |
| Product | 商品 | name, slug, price, stock, images, categoryId |
| Review | 评价 | rating, comment, productId, userId |
| Favorite | 收藏 | userId, productId |
| Order | 订单 | status, total, shippingAddress, paymentMethod |
| OrderItem | 订单项 | quantity, price, orderId, productId |
| Coupon | 优惠券 | code, discountType, discountValue, minAmount |
| Payment | 支付 | stripePaymentIntentId, amount, status |

## 快速开始

### 环境要求
- Node.js >= 18
- Docker & Docker Compose
- npm >= 9

### 1. 启动数据库

```bash
cd pet-shop-backend
docker compose up -d
```

### 2. 配置环境变量

```bash
# 在 pet-shop-backend/ 下创建 .env
DATABASE_URL="postgresql://petshop:petshop123@localhost:5432/petshop"
JWT_SECRET="your-secret-key"
```

### 3. 初始化数据库

```bash
cd pet-shop-backend
npx prisma migrate dev
node prisma/seed.js
```

### 4. 启动后端

```bash
cd pet-shop-backend
npm install
npm run dev
```

后端运行在 http://localhost:3001

### 5. 启动前端

```bash
cd pet-shop-frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

## API 接口

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/auth/me | 获取当前用户 |

### 商品
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/products | 商品列表（筛选、分页） |
| GET | /api/products/:slug | 商品详情 |
| GET | /api/categories | 分类列表 |

### 购物车
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/cart | 获取购物车 |
| POST | /api/cart | 添加商品 |
| PUT | /api/cart/:id | 更新数量 |
| DELETE | /api/cart/:id | 删除商品 |

### 订单
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/orders | 创建订单 |
| GET | /api/orders | 订单列表 |
| GET | /api/orders/:id | 订单详情 |

### 评价 & 收藏
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/reviews/:productId | 商品评价 |
| POST | /api/reviews | 添加评价 |
| GET | /api/favorites | 收藏列表 |
| POST | /api/favorites | 添加/取消收藏 |

## 部署

项目支持 [Render](https://render.com) 部署，配置见 `render.yaml`。

前端也可部署到 Vercel，配置见 `pet-shop-frontend/vercel.json`。

## License

MIT
