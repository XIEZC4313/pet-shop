const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // 清空数据
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员和测试用户
  const hash = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.create({
    data: { email: 'admin@pawpaw.com', passwordHash: hash, name: '管理员', isAdmin: true }
  });
  const user = await prisma.user.create({
    data: { email: 'test@pawpaw.com', passwordHash: hash, name: '小明', phone: '13800138000', address: '北京市朝阳区宠物街1号' }
  });

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({ data: { name: '猫咪', slug: 'cat', emoji: '🐱' } }),
    prisma.category.create({ data: { name: '狗狗', slug: 'dog', emoji: '🐶' } }),
    prisma.category.create({ data: { name: '兔兔', slug: 'rabbit', emoji: '🐰' } }),
    prisma.category.create({ data: { name: '鸟类', slug: 'bird', emoji: '🐦' } }),
    prisma.category.create({ data: { name: '仓鼠', slug: 'hamster', emoji: '🐹' } }),
  ]);

  const [cat, dog, rabbit, bird, hamster] = categories;

  // 创建宠物商品
  const products = [
    { name: '布偶猫 Luna', description: '温柔粘人的布偶猫，已完成疫苗和驱虫，性格温顺适合家庭', price: 3800, stock: 3, image: 'https://placekitten.com/400/400', petType: 'cat', age: '3月龄', breed: '布偶猫', isFeatured: true, categoryId: cat.id },
    { name: '英短蓝猫 Mochi', description: '圆脸蓝猫，活泼好动，已绝育，适合公寓饲养', price: 2500, stock: 5, image: 'https://placekitten.com/401/401', petType: 'cat', age: '4月龄', breed: '英国短毛猫', isFeatured: true, categoryId: cat.id },
    { name: '金渐层 Leo', description: '金色渐层英短，毛色华丽，性格独立又亲人', price: 4200, stock: 2, image: 'https://placekitten.com/402/402', petType: 'cat', age: '5月龄', breed: '金渐层', isFeatured: true, categoryId: cat.id },
    { name: '柯基 Cookie', description: '短腿柯基，精力充沛，已训练基础指令，超可爱', price: 3500, stock: 4, image: 'https://placedog.net/400/400', petType: 'dog', age: '2月龄', breed: '柯基', isFeatured: true, categoryId: dog.id },
    { name: '金毛 Max', description: '暖男金毛，性格温顺忠诚，适合有小孩的家庭', price: 2800, stock: 3, image: 'https://placedog.net/401/401', petType: 'dog', age: '3月龄', breed: '金毛寻回犬', isFeatured: true, categoryId: dog.id },
    { name: '泰迪 Teddy', description: '小体泰迪，不掉毛，聪明伶俐，适合老人陪伴', price: 2200, stock: 6, image: 'https://placedog.net/402/402', petType: 'dog', age: '2月龄', breed: '泰迪', isFeatured: false, categoryId: dog.id },
    { name: '哈士奇 Ice', description: '蓝眼哈士奇，活力满满，需要大量运动空间', price: 3000, stock: 2, image: 'https://placedog.net/403/403', petType: 'dog', age: '4月龄', breed: '哈士奇', isFeatured: false, categoryId: dog.id },
    { name: '荷兰垂耳兔 Muffin', description: '软萌垂耳兔，安静温顺，适合小空间饲养', price: 800, stock: 8, image: 'https://placekitten.com/403/403', petType: 'rabbit', age: '2月龄', breed: '荷兰垂耳兔', isFeatured: true, categoryId: rabbit.id },
    { name: '安哥拉兔 Fluffy', description: '长毛安哥拉兔，毛茸茸像一团棉花糖', price: 1200, stock: 4, image: 'https://placekitten.com/404/404', petType: 'rabbit', age: '3月龄', breed: '安哥拉兔', isFeatured: false, categoryId: rabbit.id },
    { name: '虎皮鹦鹉 Sunny', description: '色彩鲜艳的虎皮鹦鹉，会简单学舌，活泼可爱', price: 300, stock: 15, image: 'https://placekitten.com/405/405', petType: 'bird', age: '3月龄', breed: '虎皮鹦鹉', isFeatured: true, categoryId: bird.id },
    { name: '玄凤鹦鹉 Coco', description: '温柔的玄凤鹦鹉，头顶小冠毛超可爱，会吹口哨', price: 600, stock: 6, image: 'https://placekitten.com/406/406', petType: 'bird', age: '4月龄', breed: '玄凤鹦鹉', isFeatured: false, categoryId: bird.id },
    { name: '金丝雀 Melody', description: '歌声悠扬的金丝雀，羽毛亮丽，适合观赏', price: 500, stock: 10, image: 'https://placekitten.com/407/407', petType: 'bird', age: '5月龄', breed: '金丝雀', isFeatured: false, categoryId: bird.id },
    { name: '金丝熊仓鼠 Pudding', description: '毛茸茸的金丝熊，圆滚滚超治愈，独居型仓鼠', price: 50, stock: 20, image: 'https://placekitten.com/408/408', petType: 'hamster', age: '1月龄', breed: '金丝熊', isFeatured: true, categoryId: hamster.id },
    { name: '银狐仓鼠 Snow', description: '雪白的银狐仓鼠，性格亲人，适合新手饲养', price: 45, stock: 25, image: 'https://placekitten.com/409/409', petType: 'hamster', age: '1月龄', breed: '银狐仓鼠', isFeatured: false, categoryId: hamster.id },
    { name: '三花猫 Sakura', description: '幸运三花猫，颜值超高，性格活泼爱玩耍', price: 1800, stock: 3, image: 'https://placekitten.com/410/410', petType: 'cat', age: '2月龄', breed: '三花猫', isFeatured: false, categoryId: cat.id },
    { name: '边牧 Lucky', description: '智商第一的边境牧羊犬，学习能力强，适合训练', price: 4000, stock: 2, image: 'https://placedog.net/404/404', petType: 'dog', age: '3月龄', breed: '边境牧羊犬', isFeatured: false, categoryId: dog.id },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seed completed!');
  console.log('  Admin: admin@pawpaw.com / 123456');
  console.log('  User:  test@pawpaw.com / 123456');
  console.log(`  ${categories.length} categories, ${products.length} products`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
