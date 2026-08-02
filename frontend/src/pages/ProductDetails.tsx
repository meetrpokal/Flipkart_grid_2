import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, Heart, ShoppingCart, BarChart2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Badge, Input, Modal } from '../components/DesignSystem';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, addToCart, logEvent } = useStore();

  const product = products.find(p => p.id === id);

  // Local UI States
  const [zoomImage, setZoomImage] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  
  // Modals for Actions
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Log page view on load
  useEffect(() => {
    if (product) {
      logEvent('ProductDetails', 'VIEW_PRODUCT', { productId: product.id, name: product.name });
    }
  }, [product, logEvent]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-white">Product Not Found</h3>
        <Button onClick={() => navigate('/store')} className="mt-4">Back to Store</Button>
      </div>
    );
  }

  // Event handlers
  const handleZoomToggle = () => {
    const nextState = !zoomImage;
    setZoomImage(nextState);
    logEvent('ProductDetails', 'ZOOM_IMAGE', { productId: product.id, zoomed: nextState });
  };

  const handleDeliveryCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;
    
    logEvent('ProductDetails', 'CHECK_DELIVERY', { productId: product.id, pinCode });
    
    // Simple mock delivery rule based on pin code length
    if (pinCode.startsWith('11') || pinCode.startsWith('40') || pinCode.startsWith('56')) {
      setDeliveryStatus("Standard Delivery by Tuesday — FREE");
    } else if (pinCode.length !== 6 || isNaN(Number(pinCode))) {
      setDeliveryStatus("Invalid Pin Code format. Enter 6 digits.");
    } else {
      setDeliveryStatus("Delivery available in 4-6 business days (Shipping: ₹40)");
    }
  };

  const handleTabChange = (tab: 'specs' | 'reviews') => {
    setActiveTab(tab);
    if (tab === 'specs') {
      logEvent('ProductDetails', 'VIEW_SPECIFICATIONS', { productId: product.id });
    } else {
      logEvent('ProductDetails', 'VIEW_REVIEWS', { productId: product.id });
    }
  };

  const handleCompareOpen = () => {
    setIsCompareOpen(true);
    logEvent('ProductDetails', 'COMPARE_PRODUCT', { productId: product.id });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    const active = wishlist.includes(product.id);
    logEvent('ProductDetails', 'WISHLIST', { productId: product.id, action: active ? 'remove' : 'add' });
  };

  const handleAddCart = () => {
    addToCart(product);
    logEvent('ProductDetails', 'ADD_TO_CART', { productId: product.id, price: product.price });
  };

  const handleBuyNow = () => {
    addToCart(product);
    logEvent('ProductDetails', 'BUY_NOW', { productId: product.id, price: product.price });
    navigate('/cart');
  };

  // Mock comparison details (Compare current product to a generic equivalent)
  const compProduct = {
    name: `Alternative ${product.category} Brand`,
    rating: 3.8,
    price: product.price * 0.9,
    sellerRating: "3.5 / 5",
    features: "Standard features without platform warranty"
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto flex flex-col gap-10 text-left">
      {/* Back button */}
      <div>
        <Button variant="secondary" onClick={() => navigate('/store')}>
          ← Back to Catalog
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image with zoom option */}
        <div className="flex flex-col gap-4">
          <div
            onClick={handleZoomToggle}
            className="relative rounded-xl overflow-hidden glass-card aspect-square max-h-[500px] cursor-zoom-in flex items-center justify-center bg-slate-900/60 border border-slate-800"
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: zoomImage ? 1.5 : 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            />
            
            <div className="absolute bottom-4 right-4 bg-slate-950/60 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded border border-white/5 text-slate-300">
              {zoomImage ? "Tap to fit" : "Tap to zoom"}
            </div>
            
            {product.isFlipkartAssured && (
              <Badge variant="primary" className="absolute top-4 left-4 px-2 py-1 text-[10px] tracking-widest bg-gradient-to-r from-ai-blue to-blue-600 border-none text-white">
                Assured
              </Badge>
            )}
          </div>
        </div>

        {/* Right Column: Title, Ratings, Offers, Pin checks, and Actions */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 leading-tight">{product.name}</h1>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2.5 mt-2">
              <span className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>{product.rating}</span>
              </span>
              <span className="text-xs text-slate-500">(1,243 Ratings & 342 Reviews)</span>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">₹{(product.price * (1 - product.discount)).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-slate-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-emerald-400 font-bold">{Math.round(product.discount * 100)}% off</span>
              </>
            )}
          </div>

          {/* Offers Section */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Offers</h4>
            <div className="flex flex-col gap-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">Bank Offer</span>
                <span>5% Unlimited Cashback on Flipkart Axis Bank Credit Card.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">Partner Offer</span>
                <span>Purchase this item and get a surprise coupon worth ₹200 for next order.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">Financing</span>
                <span>No Cost EMI available. Credit options from Flipkart Pay Later.</span>
              </div>
            </div>
          </div>

          {/* Delivery Check Form */}
          <form onSubmit={handleDeliveryCheck} className="flex flex-col gap-2.5 pt-4 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Check Delivery Availability</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter 6-digit pin code (e.g. 560001)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={6}
                className="max-w-[280px]"
              />
              <Button type="submit" variant="secondary">Check</Button>
            </div>
            {deliveryStatus && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <Truck size={14} className="text-ai-blue" />
                <span>{deliveryStatus}</span>
              </div>
            )}
          </form>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
            <Button
              onClick={handleAddCart}
              className="flex-1 py-3 text-base"
              variant="primary"
            >
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 py-3 text-base bg-amber-500 hover:bg-amber-600 text-slate-950 border-none"
            >
              <span>Buy Now</span>
            </Button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-lg border text-sm font-semibold active:scale-95 transition-all ${
                wishlist.includes(product.id)
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
              title="Add to Wishlist"
            >
              <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
            </button>
            <Button variant="secondary" onClick={handleCompareOpen} className="px-3" title="Compare Product">
              <BarChart2 size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Tabbed Sections (Specs / Reviews) */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex gap-4 border-b border-slate-800">
          <button
            onClick={() => handleTabChange('specs')}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              activeTab === 'specs' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Product Specifications
            {activeTab === 'specs' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ai-blue" layoutId="detailsTabLine" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              activeTab === 'reviews' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Customer Reviews (45)
            {activeTab === 'reviews' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ai-blue" layoutId="detailsTabLine" />
            )}
          </button>
        </div>

        <div>
          {activeTab === 'specs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl text-sm">
              <div className="flex border-b border-slate-900/60 pb-2">
                <span className="w-1/3 text-slate-500 font-medium">Model Brand</span>
                <span className="w-2/3 text-slate-300">{product.brand}</span>
              </div>
              <div className="flex border-b border-slate-900/60 pb-2">
                <span className="w-1/3 text-slate-500 font-medium">Category</span>
                <span className="w-2/3 text-slate-300">{product.category}</span>
              </div>
              <div className="flex border-b border-slate-900/60 pb-2">
                <span className="w-1/3 text-slate-500 font-medium">Seller Account</span>
                <span className="w-2/3 text-slate-300">{product.seller}</span>
              </div>
              <div className="flex border-b border-slate-900/60 pb-2">
                <span className="w-1/3 text-slate-500 font-medium">Description</span>
                <span className="w-2/3 text-slate-300">{product.description}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-2xl text-xs">
              <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">5 ★</span>
                    <span className="font-bold text-slate-300">Outstanding product quality</span>
                  </div>
                  <span className="text-slate-500">Buyer super_shopper — 2 days ago</span>
                </div>
                <p className="text-slate-400">Fits perfectly and functions exactly as detailed. Highly recommended for standard daily use!</p>
              </div>
              <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold">2 ★</span>
                    <span className="font-bold text-slate-300">Minor issues with packaging</span>
                  </div>
                  <span className="text-slate-500">Buyer anonymous — 5 days ago</span>
                </div>
                <p className="text-slate-400">Product functions correctly but shipping box arrived slightly squashed. Return policy seems decent though.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <Modal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} title="Product Comparison Matrix">
        <div className="flex flex-col gap-4 text-sm text-slate-300">
          <div className="grid grid-cols-3 gap-2 font-bold border-b border-slate-800 pb-2">
            <span>Metric</span>
            <span>This Product</span>
            <span>Competitor alternative</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-900/60 pb-2">
            <span className="text-slate-500">Name</span>
            <span className="font-bold text-white line-clamp-1">{product.name}</span>
            <span className="text-slate-400">{compProduct.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-900/60 pb-2">
            <span className="text-slate-500">Customer Rating</span>
            <span className="text-amber-500 font-bold">{product.rating} ★</span>
            <span className="text-slate-400">{compProduct.rating} ★</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-slate-900/60 pb-2">
            <span className="text-slate-500">Price (Net)</span>
            <span className="font-bold text-white">₹{(product.price * (1 - product.discount)).toLocaleString()}</span>
            <span className="text-slate-400">₹{compProduct.price.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pb-2">
            <span className="text-slate-500">Seller Rating</span>
            <span className="text-emerald-400 font-bold">4.2 / 5</span>
            <span className="text-slate-400">{compProduct.sellerRating}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetails;
