const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const products = [
  {
    name: "Mithila Plain Makhana",
    description: "Naturally rich in protein and calcium, these premium fox nuts are carefully selected and roasted to preserve their authentic taste, crunch, and nutrition.",
    price: 180,
    compareAtPrice: 220,
    category: "Makhana",
    image: "/makana.png",
    images: [
      "/makana.png",
      "makana2.png"
    ],
    rating: 4.8,
    reviewsCount: 42,
    stock: 120,
    benefits: [
      "Rich in calcium and protein",
      "Low glycemic index (perfect for blood sugar levels)",
      "Zero cholesterol and trans fats",
      "Gluten-free superfood"
    ],
    ingredients: [
      "Premium Foxnuts (Makhana)",
      "Organic Cow Ghee",
      "Himalayan Pink Rock Salt"
    ],
    nutritionFacts: {
      calories: "120 kcal",
      protein: "4.2g",
      carbs: "18g",
      fat: "3.5g",
      fiber: "2.8g"
    },
    tags: ["Best Seller", "Roasted", "Gluten Free", "Organic"]
  },
  {
    name: "Tangy Tomato & Herb Makhana",
    description: "Crispy roasted foxnuts glazed with a rich tang of sun-ripened organic tomatoes and a blend of fine Mediterranean herbs. Absolutely zero synthetic flavor enhancers.",
    price: 195,
    compareAtPrice: 240,
    category: "Makhana",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.6,
    reviewsCount: 31,
    stock: 85,
    benefits: [
      "High dietary fiber helps digestion",
      "Antioxidant-rich organic seasoning",
      "No MSG or artificial colors",
      "Natural energy booster"
    ],
    ingredients: [
      "Premium Foxnuts (Makhana)",
      "Cold-Pressed Rice Bran Oil",
      "Dehydrated Tomato Powder",
      "Oregano",
      "Basil",
      "Sea Salt"
    ],
    nutritionFacts: {
      calories: "135 kcal",
      protein: "3.8g",
      carbs: "20g",
      fat: "4.0g",
      fiber: "3.0g"
    },
    tags: ["Roasted", "Spicy & Tangy", "Vegan Friendly"]
  },
  {
    name: "Smoky Chipotle Barbeque Makhana",
    description: "Add a punch of smoky hickory wood flavor to your diet. These slow-roasted foxnuts are coated in premium sweet chipotle pepper rub and aromatic spices for a rich roasted snack.",
    price: 195,
    compareAtPrice: 250,
    category: "Makhana",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee37f6a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1621939514649-280e2ee37f6a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewsCount: 28,
    stock: 95,
    benefits: [
      "Rich in heart-friendly magnesium",
      "Thermogenic spices boost metabolism",
      "Low calorie snack alternative",
      "Perfect post-workout snack"
    ],
    ingredients: [
      "Premium Foxnuts (Makhana)",
      "Olive Oil",
      "Smoked Chipotle Pepper",
      "Brown Sugar",
      "Garlic Powder",
      "Onion Powder"
    ],
    nutritionFacts: {
      calories: "140 kcal",
      protein: "3.5g",
      carbs: "21g",
      fat: "4.5g",
      fiber: "2.5g"
    },
    tags: ["Roasted", "Bold Flavor", "Smoky"]
  },
  {
    name: "Ancient 5-Seed Power Boost Mix",
    description: "A functional super-blend of organic Chia, Pumpkin, Flax, Sunflower, and Sesame seeds. Lightly toasted at low temperatures to lock in Omega-3 fatty acids, plant proteins, and raw trace minerals.",
    price: 290,
    compareAtPrice: 350,
    category: "Seeds",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588710922810-e157d6efb400?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 56,
    stock: 150,
    benefits: [
      "Excellent source of plant-based Omega-3",
      "High dietary fiber promotes gut health",
      "Rich in zinc, iron, and magnesium",
      "Supports skin and hair vitality"
    ],
    ingredients: [
      "Organic Chia Seeds",
      "Hulled Pumpkin Seeds",
      "Golden Flax Seeds",
      "Sunflower Seeds",
      "Toasted White Sesame Seeds"
    ],
    nutritionFacts: {
      calories: "180 kcal",
      protein: "7.0g",
      carbs: "8g",
      fat: "14.0g",
      fiber: "6.0g"
    },
    tags: ["Best Seller", "Superfood", "Keto Friendly", "Omega 3"]
  },
  {
    name: "Organic Raw Chia Seeds",
    description: "Sourced from certified organic farms, our Chia seeds are packed with premium fiber and antioxidants. Hydrate them in coconut milk or sprinkle over fresh morning bowls.",
    price: 160,
    compareAtPrice: 199,
    category: "Seeds",
    image: "https://images.unsplash.com/photo-1588710922810-e157d6efb400?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588710922810-e157d6efb400?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewsCount: 19,
    stock: 200,
    benefits: [
      "Forms a healthy prebiotic gel in gut",
      "Packed with antioxidants",
      "Highly soluble dietary fiber",
      "Aids natural hydration"
    ],
    ingredients: [
      "100% Organic Raw Chia Seeds"
    ],
    nutritionFacts: {
      calories: "137 kcal",
      protein: "4.7g",
      carbs: "12g",
      fat: "8.6g",
      fiber: "10.6g"
    },
    tags: ["Organic", "Raw", "Prebiotic", "Gluten Free"]
  },
  {
    name: "Premium Roasted Pumpkin Seeds",
    description: "Large, plump pumpkin seeds toasted with a light touch of Himalayan sea salt. Loaded with high plant proteins and minerals for active lifestyles.",
    price: 240,
    compareAtPrice: 299,
    category: "Seeds",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.5,
    reviewsCount: 22,
    stock: 140,
    benefits: [
      "High natural zinc levels for immune support",
      "High protein content builds muscles",
      "Contains tryptophan promoting deep sleep",
      "Alkalizing super seed"
    ],
    ingredients: [
      "Hulled Pumpkin Seeds (Pepitas)",
      "Rock Salt"
    ],
    nutritionFacts: {
      calories: "160 kcal",
      protein: "9.0g",
      carbs: "4g",
      fat: "13.0g",
      fiber: "2.0g"
    },
    tags: ["High Zinc", "Roasted", "Low Carb"]
  },
  {
    name: "Antioxidant Royal Trail Mix",
    description: "An elegant, premium blend of whole almonds, walnut halves, cashew nuts, and dried nutrient-dense super fruits like wild blueberries and sweet cranberries.",
    price: 380,
    compareAtPrice: 450,
    category: "Trail Mixes",
    image: "https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 61,
    stock: 110,
    benefits: [
      "Protects body from free-radical damage",
      "Brain-boosting healthy polyunsaturated fats",
      "Instant sustained physical energy",
      "Keeps you full for hours"
    ],
    ingredients: [
      "Kashmiri Almonds",
      "California Walnuts",
      "Raw Whole Cashew Nuts",
      "Dehydrated Blueberries",
      "Dried Whole Cranberries"
    ],
    nutritionFacts: {
      calories: "195 kcal",
      protein: "5.5g",
      carbs: "18g",
      fat: "11.5g",
      fiber: "3.5g"
    },
    tags: ["Best Seller", "Royal Mix", "Brain Booster"]
  },
  {
    name: "Double Chocolate Protein Bar",
    description: "Satisfy your cocoa cravings with pure whey-infused roasted oats, protein-enriched makhana flour, and crunchy seed spreads coated with 70% dark Belgian chocolate.",
    price: 120,
    compareAtPrice: 150,
    category: "Protein Snacks",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewsCount: 38,
    stock: 170,
    benefits: [
      "Provides 20g premium whey protein",
      "No added white sugar",
      "Supports rapid muscle recovery",
      "Indulgent taste with clean calories"
    ],
    ingredients: [
      "Whey Protein Isolate",
      "Roasted Oats",
      "Makhana Flour",
      "Dark Belgian Chocolate (70% cocoa)",
      "Dates Paste",
      "Almond Butter"
    ],
    nutritionFacts: {
      calories: "220 kcal",
      protein: "20g",
      carbs: "18g",
      fat: "6g",
      fiber: "4g"
    },
    tags: ["High Protein", "Chocolate", "No Added Sugar"]
  },
  {
    name: "Saffron Glazed Premium Almonds",
    description: "Handpicked premium Kashmiri almonds, lightly blanched and gently glazed with genuine liquid saffron threads and organic honey.",
    price: 450,
    compareAtPrice: 550,
    category: "Dry Fruits",
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 25,
    stock: 70,
    benefits: [
      "Immune-boosting saffron antioxidants",
      "High Vitamin E content for glowy skin",
      "Rich in cholesterol-reducing monounsaturated fats",
      "Luxurious festive treat"
    ],
    ingredients: [
      "Kashmiri Almonds",
      "Organic Wild Honey",
      "Kashmiri Saffron (Kesar)"
    ],
    nutritionFacts: {
      calories: "175 kcal",
      protein: "6.0g",
      carbs: "7g",
      fat: "14.5g",
      fiber: "3.2g"
    },
    tags: ["Luxury", "Honey Glazed", "Saffron Sourced"]
  }
];

const blogs = [
  {
    title: "Makhana: The Ancient Superfood Making a Modern Comeback",
    content: "Makhana (also known as foxnuts or lotus seeds) has been a staple in traditional Indian households and Ayurvedic medicine for thousands of years. Today, it is taking the global healthy snack industry by storm. But what makes this humble puffy white snack a superfood? \n\nFirst, makhanas are highly nutritious. They are a rich source of plant-based protein, dietary fiber, and essential minerals like magnesium, potassium, and phosphorus. Unlike high-carb fried snacks, makhanas are slow-roasted, offering a satisfying crunch with extremely low calories.\n\nSecondly, their glycemic index is very low, meaning they release energy slowly and prevent sugar spikes, making them a fantastic choice for diabetics or fitness lovers looking to curb mid-day cravings. At Makhana House, we slow-roast these organic pearls in a touch of healthy ghee and sea salt to retain their holistic goodness while elevating their crunch factor.",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&auto=format&fit=crop&q=80",
    tags: ["Makhana", "Superfoods", "Nutrition"],
    author: "Dr. Ananya Roy, Ayurvedic Nutritionist",
    readTime: "4 min read"
  },
  {
    title: "Why Omega-3 in Seeds is Crucial for Modern Lifestyles",
    content: "With sedentary work routines, stress, and packed schedules, our modern diets lack vital micro-nutrients, particularly Omega-3 fatty acids. While commonly found in fish, plant-based seeds like Chia, Flax, and Pumpkin seeds serve as outstanding reservoirs of clean, eco-friendly Alpha-Linolenic Acid (ALA).\n\nOmega-3 fatty acids are fundamental building blocks for cell membranes, crucial for brain health, reducing internal inflammation, and boosting cardiovascular health. Adding a spoonful of roasted mixed seeds into your daily smoothie, yogurt, or oatmeal supplies your body with the high-fiber support and mineral vitality it needs to stay sharp all day.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    tags: ["Seeds", "Omega 3", "Healthy Lifestyle"],
    author: "Rohan Sharma, Sports Nutrition Specialist",
    readTime: "3 min read"
  },
  {
    title: "How to Build a Mindful Snacking Routine at Your Desk",
    content: "We've all been there: sitting at our laptop around 4 PM, stressed about a deadline, and reaching for a bag of greasy potato chips or a sugary chocolate bar. The result? A temporary energy surge followed by an intense crash, brain fog, and guilt.\n\nBuilding a mindful snacking habit starts with preparation. By storing rich, low-calorie options like roasted foxnuts, protein nuts, or high-fiber trail mixes at your desk, you satisfy your sensory crunch cravings without crashing. Stay hydrated, listen to your natural hunger cues, and fuel your workspace with clean, smart calories.",
    image: "https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=800&auto=format&fit=crop&q=80",
    tags: ["Healthy Snacking", "Office Life", "Wellness"],
    author: "Aditi Sen, Corporate Wellness Coach",
    readTime: "5 min read"
  }
];

const coupons = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 499,
    isActive: true
  },
  {
    code: "HEALTHY20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 999,
    isActive: true
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 299,
    isActive: true
  }
];

const seedLocalDirect = () => {
  const localDbPath = path.join(__dirname, '../data/localDb.json');
  
  // Make admin password hash
  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync('admin123', salt);
  const userPassword = bcrypt.hashSync('user123', salt);

  const initialUsers = [
    {
      _id: "usr_admin001",
      name: "Makhana House Admin",
      email: "admin@makhanahouse.com",
      password: adminPassword,
      role: "admin",
      wishlist: [],
      createdAt: new Date().toISOString()
    },
    {
      _id: "usr_test0002",
      name: "Sneha Patel",
      email: "sneha@example.com",
      password: userPassword,
      role: "user",
      wishlist: ["prod_roasted1"],
      createdAt: new Date().toISOString()
    }
  ];

  // Assign custom ID to products to coordinate wishlist & seeds
  const formattedProducts = products.map((p, i) => ({
    _id: `prod_snack_${100 + i}`,
    ...p,
    createdAt: new Date().toISOString()
  }));

  const formattedBlogs = blogs.map((b, i) => ({
    _id: `blog_post_${100 + i}`,
    ...b,
    createdAt: new Date().toISOString()
  }));

  const formattedCoupons = coupons.map((c, i) => ({
    _id: `cpn_code_${100 + i}`,
    ...c,
    createdAt: new Date().toISOString()
  }));

  // Setup default orders to showcase analytics dashboard right away!
  const defaultOrders = [
    {
      _id: "ord_init_001",
      user: "usr_test0002",
      items: [
        {
          productId: "prod_snack_100",
          name: "Himalayan Pink Salt Roasted Makhana",
          price: 180,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80"
        },
        {
          productId: "prod_snack_103",
          name: "Ancient 5-Seed Power Boost Mix",
          price: 290,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80"
        }
      ],
      shippingAddress: {
        name: "Sneha Patel",
        email: "sneha@example.com",
        phone: "+91 9876543210",
        address: "Apt 4B, Sunflower Residency, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400050"
      },
      paymentMethod: "Razorpay",
      paymentStatus: "Completed",
      paymentId: "pay_rzp_99s8d7f8d",
      couponApplied: "WELCOME10",
      discountAmount: 65,
      shippingPrice: 0,
      totalAmount: 585,
      orderStatus: "Delivered",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      _id: "ord_init_002",
      user: "guest",
      items: [
        {
          productId: "prod_snack_106",
          name: "Antioxidant Royal Trail Mix",
          price: 380,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=600&auto=format&fit=crop&q=80"
        }
      ],
      shippingAddress: {
        name: "Rajesh Kumar",
        email: "rajesh@gmail.com",
        phone: "+91 9123456789",
        address: "102, Green Glen Layout, Bellandur",
        city: "Bengaluru",
        state: "Karnataka",
        zip: "560103"
      },
      paymentMethod: "COD",
      paymentStatus: "Pending",
      couponApplied: "",
      discountAmount: 0,
      shippingPrice: 50,
      totalAmount: 430,
      orderStatus: "Processing",
      createdAt: new Date().toISOString() // Today
    }
  ];

  const dbData = {
    users: initialUsers,
    products: formattedProducts,
    orders: defaultOrders,
    blogs: formattedBlogs,
    coupons: formattedCoupons
  };

  fs.writeFileSync(localDbPath, JSON.stringify(dbData, null, 2), 'utf-8');
};

const seedMongo = async () => {
  // If MongoDB runs, we connect and save
  const mongoose = require('mongoose');
  const Product = require('../models/Product');
  const Blog = require('../models/Blog');
  const Coupon = require('../models/Coupon');
  const User = require('../models/User');

  // Purge
  await Product.MongoModel.deleteMany({});
  await Blog.MongoModel.deleteMany({});
  await Coupon.MongoModel.deleteMany({});

  // Seed Products
  for (const p of products) {
    await Product.create(p);
  }
  // Seed Blogs
  for (const b of blogs) {
    await Blog.create(b);
  }
  // Seed Coupons
  for (const c of coupons) {
    await Coupon.create(c);
  }
  console.log('MongoDB successfully seeded!');
};

module.exports = {
  products,
  blogs,
  coupons,
  seedLocalDirect,
  seedMongo
};

// Check if run directly from terminal
if (require.main === module) {
  const { connectDB, isMock } = require('../config/db');
  const dotenv = require('dotenv');
  dotenv.config();

  const run = async () => {
    await connectDB();
    if (isMock()) {
      console.log('Seeding Local JSON Database file directly...');
      seedLocalDirect();
      console.log('Local Database Seed complete!');
      process.exit(0);
    } else {
      console.log('Seeding MongoDB database...');
      try {
        await seedMongo();
        console.log('MongoDB Seed complete!');
        process.exit(0);
      } catch (err) {
        console.error('Mongo Seeding error:', err);
        process.exit(1);
      }
    }
  };
  run();
}
