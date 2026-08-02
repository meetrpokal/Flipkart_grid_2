import { create } from 'zustand';
import { apiService } from '../services/api';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  seller: string;
  price: number;
  discount: number;
  isFlipkartAssured: boolean;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoggedEvent {
  sessionId: string;
  userId: string;
  timestamp: string;
  page: string;
  eventType: string;
  metadata: Record<string, any>;
}

export interface FeatureAttribution {
  feature: string;
  importance: number;
  direction: string;
}

export interface PredictionState {
  abandonmentProbability: number;
  prediction: boolean;
  rootCause: string;
  recommendedIntervention: string;
  confidence: number;
  topFeatures: FeatureAttribution[];
}

interface StateStore {
  // Authentication & Sessions
  sessionId: string;
  userId: string;
  theme: 'dark' | 'light';
  
  // Product Catalog
  products: Product[];
  currentProduct: Product | null;
  
  // Cart
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  
  // Audited Event logs
  events: LoggedEvent[];
  
  // AI prediction outputs
  prediction: PredictionState | null;

  // Dashboard configuration state
  dashboardState: {
    activeTab: string;
    isAnalyzing: boolean;
  };
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  
  // Actions
  toggleTheme: () => void;
  setSessionId: (id: string) => void;
  setUserId: (id: string) => void;
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
  logEvent: (page: string, eventType: string, metadata?: Record<string, any>) => void;
  setPrediction: (pred: PredictionState | null) => void;
  setDashboardState: (dashboard: Partial<StateStore['dashboardState']>) => void;
}

// Generate random session id
const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<StateStore>((set, get) => ({
  sessionId: generateId(),
  userId: "USR-8824",
  theme: 'dark',
  
  products: [
    {
      id: "prod-1",
      name: "Flipkart SmartBuy 20000mAh Power Bank",
      brand: "Flipkart SmartBuy",
      category: "Electronics",
      rating: 4.3,
      seller: "SuperComNet",
      price: 1899,
      discount: 0.35,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&auto=format&fit=crop&q=60",
      description: "Fast charging 20000mAh lithium polymer power bank with dual USB outputs and Type-C input support."
    },
    {
      id: "prod-2",
      name: "boAt Rockerz 450 Bluetooth Headphone",
      brand: "boAt",
      category: "Electronics",
      rating: 4.1,
      seller: "RetailNet",
      price: 2990,
      discount: 0.50,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      description: "Wireless Bluetooth headphones featuring 40mm dynamic drivers and up to 15 hours of playback time."
    },
    {
      id: "prod-3",
      name: "Mi Smart TV 4A 32-inch LED TV",
      brand: "Mi",
      category: "Home Appliances",
      rating: 4.4,
      seller: "OmniTechRetail",
      price: 15999,
      discount: 0.20,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=60",
      description: "HD Ready Android smart TV featuring cinematic stereo sound and Google Assistant integration."
    },
    {
      id: "prod-4",
      name: "Premium Cotton Casual Check Shirt",
      brand: "Roadster",
      category: "Fashion",
      rating: 3.9,
      seller: "StyleNet",
      price: 1299,
      discount: 0.40,
      isFlipkartAssured: false,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
      description: "100% premium cotton slim fit casual check shirt with double chest patch pockets."
    },
    {
      id: "prod-5",
      name: "L'Oreal Paris Extraordinary Hair Oil",
      brand: "L'Oreal Paris",
      category: "Beauty & Personal Care",
      rating: 4.5,
      seller: "BeautyPlus",
      price: 499,
      discount: 0.15,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60",
      description: "Premium hair serum enriched with 6 rare flower oils, perfect for split ends and deep nourishment."
    },
    {
      id: "prod-6",
      name: "Philips Daily Collection Air Fryer",
      brand: "Philips",
      category: "Home Appliances",
      rating: 4.6,
      seller: "KitchenStore",
      price: 9995,
      discount: 0.25,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=60",
      description: "Healthy air frying technology using hot air circulation to cook delicious meals with up to 90% less oil."
    },
    {
      id: "prod-7",
      name: "Monopoly Deal Card Game for Families",
      brand: "Hasbro",
      category: "Books & Toys",
      rating: 4.2,
      seller: "ToyWorld",
      price: 299,
      discount: 0.10,
      isFlipkartAssured: false,
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&auto=format&fit=crop&q=60",
      description: "Fast-paced, addictive card game where your luck can change in the play of a single card."
    },
    {
      id: "prod-8",
      name: "Cosmic Byte CB-GK-16 Mechanical Keyboard",
      brand: "Cosmic Byte",
      category: "Electronics",
      rating: 4.0,
      seller: "GamerNet",
      price: 2499,
      discount: 0.30,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60",
      description: "Blue switch mechanical gaming keyboard with customisable RGB backlighting profiles and anti-ghosting."
    },
    {
      id: "prod-9",
      name: "Premium Leather Bi-fold Men's Wallet",
      brand: "Puma",
      category: "Fashion",
      rating: 4.2,
      seller: "PumaRetail",
      price: 1499,
      discount: 0.45,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1627124709743-4ac5036f3c02?w=500&auto=format&fit=crop&q=60",
      description: "Genuine high-grade grain leather bi-fold wallet featuring 6 card compartments and separate coin pocket."
    },
    {
      id: "prod-10",
      name: "Neutrogena Hydro Boost Water Gel",
      brand: "Neutrogena",
      category: "Beauty & Personal Care",
      rating: 4.4,
      seller: "SkincareIndia",
      price: 1150,
      discount: 0.10,
      isFlipkartAssured: true,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
      description: "Clinically proven oil-free water gel moisturiser containing hyaluronic acid for deep hydration."
    }
  ],
  currentProduct: null,
  cart: [],
  wishlist: [],
  events: [],
  prediction: null,
  toast: null,
  dashboardState: {
    activeTab: 'overview',
    isAnalyzing: false
  },
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setSessionId: (id) => set({ sessionId: id }),
  setUserId: (id) => set({ userId: id }),
  setProducts: (products) => set({ products }),
  setCurrentProduct: (product) => set({ currentProduct: product }),
  
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.product.id === product.id);
    let newCart;
    if (existing) {
      newCart = state.cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...state.cart, { product, quantity: 1 }];
    }
    return { cart: newCart };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  
  changeQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  })),
  
  toggleWishlist: (productId) => set((state) => {
    const active = state.wishlist.includes(productId);
    const newWish = active 
      ? state.wishlist.filter(id => id !== productId)
      : [...state.wishlist, productId];
    return { wishlist: newWish };
  }),
  
  clearCart: () => set({ cart: [] }),
  
  logEvent: (page, eventType, metadata = {}) => {
    const state = get();
    const newEvent: LoggedEvent = {
      sessionId: state.sessionId,
      userId: state.userId,
      timestamp: new Date().toISOString(),
      page,
      eventType,
      metadata
    };
    
    const updatedEvents = [...state.events, newEvent];
    set({ events: updatedEvents });

    // Trigger HUD notification for visual feedback
    state.showToast(`AI System Logged: ${eventType}`, 'info');

    // Sync event with backend
    apiService.logEvents([newEvent]).catch((err) => {
      console.warn("Failed to sync event with backend database:", err);
    });
  },
  
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
  setPrediction: (pred) => set({ prediction: pred }),
  setDashboardState: (dashboard) => set((state) => ({
    dashboardState: { ...state.dashboardState, ...dashboard }
  }))
}));
