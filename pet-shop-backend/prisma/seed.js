const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@petparadise.com' },
    update: {},
    create: {
      email: 'admin@petparadise.com',
      passwordHash: adminHash,
      name: '管理員',
      isAdmin: true,
    },
  });
  console.log('✅ Admin user created');

  // Create test user
  const userHash = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userHash,
      name: '測試會員',
      phone: '0912-345-678',
      address: '台北市大安區忠孝東路四段100號',
    },
  });
  console.log('✅ Test user created');

  // Create categories
  const categoryData = [
    { name: '乾糧', slug: 'dry-food', petType: 'dog' },
    { name: '罐頭', slug: 'canned-food', petType: 'dog' },
    { name: '玩具', slug: 'toys', petType: 'dog' },
    { name: '床墊', slug: 'beds', petType: 'dog' },
    { name: '乾糧', slug: 'cat-dry-food', petType: 'cat' },
    { name: '貓砂', slug: 'cat-litter', petType: 'cat' },
    { name: '貓玩具', slug: 'cat-toys', petType: 'cat' },
    { name: '鳥飼料', slug: 'bird-food', petType: 'bird' },
    { name: '魚飼料', slug: 'fish-food', petType: 'fish' },
    { name: '鼠用品', slug: 'small-pet-supplies', petType: 'small_pet' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created;
  }
  console.log(`✅ ${categoryData.length} categories created`);

  // Create products
  const productData = [
    { name: '頂級雞肉配方狗糧 15kg', slug: 'premium-chicken-dog-food', description: '採用優質雞肉為主要蛋白質來源，添加豐富的維生素和礦物質，適合所有犬種食用。', price: 1280, stock: 50, category: 'dry-food' },
    { name: '無穀物鮭魚配方狗糧 12kg', slug: 'grain-free-salmon-dog-food', description: '無穀物配方，適合敏感腸胃的狗狗，富含Omega-3脂肪酸。', price: 1580, stock: 30, category: 'dry-food' },
    { name: '嫩雞佐蔬菜狗罐頭 400g', slug: 'chicken-veggie-canned-dog-food', description: '新鮮雞肉搭配胡蘿蔔、豌豆等蔬菜，均勻營養。', price: 85, stock: 200, category: 'canned-food' },
    { name: '耐咬橡膠玩具球', slug: 'durable-rubber-ball', description: '高密度天然橡膠，彈性適中，適合中大型犬。', price: 290, stock: 150, category: 'toys' },
    { name: '寵物記憶棉床墊 M', slug: 'memory-foam-dog-bed-m', description: '人體工學記憶棉，舒適支撐，可拆洗布套。', price: 1680, stock: 20, category: 'beds' },
    { name: '三文魚無穀物貓糧 6kg', slug: 'salmon-grain-free-cat-food', description: '高蛋白無穀物配方，添加牛磺酸，維護心臟健康。', price: 980, stock: 35, category: 'cat-dry-food' },
    { name: '頂級貓砂 10kg（原味）', slug: 'premium-cat-litter-10kg', description: '凝結力強，除臭效果佳，低粉塵。', price: 320, stock: 100, category: 'cat-litter' },
    { name: '逗貓棒（附羽毛）', slug: 'cat-teaser-feather', description: '彈性伸縮桿設計，附多彩羽毛，增進貓咪運動量。', price: 150, stock: 80, category: 'cat-toys' },
    { name: '小動物磨牙棒', slug: 'small-pet-chew-stick', description: '天然木材製成，幫助小動物磨牙，維持牙齒健康。', price: 60, stock: 300, category: 'small-pet-supplies' },
    { name: '綜合鳥飼料 2kg', slug: 'mixed-bird-seed-2kg', description: '多種穀物混合，包含小米、燕麥、葵花籽等。', price: 180, stock: 60, category: 'bird-food' },
    { name: '小型魚薄片飼料 100ml', slug: 'tropical-fish-flakes', description: '適合熱帶魚的均衡薄片飼料，添加維生素。', price: 120, stock: 90, category: 'fish-food' },
    { name: '貓抓板（仙人掌造型）', slug: 'cactus-cat-scratcher', description: '可愛仙人掌造型，天然劍麻材質，滿足貓咪抓撓天性。', price: 450, stock: 40, category: 'cat-toys' },
  ];

  for (const p of productData) {
    const category = categories[p.category];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: "[]",
        categoryId: category.id,
      },
    });
  }
  console.log(`✅ ${productData.length} products created`);

  // Create coupons
  const couponData = [
    { code: 'PETNEW', discountType: 'percent', discountValue: 10, minAmount: 500, maxUses: 100 },
    { code: 'FREESHIP', discountType: 'fixed', discountValue: 150, minAmount: 300, maxUses: 50 },
    { code: 'VIP2025', discountType: 'percent', discountValue: 20, minAmount: 1000, maxUses: 20 },
  ];

  for (const c of couponData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log(`✅ ${couponData.length} coupons created`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
