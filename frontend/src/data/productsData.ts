import type { Product } from '../types/product';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Flipkart SmartBuy 20000mAh Power Bank",
    brand: "Flipkart SmartBuy",
    category: "Electronics",
    rating: 4.3,
    ratingCount: 1840,
    reviewCount: 412,
    seller: "SuperComNet",
    sellerRating: "4.4 / 5",
    price: 2899,
    originalPrice: 2899,
    discount: 0.35,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622445268465-840246e47683?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Fast charging 20000mAh lithium polymer power bank with dual USB outputs, 22.5W Power Delivery, and Type-C input support. Features multi-layer circuit protection.",
    offers: [
      { type: "Bank Offer", title: "5% Unlimited Cashback", detail: "5% Cashback on Flipkart Axis Bank Credit Card T&C" },
      { type: "Partner Offer", title: "Surprise Coupon", detail: "Get ₹200 extra discount coupon on your next electronic accessories purchase" },
      { type: "Financing", title: "No Cost EMI", detail: "No cost EMI starting from ₹317/month with Bajaj Finserv & major bank credit cards" }
    ],
    specifications: {
      "Model Name": "SmartBuy PD 20000",
      "Capacity": "20000 mAh",
      "Output Power": "22.5 W Fast Charge",
      "Input Ports": "Type-C & Micro USB",
      "Output Ports": "2 x USB-A, 1 x Type-C",
      "Battery Type": "Lithium Polymer",
      "Warranty": "1 Year Domestic Brand Warranty"
    },
    aiSummary: {
      overall: "Customers highly appreciate the fast charging speed, massive 20,000mAh battery backup, and durable build quality. Most negative feedback relates to slightly heavy weight.",
      positive: ["22.5W Fast Power Delivery", "Durable build finish", "Charges phone up to 4 times"],
      negative: ["Slightly heavy in pocket", "Wall charger plug not included"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-1", name: "High-Speed Braided Type-C Cable (1.5m)", price: 299, originalPrice: 699, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-2", name: "30W Dual Port Fast Wall Adapter", price: 599, originalPrice: 1299, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-3", name: "1 Year Extended Damage Protection", price: 149, originalPrice: 399, image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80", defaultSelected: false }
    ],
    reviews: [
      {
        reviewId: "rev-101",
        userName: "Aarav Sharma",
        rating: 5,
        title: "Must buy powerbank for travelers!",
        comment: "Charged my iPhone 14 Pro almost 4.5 times on a single charge. The fast charging speed is incredible. Built sturdy.",
        verifiedPurchase: true,
        date: "14 Jul 2025",
        helpfulCount: 42,
        productVariant: "Black / 20000mAh",
        images: ["https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=400&auto=format&fit=crop&q=80"]
      },
      {
        reviewId: "rev-102",
        userName: "Neha Gupta",
        rating: 4,
        title: "Good backup but a bit heavy",
        comment: "Capacity is genuinely 20,000mAh. Takes around 5 hours to full charge with 20W charger. Bit bulky to carry in small bags.",
        verifiedPurchase: true,
        date: "02 Jun 2025",
        helpfulCount: 18,
        productVariant: "Black / 20000mAh"
      },
      {
        reviewId: "rev-103",
        userName: "Rohan Varma",
        rating: 5,
        title: "Value for money product",
        comment: "Using it for 3 months now. No heating issues while charging dual devices simultaneously. Flipkart Assured delivery was fast.",
        verifiedPurchase: true,
        date: "28 May 2025",
        helpfulCount: 11
      }
    ]
  },

  {
    id: "prod-2",
    name: "boAt Rockerz 450 Bluetooth Headphone",
    brand: "boAt",
    category: "Electronics",
    rating: 4.1,
    ratingCount: 1243,
    reviewCount: 342,
    seller: "RetailNet",
    sellerRating: "4.5 / 5",
    price: 3990,
    originalPrice: 3990,
    discount: 0.50,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Wireless Bluetooth headphones featuring 40mm dynamic drivers, punchy bass, plush ear cushions, and up to 15 hours of continuous playback time with ASAP Fast Charge.",
    offers: [
      { type: "Bank Offer", title: "10% Instant Discount", detail: "10% off on HDFC Bank Credit Card EMI Transactions up to ₹1,250" },
      { type: "Partner Offer", title: "Free Wynk Music Subscription", detail: "Get 6 months free Wynk Premium subscription on purchase" },
      { type: "Financing", title: "No Cost EMI", detail: "Zero processing fee EMI starting from ₹332/month" }
    ],
    specifications: {
      "Model Name": "Rockerz 450",
      "Headphone Type": "On-Ear Wireless",
      "Driver Size": "40 mm Dynamic",
      "Battery Life": "Up to 15 Hours",
      "Fast Charge": "10 mins charge = 90 mins playtime",
      "Bluetooth Version": "v5.0",
      "Warranty": "1 Year boAt Brand Warranty"
    },
    aiSummary: {
      overall: "Customers highly appreciate the powerful bass response, sleek matte finish, long battery backup, and cushion comfort. Minor negative reviews mention tight headband pressure during long gaming sessions.",
      positive: ["Punchy Super Extra Bass", "Solid 15-hour playback", "Fast ASAP charging"],
      negative: ["Headband fits tight initially", "Outer cardboard package was dented"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-4", name: "Hard EVA Travel Case for Headphones", price: 349, originalPrice: 899, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-5", name: "3.5mm Gold-Plated Braided AUX Cable", price: 199, originalPrice: 499, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-6", name: "1 Year Complete Audio Protection Plan", price: 99, originalPrice: 299, image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80", defaultSelected: false }
    ],
    reviews: [
      {
        reviewId: "rev-201",
        userName: "Vikram Malhotra",
        rating: 5,
        title: "Incredible Bass & Battery for the price!",
        comment: "Sound quality is punchy and crisp. Connected seamlessly with my smartphone and laptop. Battery easily lasts 2 full work days.",
        verifiedPurchase: true,
        date: "20 Jul 2025",
        helpfulCount: 56,
        productVariant: "Lush Black",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"]
      },
      {
        reviewId: "rev-202",
        userName: "Priya Nair",
        rating: 4,
        title: "Awesome sound, comfortable pads",
        comment: "Clear vocals and deep bass. Ear padding is soft. Controls on the ear cup work smoothly for calls.",
        verifiedPurchase: true,
        date: "10 Jun 2025",
        helpfulCount: 29,
        productVariant: "Hazel Beige"
      },
      {
        reviewId: "rev-203",
        userName: "Karthik R",
        rating: 3,
        title: "Decent audio but headband feels tight",
        comment: "Audio quality is great, but after 2 hours of wearing, headband feels a bit tight on ears. Good for short sessions.",
        verifiedPurchase: true,
        date: "15 May 2025",
        helpfulCount: 14,
        productVariant: "Lush Black"
      }
    ]
  },

  {
    id: "prod-2b",
    name: "boAt Rockerz 550 Over-Ear Headphone",
    brand: "boAt",
    category: "Electronics",
    rating: 4.3,
    ratingCount: 2150,
    reviewCount: 512,
    seller: "RetailNet",
    sellerRating: "4.5 / 5",
    price: 4990,
    originalPrice: 4990,
    discount: 0.55,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Over-ear wireless headphones with 50mm dynamic drivers, physical noise isolation, up to 20 hours battery life, and ergonomic earcups.",
    offers: [
      { type: "Bank Offer", title: "10% Instant Discount", detail: "10% off on ICICI Bank Cards" },
      { type: "Special Offer", title: "Extra ₹300 Off", detail: "Special price discount included in final price" }
    ],
    specifications: {
      "Model Name": "Rockerz 550",
      "Headphone Type": "Over-Ear Wireless",
      "Driver Size": "50 mm Dynamic",
      "Battery Life": "20 Hours",
      "Warranty": "1 Year Brand Warranty"
    },
    aiSummary: {
      overall: "Users love the 50mm drivers and soft over-ear cushions for immersive gaming and music. High satisfaction overall.",
      positive: ["50mm bass drivers", "20hr continuous playtime", "Over-ear passive noise isolation"],
      negative: ["Takes 2.5 hours to full charge"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-550-1",
        userName: "Devang Patel",
        rating: 5,
        title: "Best Over-Ear headphone under 2500!",
        comment: "The 50mm drivers produce incredible sub-bass. Ears are fully enclosed so no fatigue.",
        verifiedPurchase: true,
        date: "01 Aug 2025",
        helpfulCount: 38,
        productVariant: "Army Green"
      }
    ]
  },

  {
    id: "prod-2c",
    name: "JBL Tune 760NC Wireless Headphones",
    brand: "JBL",
    category: "Electronics",
    rating: 4.4,
    ratingCount: 3410,
    reviewCount: 680,
    seller: "OmniTechRetail",
    sellerRating: "4.6 / 5",
    price: 7999,
    originalPrice: 7999,
    discount: 0.35,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Active Noise Cancelling wireless headphones with Pure Bass Sound, 35 hours battery life with ANC on, multipoint Bluetooth connection.",
    offers: [
      { type: "Bank Offer", title: "Flat ₹500 Off", detail: "Flat ₹500 discount on SBI Credit Cards" }
    ],
    specifications: {
      "Model Name": "Tune 760NC",
      "Headphone Type": "Over-Ear ANC",
      "Battery Life": "35 Hours (ANC On)",
      "Warranty": "1 Year JBL Warranty"
    },
    aiSummary: {
      overall: "Customers praise JBL Pure Bass sound, active noise cancellation performance, and lightweight foldable design.",
      positive: ["Active Noise Cancellation", "35 Hours battery backup", "Multipoint connection"],
      negative: ["Mic quality is average in noisy outdoors"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-jbl-1",
        userName: "Siddharth Mehta",
        rating: 5,
        title: "ANC works like magic on flights!",
        comment: "Blocks airplane cabin drone noise completely. Crisp highs and deep signature JBL bass.",
        verifiedPurchase: true,
        date: "25 Jul 2025",
        helpfulCount: 45
      }
    ]
  },

  {
    id: "prod-2d",
    name: "Sony WH-CH520 Wireless Headset",
    brand: "Sony",
    category: "Electronics",
    rating: 4.5,
    ratingCount: 4200,
    reviewCount: 890,
    seller: "SonyAuthorised",
    sellerRating: "4.8 / 5",
    price: 5990,
    originalPrice: 5990,
    discount: 0.25,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Wireless headphones with up to 50 hours battery life, DSEE sound enhancement, crystal clear hands-free call quality, multipoint pairing.",
    offers: [
      { type: "Bank Offer", title: "₹750 Cashback", detail: "Cashback on Sony Center purchases" }
    ],
    specifications: {
      "Model Name": "WH-CH520",
      "Battery Life": "50 Hours",
      "DSEE Engine": "Yes",
      "Warranty": "1 Year Sony India Warranty"
    },
    aiSummary: {
      overall: "Unmatched 50-hour battery life and supreme voice call clarity make it the top choice for remote work and travel.",
      positive: ["50-hour battery monster", "DSEE audio upscale", "Multipoint dual device connection"],
      negative: ["Non-collapsible headband structure"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-sony-1",
        userName: "Ananya Roy",
        rating: 5,
        title: "Battery lasts an entire week!",
        comment: "I charge it once a week. Audio quality for Zoom calls and Spotify is stellar.",
        verifiedPurchase: true,
        date: "18 Jun 2025",
        helpfulCount: 62
      }
    ]
  },

  {
    id: "prod-3",
    name: "Mi Smart TV 4A 32-inch LED TV",
    brand: "Mi",
    category: "Home Appliances",
    rating: 4.4,
    ratingCount: 5820,
    reviewCount: 1120,
    seller: "OmniTechRetail",
    sellerRating: "4.6 / 5",
    price: 19999,
    originalPrice: 19999,
    discount: 0.20,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&auto=format&fit=crop&q=80"
    ],
    description: "HD Ready Android smart TV featuring 20W Dolby Audio stereo speakers, PatchWall with 30+ OTT content partners, Chromecast built-in, and Google Assistant voice remote.",
    offers: [
      { type: "Bank Offer", title: "₹1,500 Off", detail: "Flat ₹1,500 discount on Axis & ICICI Credit Cards" },
      { type: "Partner Offer", title: "Free OTT Pack", detail: "3 Months SonyLIV & Zee5 Subscription included" }
    ],
    specifications: {
      "Display Size": "32 Inches (80 cm)",
      "Resolution": "HD Ready (1366 x 768)",
      "Sound Output": "20 W Dolby Audio",
      "Operating System": "Android TV 11 with PatchWall",
      "RAM / ROM": "1 GB RAM / 8 GB Storage",
      "Ports": "3 x HDMI, 2 x USB",
      "Warranty": "1 Year Complete + 1 Year Additional Panel Warranty"
    },
    aiSummary: {
      overall: "Customers love the vibrant LED panel, easy Android UI, and crisp 20W Dolby speakers. Delivery installation team is prompt.",
      positive: ["Vibrant HD display colors", "Dolby Audio sound clarity", "Smooth PatchWall interface"],
      negative: ["Remote lacks dedicated mute button"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-7", name: "Heavy Duty Full Motion Wall Mount Bracket", price: 499, originalPrice: 1299, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-8", name: "Gold-Plated 4K HDMI Cable (2m)", price: 299, originalPrice: 699, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80", defaultSelected: true },
      { id: "acc-9", name: "3 Year TV Extended Warranty Protection", price: 999, originalPrice: 2499, image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80", defaultSelected: false }
    ],
    reviews: [
      {
        reviewId: "rev-301",
        userName: "Rajesh K",
        rating: 5,
        title: "Best budget smart TV for bedroom",
        comment: "Picture clarity is amazing for HD content. Sound is loud and clear without soundbar. Wall mounting done within 24 hours of delivery.",
        verifiedPurchase: true,
        date: "05 Aug 2025",
        helpfulCount: 78
      }
    ]
  },

  {
    id: "prod-4",
    name: "Premium Cotton Casual Check Shirt",
    brand: "Roadster",
    category: "Fashion",
    rating: 3.9,
    ratingCount: 890,
    reviewCount: 195,
    seller: "StyleNet",
    sellerRating: "4.1 / 5",
    price: 2199,
    originalPrice: 2199,
    discount: 0.40,
    isFlipkartAssured: false,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
    ],
    description: "100% premium breathable cotton slim fit casual check shirt featuring curved hemline, buttoned cuffs, and double chest patch pockets.",
    offers: [
      { type: "Bank Offer", title: "Extra 10% Off", detail: "Buy 2 apparel items and get extra 10% discount" }
    ],
    specifications: {
      "Fabric": "100% Cotton",
      "Fit": "Slim Fit",
      "Pattern": "Tartan Checkered",
      "Sleeve": "Long Sleeves",
      "Collar": "Spread Collar",
      "Wash Care": "Machine Wash Warm"
    },
    aiSummary: {
      overall: "Customers love the soft 100% cotton fabric feel and stylish checkered pattern. Some recommend ordering one size larger for relaxed fit.",
      positive: ["Soft breathable cotton", "Trendy colors and fit", "Durable stitching"],
      negative: ["Shrinks slightly after hot water wash"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-10", name: "Slim Fit Stretchable Denim Jeans", price: 1199, originalPrice: 2499, image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=400&auto=format&fit=crop&q=80", defaultSelected: true }
    ],
    reviews: [
      {
        reviewId: "rev-401",
        userName: "Manish Tiwari",
        rating: 4,
        title: "Stylish shirt with great fabric",
        comment: "Color matches exact photos. Fabric is 100% cotton so very comfortable in summer heat.",
        verifiedPurchase: true,
        date: "12 May 2025",
        helpfulCount: 22
      }
    ]
  },

  {
    id: "prod-5",
    name: "L'Oreal Paris Extraordinary Hair Oil",
    brand: "L'Oreal Paris",
    category: "Beauty & Personal Care",
    rating: 4.5,
    ratingCount: 3200,
    reviewCount: 780,
    seller: "BeautyPlus",
    sellerRating: "4.7 / 5",
    price: 599,
    originalPrice: 599,
    discount: 0.15,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Multi-use hair serum enriched with 6 rare flower oils. Tames frizz, seals split ends, provides heat protection up to 230°C, and gives glossy shine.",
    offers: [
      { type: "Special Offer", title: "Free Beauty Sample", detail: "Get a free 15ml face wash sample on beauty orders above ₹499" }
    ],
    specifications: {
      "Volume": "100 ml",
      "Hair Type": "All Hair Types",
      "Key Ingredients": "Lotus, Chamomile, Rose, Tiare, Matricaria, Flax",
      "Heat Protection": "Up to 230°C",
      "Form": "Non-greasy Serum Oil"
    },
    aiSummary: {
      overall: "Top-rated hair serum for frizz control, non-sticky texture, and floral fragrance. Highly recommended by verified buyers.",
      positive: ["Lightweight non-sticky texture", "Delightful fragrance", "Instant frizz control"],
      negative: ["Glass bottle requires careful handling"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-11", name: "L'Oreal Paris Hyaluron Moisture Shampoo", price: 349, originalPrice: 499, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80", defaultSelected: true }
    ],
    reviews: [
      {
        reviewId: "rev-501",
        userName: "Sneha Reddy",
        rating: 5,
        title: "Magic serum for dry frizzy hair!",
        comment: "Makes hair silky smooth without making it look oily or flat. Scent is heavenly.",
        verifiedPurchase: true,
        date: "22 Jul 2025",
        helpfulCount: 64
      }
    ]
  },

  {
    id: "prod-6",
    name: "Philips Daily Collection Air Fryer",
    brand: "Philips",
    category: "Home Appliances",
    rating: 4.6,
    ratingCount: 4120,
    reviewCount: 950,
    seller: "KitchenStore",
    sellerRating: "4.8 / 5",
    price: 13295,
    originalPrice: 13295,
    discount: 0.25,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Healthy air frying technology using Rapid Air hot air circulation to cook crispy fries, snacks, and grills with up to 90% less oil.",
    offers: [
      { type: "Bank Offer", title: "₹1,000 Instant Off", detail: "Instant discount on HDFC & ICICI Credit Cards" }
    ],
    specifications: {
      "Capacity": "4.1 Liters",
      "Power Wattage": "1400 W",
      "Technology": "Rapid Air Circulation",
      "Auto Shut-off": "Yes with Timer signal",
      "Dishwasher Safe": "Removable basket parts",
      "Warranty": "2 Years Worldwide Philips Warranty"
    },
    aiSummary: {
      overall: "Customers love the 90% oil-free frying result, crispy texture for samosas & fries, and easy basket cleaning.",
      positive: ["Requires minimal oil", "Crispy snack texture", "Easy dishwasher safe basket"],
      negative: ["Power cable is short (1 meter)"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-12", name: "Perforated Air Fryer Parchment Paper Liners (100 pcs)", price: 249, originalPrice: 599, image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=400&auto=format&fit=crop&q=80", defaultSelected: true }
    ],
    reviews: [
      {
        reviewId: "rev-601",
        userName: "Dr. Vikram Seth",
        rating: 5,
        title: "Best health investment for family",
        comment: "Fries chicken and snacks crispy without oil soaked guilt. Easy to clean. Highly recommended!",
        verifiedPurchase: true,
        date: "19 May 2025",
        helpfulCount: 88
      }
    ]
  },

  {
    id: "prod-7",
    name: "Monopoly Deal Card Game for Families",
    brand: "Hasbro",
    category: "Books & Toys",
    rating: 4.2,
    ratingCount: 1450,
    reviewCount: 290,
    seller: "ToyWorld",
    sellerRating: "4.3 / 5",
    price: 335,
    originalPrice: 335,
    discount: 0.10,
    isFlipkartAssured: false,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Fast-paced, addictive card game where your luck can change in the play of a single card. Collect 3 complete property sets to win.",
    offers: [
      { type: "Special Offer", title: "Buy 3 Get 10% Off", detail: "Mix and match toy card games for bundle savings" }
    ],
    specifications: {
      "Age Group": "8+ Years",
      "Players": "2 to 5 Players",
      "Play Time": "15 to 30 Minutes",
      "In the Box": "110 Deal Cards & Rulebook"
    },
    aiSummary: {
      overall: "Fun, quick, strategic game praised by adults and kids alike.",
      positive: ["Fast 15-min game sessions", "High replay value", "Easy to learn rules"],
      negative: ["Card paper quality is thin"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-701",
        userName: "Komal Bajaj",
        rating: 5,
        title: "Super addicting family game!",
        comment: "Much faster and fun than traditional Monopoly board game. Perfect for game nights.",
        verifiedPurchase: true,
        date: "30 Jun 2025",
        helpfulCount: 33
      }
    ]
  },

  {
    id: "prod-8",
    name: "Cosmic Byte CB-GK-16 Mechanical Keyboard",
    brand: "Cosmic Byte",
    category: "Electronics",
    rating: 4.0,
    ratingCount: 1650,
    reviewCount: 380,
    seller: "GamerNet",
    sellerRating: "4.4 / 5",
    price: 3570,
    originalPrice: 3570,
    discount: 0.30,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Outemu Blue switch mechanical gaming keyboard with customisable RGB backlighting profiles, aluminum top chassis, and 100% anti-ghosting.",
    offers: [
      { type: "Bank Offer", title: "10% Off Gaming Gear", detail: "10% off on Canara Bank Debit Cards" }
    ],
    specifications: {
      "Switch Type": "Outemu Clicky Blue Mechanical",
      "Backlight": "RGB Multi-Mode FX",
      "Key Rollover": "Full Key Anti-Ghosting",
      "Cable": "Braided USB 1.8m",
      "Warranty": "1 Year Cosmic Byte Warranty"
    },
    aiSummary: {
      overall: "Gamers love the clicky blue tactile feedback, sturdy metal top plate, and bright RGB modes.",
      positive: ["Satisfying mechanical tactile click", "Solid aluminum top frame", "Vibrant RGB lighting"],
      negative: ["Click sound is loud in quiet office settings"]
    },
    frequentlyBoughtTogether: [
      { id: "acc-13", name: "Extended Anti-Slip RGB Gaming Mousepad (90x40cm)", price: 499, originalPrice: 1199, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80", defaultSelected: true }
    ],
    reviews: [
      {
        reviewId: "rev-801",
        userName: "Varun Nair",
        rating: 4,
        title: "Great mechanical keyboard under 2.5k",
        comment: "Click feedback is very crisp. Great for typing and Valorant gaming.",
        verifiedPurchase: true,
        date: "04 Jul 2025",
        helpfulCount: 27
      }
    ]
  },

  {
    id: "prod-9",
    name: "Premium Leather Bi-fold Men's Wallet",
    brand: "Puma",
    category: "Fashion",
    rating: 4.2,
    ratingCount: 1120,
    reviewCount: 230,
    seller: "PumaRetail",
    sellerRating: "4.5 / 5",
    price: 2725,
    originalPrice: 2725,
    discount: 0.45,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1627124709743-4ac5036f3c02?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1627124709743-4ac5036f3c02?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Genuine high-grade grain leather bi-fold wallet featuring 6 card compartments, RFID blocking layer, and separate coin pocket.",
    offers: [
      { type: "Partner Offer", title: "Flat 15% Off", detail: "Get 15% off when bought with Puma footwear" }
    ],
    specifications: {
      "Material": "100% Genuine Leather",
      "Card Slots": "6 Compartments",
      "RFID Protection": "Yes",
      "Color": "Tan Brown"
    },
    aiSummary: {
      overall: "Customers compliment the rich leather feel, slim profile, and RFID security feature.",
      positive: ["Genuine leather smell and texture", "RFID protection", "Slim pocket profile"],
      negative: ["Coin pocket snap button is stiff initially"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-901",
        userName: "Akash Deep",
        rating: 5,
        title: "Classy wallet with premium packaging",
        comment: "Real leather finish. Has plenty of card slots and fits smoothly in back pocket.",
        verifiedPurchase: true,
        date: "16 Jun 2025",
        helpfulCount: 19
      }
    ]
  },

  {
    id: "prod-10",
    name: "Neutrogena Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "Beauty & Personal Care",
    rating: 4.4,
    ratingCount: 2890,
    reviewCount: 640,
    seller: "SkincareIndia",
    sellerRating: "4.7 / 5",
    price: 1277,
    originalPrice: 1277,
    discount: 0.10,
    isFlipkartAssured: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Clinically proven oil-free water gel moisturiser containing hyaluronic acid and olive extract for 72-hour deep skin hydration.",
    offers: [
      { type: "Bank Offer", title: "5% Cashback", detail: "5% cashback on Flipkart Axis Bank Card" }
    ],
    specifications: {
      "Volume": "50 grams",
      "Skin Type": "All Skin Types (Oil-Free)",
      "Key Component": "Purified Hyaluronic Acid",
      "Dermatologist Tested": "Yes (Non-Comedogenic)"
    },
    aiSummary: {
      overall: "Dermatologist-recommended water gel loved for lightweight hydration, zero oiliness, and glass skin finish.",
      positive: ["Absorbs instantly without shine", "Deep hyaluronic hydration", "Non-comedogenic (no breakouts)"],
      negative: ["Price is premium for 50g jar"]
    },
    frequentlyBoughtTogether: [],
    reviews: [
      {
        reviewId: "rev-1001",
        userName: "Divya Kapoor",
        rating: 5,
        title: "Holy grail moisturizer for oily skin!",
        comment: "Feels like cooling water on skin. Keeps skin plump and soft whole day without greasy shine.",
        verifiedPurchase: true,
        date: "09 Jul 2025",
        helpfulCount: 52
      }
    ]
  }
];

// Algorithm for Section 5: Similar Product Recommendation Logic
// 40% Same Category, 25% Same Brand, 20% Similar Price, 10% Similar Rating, 5% Popularity
export function getRecommendedProducts(currentProduct: Product, allProducts: Product[], limit: number = 6): Product[] {
  const scored = allProducts
    .filter(p => p.id !== currentProduct.id)
    .map(candidate => {
      let score = 0;

      // 40% Same Category
      if (candidate.category.toLowerCase() === currentProduct.category.toLowerCase()) {
        score += 0.40;
      }

      // 25% Same Brand
      if (candidate.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
        score += 0.25;
      }

      // 20% Similar Price (|priceDiff| / refPrice)
      const currentFinalPrice = currentProduct.price * (1 - currentProduct.discount);
      const candidateFinalPrice = candidate.price * (1 - candidate.discount);
      const priceDiff = Math.abs(candidateFinalPrice - currentFinalPrice) / Math.max(1, currentFinalPrice);
      score += 0.20 * Math.max(0, 1 - priceDiff);

      // 10% Similar Rating (|ratingDiff| / 5)
      const ratingDiff = Math.abs(candidate.rating - currentProduct.rating) / 5.0;
      score += 0.10 * Math.max(0, 1 - ratingDiff);

      // 5% Popularity (ratingCount / 5000)
      const popScore = Math.min(1.0, (candidate.ratingCount || 500) / 5000.0);
      score += 0.05 * popScore;

      return { product: candidate, score };
    });

  // Sort descending by similarity score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.product);
}
