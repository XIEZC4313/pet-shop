# 宠物乐园 - 全方位宠物用品电商网站

一个功能完整的宠物用品电商平台，支持商品浏览、购物车、下单、用户管理等核心电商功能。

## 功能特性

### 用户端
- **首页展示** - 轮播横幅、分类导航、精选商品推荐
- **商品浏览** - 分类筛选、搜索、排序（价格/最新）、分页
- **商品详情** - 商品信息、库存、加入购物车
- **购物车** - 侧滑抽屉、数量调整、删除商品
- **订单结算** - 收货地址、订单创建
- **订单管理** - 查看历史订单、订单状态跟踪
- **用户中心** - 注册/登录、个人信息管理

### 后台管理
- 管理员权限控制
- 商品 CRUD 操作

## 技术栈

### 前端
| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| React Router v7 | 路由管理 |
| Zustand | 状态管理 |
| Axios | HTTP 请求 |
| Framer Motion | 动画效果 |
| Lucide React | 图标库 |
| Vite | 构建工具 |
| Tailwind CSS | 样式框架 |

### 后端
| 技术 | 用途 |
|------|------|
| Express 5 | Web 框架 |
| Prisma ORM | 数据库 ORM |
| SQLite | 数据库 |
| bcryptjs | 密码加密 |
| jsonwebtoken | JWT 认证 |
| CORS | 跨域处理 |

## 项目结构

```
pet-shop/
├── client/                    # React 前端
│   ├── src/
│   │   ├── api/              # Axios 实例配置
│   │   ├── components/       # 公共组件
│   │   │   ├── Navbar.jsx    # 导航栏
│   │   │   ├── Footer.jsx    # 页脚
│   │   │   ├── CartDrawer.jsx # 购物车抽屉
│   │   │   ├── PetCard.jsx   # 商品卡片
│   │   │   └── Skeleton.jsx  # 加载骨架屏
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.jsx      # 首页
│   │   │   ├── Shop.jsx      # 商品列表
│   │   │   ├── PetDetail.jsx # 商品详情
│   │   │   ├── Cart.jsx      # 购物车
│   │   │   ├── Checkout.jsx  # 结算页
│   │   │   ├── Login.jsx     # 登录/注册
│   │   │   ├── Orders.jsx    # 订单列表
│   │   │   └── Profile.jsx   # 个人中心
│   │   ├── store/            # Zustand 状态管理
│   │   ├── App.jsx           # 路由配置
│   │   └── main.jsx          # 入口文件
│   └── package.json
│
└── server/                    # Express 后端
    ├── prisma/
    │   ├── schema.prisma     # 数据模型定义
    │   └── seed.js           # 种子数据
    ├── src/
    │   ├── routes/           # API 路由
    │   │   ├── auth.js       # 认证相关
    │   │   ├── products.js   # 商品相关
    │   │   ├── cart.js       # 购物车相关
    │   │   └── orders.js     # 订单相关
    │   ├── middleware/
    │   │   └── auth.js       # JWT 认证中间件
    │   └── app.js            # Express 入口
    └── package.json
```

## 数据模型

### User（用户）
- id, email, passwordHash, name, phone, address
- isAdmin（管理员标识）
- 关联：cartItems, orders

### Category（商品分类）
- id, name, slug, emoji
- 关联：products

### Product（商品）
- id, name, description, price, stock, image
- petType（宠物类型：cat/dog/rabbit/bird/hamster）
- age, breed, isActive, isFeatured
- 关联：category

### CartItem（购物车项）
- id, quantity
- 关联：user, product

### Order（订单）
- id, totalAmount, status, address, phone
- 关联：user, items

### OrderItem（订单项）
- id, quantity, price
- 关联：order, product

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd client
npm install
```

### 数据库初始化

```bash
cd server
npm run db:setup
```

### 启动开发服务器

```bash
# 后端 (端口 3001)
cd server
npm run dev

# 前端 (端口 5173)
cd client
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
cd client
npm run build
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |
| GET | /api/products | 获取商品列表（支持筛选、分页） |
| GET | /api/products/:id | 获取商品详情 |
| GET | /api/cart | 获取购物车 |
| POST | /api/cart | 添加商品到购物车 |
| PUT | /api/cart/:id | 更新购物车商品数量 |
| DELETE | /api/cart/:id | 删除购物车商品 |
| POST | /api/orders | 创建订单 |
| GET | /api/orders | 获取用户订单列表 |

## 宠物分类

| 分类 | 标识 | Emoji |
|------|------|-------|
| 猫咪 | cat | 🐱 |
| 狗狗 | dog | 🐶 |
| 兔兔 | rabbit | 🐰 |
| 鸟类 | bird | 🐦 |
| 仓鼠 | hamster | 🐹 |

## License

MIT
