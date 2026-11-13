import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import Farmer from '../models/Farmer.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

export async function seedIfEmpty() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  const [customerUser, farmerUser1, farmerUser2, adminUser] = await User.create([
    {
      name: 'Claire Bennett',
      email: 'customer@agriva.com',
      password: 'Agriva123!',
      role: 'customer',
      phone: '+1 555 010 2233',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        postalCode: '97205',
      },
    },
    {
      name: 'Elena Vance',
      email: 'farmer@agriva.com',
      password: 'Agriva123!',
      role: 'farmer',
      phone: '+1 555 014 8899',
    },
    {
      name: 'Marcus Thorne',
      email: 'marcus@agriva.com',
      password: 'Agriva123!',
      role: 'farmer',
      phone: '+1 555 019 4411',
    },
    {
      name: 'Agriva Admin',
      email: 'admin@agriva.com',
      password: 'Agriva123!',
      role: 'admin',
      phone: '+1 800 555 0194',
    },
  ]);

  const [farmer1, farmer2] = await Farmer.create([
    {
      user: farmerUser1._id,
      name: 'Elena Vance',
      farmName: 'Green Valley Regenerative Farm',
      specialty: 'Heirloom Tomatoes & Leafy Greens',
      location: 'Sonoma County, CA',
      experience: '14 Years',
      certifications: ['USDA Organic', 'Regenerative Organic Certified'],
      bio: 'No-till soil stewardship and rainwater harvesting across 42 acres of bio-intensive vegetable beds.',
      image: '/assets/img/home-3/team/01.jpg',
      verified: true,
    },
    {
      user: farmerUser2._id,
      name: 'Marcus Thorne',
      farmName: 'Sunridge Heritage Orchards',
      specialty: 'Stone Fruits, Apples & Raw Honey',
      location: 'Willamette Valley, OR',
      experience: '19 Years',
      certifications: ['USDA Organic', 'Bee Friendly Farming'],
      bio: 'Pollinator-rich mountain orchards cultivated with companion cover crops and zero synthetic sprays.',
      image: '/assets/img/home-3/team/02.jpg',
      verified: true,
    },
  ]);

  const categories = await Category.create([
    { name: 'Fresh Vegetables', slug: 'vegetables' },
    { name: 'Orchard Fruits', slug: 'fruits' },
    { name: 'Heritage Grains', slug: 'grains' },
    { name: 'Raw Honey & Dairy', slug: 'dairy-honey' },
  ]);

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  const products = await Product.create([
    {
      name: 'Heirloom Vine Tomatoes',
      slug: 'heirloom-vine-tomatoes',
      category: 'vegetables',
      categoryLabel: 'Fresh Vegetables',
      categoryRef: catMap.vegetables,
      farmer: farmer1._id,
      price: 6.5,
      compareAtPrice: 8.0,
      unit: '1 kg basket',
      stock: 48,
      harvestDate: new Date('2026-11-11'),
      season: 'Autumn',
      certifications: ['USDA Organic', 'Non-GMO'],
      originCode: 'AGR-ORG-001',
      image: '/assets/img/home-4/shop-1.jpg',
      gallery: ['/assets/img/home-4/shop-1.jpg', '/assets/img/inner-page/shop/shop-details-1.jpg'],
      shortDescription: 'Sun-ripened heirloom tomatoes picked at peak sweetness with zero synthetic sprays.',
      description: 'Grown in mineral-dense compost beds at Green Valley Regenerative Farm.',
      featured: true,
      rating: 4.9,
      reviewCount: 1,
    },
    {
      name: 'Crisp Organic Savoy Cabbage',
      slug: 'crisp-organic-savoy-cabbage',
      category: 'vegetables',
      categoryLabel: 'Fresh Vegetables',
      categoryRef: catMap.vegetables,
      farmer: farmer1._id,
      price: 4.2,
      unit: '1 head (~900g)',
      stock: 64,
      harvestDate: new Date('2026-11-10'),
      season: 'Autumn / Winter',
      certifications: ['USDA Organic', 'Certified Naturally Grown'],
      originCode: 'AGR-ORG-002',
      image: '/assets/img/home-4/shop-2.jpg',
      gallery: ['/assets/img/home-4/shop-2.jpg'],
      shortDescription: 'Tender, crinkled leaves ideal for slaws, braising, and fermented kraut.',
      featured: true,
      rating: 4.8,
    },
    {
      name: 'Sweet Golden Heritage Maize',
      slug: 'sweet-golden-heritage-maize',
      category: 'grains',
      categoryLabel: 'Heritage Grains',
      categoryRef: catMap.grains,
      farmer: farmer1._id,
      price: 5.8,
      compareAtPrice: 6.8,
      unit: '4 ears pack',
      stock: 32,
      harvestDate: new Date('2026-11-09'),
      season: 'Late Summer / Autumn',
      certifications: ['USDA Organic', 'Non-GMO'],
      originCode: 'AGR-ORG-003',
      image: '/assets/img/home-4/shop-3.jpg',
      gallery: ['/assets/img/home-4/shop-3.jpg'],
      shortDescription: 'Open-pollinated sweet maize with creamy kernels and natural honeyed flavor.',
      featured: true,
      rating: 4.9,
    },
    {
      name: 'Honeycrisp Orchard Apples',
      slug: 'honeycrisp-orchard-apples',
      category: 'fruits',
      categoryLabel: 'Orchard Fruits',
      categoryRef: catMap.fruits,
      farmer: farmer2._id,
      price: 7.4,
      compareAtPrice: 8.5,
      unit: '1.5 kg bag',
      stock: 52,
      harvestDate: new Date('2026-11-08'),
      season: 'Autumn',
      certifications: ['USDA Organic', 'Bee Friendly Farming'],
      originCode: 'AGR-ORG-004',
      image: '/assets/img/home-4/shop-4.jpg',
      gallery: ['/assets/img/home-4/shop-4.jpg'],
      shortDescription: 'Snappy, aromatic apples grown in pollinator-protected mountain orchards.',
      featured: true,
      rating: 5.0,
    },
    {
      name: 'Wildflower Raw Comb Honey',
      slug: 'wildflower-raw-comb-honey',
      category: 'dairy-honey',
      categoryLabel: 'Raw Honey & Dairy',
      categoryRef: catMap['dairy-honey'],
      farmer: farmer2._id,
      price: 14.5,
      compareAtPrice: 17.0,
      unit: '500g glass jar',
      stock: 11,
      harvestDate: new Date('2026-10-28'),
      season: 'Year-Round',
      certifications: ['USDA Organic', 'Raw & Unfiltered'],
      originCode: 'AGR-ORG-005',
      image: '/assets/img/home-4/shop-5.jpg',
      gallery: ['/assets/img/home-4/shop-5.jpg'],
      shortDescription: 'Cold-extracted wildflower honey preserving natural pollen and enzymes.',
      featured: true,
      rating: 4.9,
    },
    {
      name: 'Stone-Milled Einkorn Flour',
      slug: 'stone-milled-einkorn-flour',
      category: 'grains',
      categoryLabel: 'Heritage Grains',
      categoryRef: catMap.grains,
      farmer: farmer1._id,
      price: 9.8,
      compareAtPrice: 11.5,
      unit: '1 kg kraft pouch',
      stock: 9,
      harvestDate: new Date('2026-10-15'),
      season: 'Year-Round',
      certifications: ['USDA Organic', 'Non-GMO'],
      originCode: 'AGR-ORG-007',
      image: '/assets/img/home-4/shop-7.jpg',
      gallery: ['/assets/img/home-4/shop-7.jpg'],
      shortDescription: 'Unbleached ancient grain flour milled fresh in small weekly batches.',
      featured: false,
      rating: 4.8,
    },
  ]);

  await Review.create({
    product: products[0]._id,
    user: customerUser._id,
    userName: customerUser.name,
    rating: 5,
    comment: 'Arrived still cool from the morning harvest—incredible flavor and zero bruising.',
  });

  await Blog.create([
    {
      title: 'How Regenerative Cover Cropping Builds Living Soil Without Synthetic Inputs',
      slug: 'regenerative-soil-health-explained',
      category: 'Soil Science',
      author: 'Elena Vance',
      readTime: '5 min read',
      image: '/assets/img/home-4/news-1.jpg',
      excerpt:
        'Discover how multi-species cover crops lock carbon into topsoil, boost water retention by 40%, and naturally suppress weeds.',
      content:
        'Healthy soil is a living ecosystem. Across Agriva partner farms, crimson clover, winter rye, and tillage radish work together between cash crops to feed mycorrhizal fungi and fix atmospheric nitrogen naturally.',
    },
    {
      title: 'Inside Our 24-Hour Farm-to-Home Harvest & QR Traceability Standard',
      slug: 'farm-to-home-cold-chain-traceability',
      category: 'Supply Chain',
      author: 'Marcus Thorne',
      readTime: '4 min read',
      image: '/assets/img/home-4/news-2.jpg',
      excerpt:
        'Why supermarket produce loses up to half its delicate micronutrients in transit—and how direct regional micro-hubs solve it.',
      content:
        'Every Agriva crate carries a farm origin code linking you to harvest date, soil stewardship notes, and organic certification records.',
    },
  ]);

  const sampleOrder = await Order.create({
    orderNumber: 'AGR-2026-1001',
    user: customerUser._id,
    items: [
      {
        product: products[0]._id,
        farmer: farmer1._id,
        name: products[0].name,
        image: products[0].image,
        price: products[0].price,
        quantity: 2,
      },
      {
        product: products[3]._id,
        farmer: farmer2._id,
        name: products[3].name,
        image: products[3].image,
        price: products[3].price,
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: customerUser.name,
      email: customerUser.email,
      phone: customerUser.phone,
      street: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postalCode: '97205',
      deliverySlot: 'Morning (7am – 11am)',
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'harvested',
    subtotal: 20.4,
    discount: 0,
    shippingFee: 4.95,
    totalAmount: 25.35,
  });

  await Payment.create({
    order: sampleOrder._id,
    user: customerUser._id,
    amount: 25.35,
    method: 'card',
    status: 'paid',
    transactionId: 'TXN-SEED-1001',
  });
}

