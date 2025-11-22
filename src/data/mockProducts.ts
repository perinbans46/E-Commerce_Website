import { Product } from '@/types/product';
import { Category } from '@/types/category';

// Mock categories data
export const mockCategories: Category[] = [
  { id: '1', name: 'All Products', slug: 'all', productCount: 500 },
  { id: '2', name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, tablets, and accessories', productCount: 120 },
  { id: '3', name: 'Clothing', slug: 'clothing', description: 'Fashion for men, women, and kids', productCount: 100 },
  { id: '4', name: 'Home & Garden', slug: 'home-garden', description: 'Furniture, decor, and garden supplies', productCount: 80 },
  { id: '5', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Fitness equipment and outdoor gear', productCount: 60 },
  { id: '6', name: 'Books & Media', slug: 'books-media', description: 'Books, movies, music, and games', productCount: 50 },
  { id: '7', name: 'Toys & Games', slug: 'toys-games', description: 'Toys, board games, and video games', productCount: 40 },
  { id: '8', name: 'Health & Beauty', slug: 'health-beauty', description: 'Skincare, supplements, and personal care', productCount: 50 },
];

// Sample data generation helpers
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Canon', 'Nikon', 'Puma', 'Under Armour', 'Microsoft', 'Intel', 'AMD'];
const productNames = [
  // Electronics
  'Wireless Bluetooth Headphones', 'Smart Watch Pro', 'Laptop Ultra', 'Smartphone X', 'Tablet Plus', 'Gaming Console',
  'Wireless Mouse', 'Mechanical Keyboard', '4K Webcam', 'USB-C Hub', 'Portable Charger', 'Bluetooth Speaker',
  // Clothing
  'Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Winter Jacket', 'Summer Dress', 'Sports Hoodie',
  'Wool Sweater', 'Yoga Pants', 'Leather Boots', 'Baseball Cap', 'Wool Scarf', 'Cotton Socks',
  // Home & Garden
  'Coffee Maker', 'LED Desk Lamp', 'Plant Pot Set', 'Kitchen Knife Set', 'Throw Pillows', 'Wall Art',
  'Garden Tools Set', 'Storage Baskets', 'Dinnerware Set', 'Bath Towels', 'Vacuum Cleaner', 'Air Purifier',
  // Sports & Outdoors
  'Yoga Mat', 'Dumbbells Set', 'Running Belt', 'Water Bottle', 'Tennis Racket', 'Camping Tent',
  'Fitness Tracker', 'Mountain Bike', 'Hiking Backpack', 'Resistance Bands', 'Jump Rope', 'Exercise Ball',
  // Books & Media
  'Bestseller Novel', 'Cookbook Collection', 'Science Fiction Box Set', 'Documentary DVD', 'Music Album', 'Video Game',
  'Art Book', 'Photography Guide', 'History Encyclopedia', 'Children Story Book', 'Comics Collection', 'Magazine Subscription',
  // Toys & Games
  'Board Game', 'Puzzle Set', 'Action Figure', 'LEGO Set', 'Doll House', 'Remote Control Car',
  'Building Blocks', 'Art Supplies Kit', 'Musical Instrument', 'Science Kit', 'Stuffed Animal', 'Card Game',
  // Health & Beauty
  'Face Cream', 'Vitamin Supplements', 'Essential Oils Set', 'Hair Care Kit', 'Fitness Supplements', 'Skin Care Set',
  'Bath Bombs Set', 'Makeup Palette', 'Perfume', 'Electric Toothbrush', 'Massage Gun', 'Yoga Blocks'
];

const descriptions = [
  'Premium quality product with advanced features and modern design',
  'Professional grade equipment suitable for everyday use',
  'Ergonomically designed for maximum comfort and efficiency',
  'High-quality materials ensure durability and long-lasting performance',
  'Innovative technology meets stylish design in this exceptional product',
  'Perfect for both beginners and professionals alike',
  'Sustainable and eco-friendly materials used in production',
  'Award-winning design with superior functionality',
  'Engineered for excellence with attention to detail',
  'Versatile and practical solution for modern lifestyle'
];

// Generate mock products
export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  let productId = 1;

  const generateImages = (productId: number) => [
    {
      id: `${productId}-1`,
      url: `https://picsum.photos/400/400?random=${productId}`,
      alt: `Product ${productId} main image`,
      isMain: true
    },
    {
      id: `${productId}-2`,
      url: `https://picsum.photos/400/400?random=${productId + 1000}`,
      alt: `Product ${productId} alternate view`,
      isMain: false
    }
  ];

  const generateTags = (category: string, name: string): string[] => {
    const commonTags = ['popular', 'bestseller', 'trending', 'new'];
    const categoryTags: Record<string, string[]> = {
      electronics: ['tech', 'gadget', 'smart', 'digital'],
      clothing: ['fashion', 'style', 'comfort', 'trendy'],
      'home-garden': ['home', 'decor', 'lifestyle', 'comfort'],
      'sports-outdoors': ['fitness', 'active', 'outdoor', 'health'],
      'books-media': ['entertainment', 'education', 'media', 'culture'],
      'toys-games': ['fun', 'educational', 'creative', 'play'],
      'health-beauty': ['wellness', 'care', 'natural', 'health']
    };

    const tags = [
      ...commonTags.slice(0, 1),
      ...(categoryTags[category] || commonTags.slice(0, 2))
    ];

    // Add keyword tags from product name
    const keywords = name.toLowerCase().split(' ').slice(0, 2);
    return [...tags, ...keywords];
  };

  // Electronics (120 products)
  for (let i = 0; i < 120; i++) {
    const name = productNames[i % 14]; // Electronics names are first 14
    const price = Math.floor(Math.random() * 900) + 100; // $100-$1000
    const originalPrice = Math.random() > 0.7 ? price + Math.floor(Math.random() * 200) + 50 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: `${brands[Math.floor(Math.random() * brands.length)]} ${name}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'electronics',
      subcategory: ['phones', 'laptops', 'tablets', 'accessories'][Math.floor(Math.random() * 4)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('electronics', name),
      inStock: Math.random() > 0.1,
      quantity: Math.floor(Math.random() * 100) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
      reviewCount: Math.floor(Math.random() * 500) + 10,
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Clothing (100 products)
  for (let i = 0; i < 100; i++) {
    const name = productNames[14 + (i % 12)]; // Clothing names are next 12
    const price = Math.floor(Math.random() * 150) + 20; // $20-$170
    const originalPrice = Math.random() > 0.6 ? price + Math.floor(Math.random() * 50) + 20 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'clothing',
      subcategory: ['men', 'women', 'kids', 'shoes', 'accessories'][Math.floor(Math.random() * 5)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('clothing', name),
      inStock: Math.random() > 0.15,
      quantity: Math.floor(Math.random() * 50) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 300) + 5,
      featured: Math.random() > 0.85,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Home & Garden (80 products)
  for (let i = 0; i < 80; i++) {
    const name = productNames[26 + (i % 12)]; // Home & Garden names are next 12
    const price = Math.floor(Math.random() * 200) + 30; // $30-$230
    const originalPrice = Math.random() > 0.7 ? price + Math.floor(Math.random() * 60) + 15 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'home-garden',
      subcategory: ['furniture', 'decor', 'kitchen', 'garden'][Math.floor(Math.random() * 4)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('home-garden', name),
      inStock: Math.random() > 0.05,
      quantity: Math.floor(Math.random() * 30) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 200) + 8,
      featured: Math.random() > 0.9,
      createdAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Sports & Outdoors (60 products)
  for (let i = 0; i < 60; i++) {
    const name = productNames[38 + (i % 12)]; // Sports names are next 12
    const price = Math.floor(Math.random() * 150) + 25; // $25-$175
    const originalPrice = Math.random() > 0.65 ? price + Math.floor(Math.random() * 40) + 10 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'sports-outdoors',
      subcategory: ['fitness', 'outdoor', 'equipment'][Math.floor(Math.random() * 3)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('sports-outdoors', name),
      inStock: Math.random() > 0.1,
      quantity: Math.floor(Math.random() * 40) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 150) + 12,
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Books & Media (50 products)
  for (let i = 0; i < 50; i++) {
    const name = productNames[50 + (i % 12)]; // Books names are next 12
    const price = Math.floor(Math.random() * 40) + 10; // $10-$50
    const originalPrice = Math.random() > 0.5 ? price + Math.floor(Math.random() * 15) + 5 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'books-media',
      subcategory: ['books', 'movies', 'music', 'games'][Math.floor(Math.random() * 4)],
      brand: undefined,
      images: generateImages(productId),
      tags: generateTags('books-media', name),
      inStock: Math.random() > 0.08,
      quantity: Math.floor(Math.random() * 100) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 400) + 20,
      featured: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Toys & Games (40 products)
  for (let i = 0; i < 40; i++) {
    const name = productNames[62 + (i % 12)]; // Toys names are next 12
    const price = Math.floor(Math.random() * 80) + 15; // $15-$95
    const originalPrice = Math.random() > 0.6 ? price + Math.floor(Math.random() * 25) + 8 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'toys-games',
      subcategory: ['toys', 'games', 'educational'][Math.floor(Math.random() * 3)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('toys-games', name),
      inStock: Math.random() > 0.12,
      quantity: Math.floor(Math.random() * 35) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 180) + 15,
      featured: Math.random() > 0.75,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 40 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Health & Beauty (50 products)
  for (let i = 0; i < 50; i++) {
    const name = productNames[74 + (i % 12)]; // Health names are last 12
    const price = Math.floor(Math.random() * 120) + 20; // $20-$140
    const originalPrice = Math.random() > 0.7 ? price + Math.floor(Math.random() * 30) + 10 : undefined;

    products.push({
      id: `prod-${productId++}`,
      name: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      originalPrice,
      category: 'health-beauty',
      subcategory: ['skincare', 'supplements', 'personal-care'][Math.floor(Math.random() * 3)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      images: generateImages(productId),
      tags: generateTags('health-beauty', name),
      inStock: Math.random() > 0.1,
      quantity: Math.floor(Math.random() * 60) + 1,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 250) + 18,
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return products;
};

// Generate and export the products
export const mockProducts = generateMockProducts();