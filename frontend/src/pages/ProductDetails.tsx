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
      <div className="py-20 text-center font-mono">
        <h3 className="text-xl font-bold text-white font-ui">Product Not Found</h3>
        <Button onClick={() => navigate('/store')} className="mt-4 font-mono text-xs">Back to Store</Button>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-8 px-4 sm:px-6 max-w-[1400px] mx-auto flex flex-col gap-8 text-left relative z-10"
    >
      {/* Back button */}
      <div>
        <Button variant="secondary" onClick={() => navigate('/store')} className="font-mono text-xs">
          ← Back to Catalog
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image with zoom option */}
        <div className="flex flex-col gap-4">
          <div
            onClick={handleZoomToggle}
            className="relative rounded-xl overflow-hidden glass aspect-square max-h-[500px] cursor-zoom-in flex items-center justify-center bg-slate-900/60 border border-white/10"
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: zoomImage ? 1.5 : 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            />
            
            <div className="absolute bottom-4 right-4 bg-[#080c14]/80 backdrop-blur-sm text-xs font-mono px-3 py-1.5 rounded border border-white/10 text-slate-300">
              {zoomImage ? "Tap to fit" : "Tap to zoom"}
            </div>
            
            {product.isFlipkartAssured && (
              <Badge variant="primary" className="absolute top-4 left-4 px-2 py-1 text-[10px] font-mono tracking-widest bg-[#F8CB2E] text-[#080c14] font-black border-none">
                Assured
              </Badge>
            )}
          </div>
        </div>

        {/* Right Column: Title, Ratings, Offers, Pin checks, and Actions */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 leading-tight font-ui">{product.name}</h1>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2.5 mt-2 font-mono">
              <span className="flex items-center gap-0.5 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>{product.rating}</span>
              </span>
              <span className="text-xs text-slate-400">(1,243 Ratings & 342 Reviews)</span>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-4 bg-[#0d1220] rounded-xl border border-white/10 flex items-baseline gap-3 font-mono">
            <span className="text-3xl font-extrabold text-[#F8CB2E]">
              ₹{(product.price * (1 - product.discount)).toLocaleString('en-IN', {maximumFractionDigits: 0})}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-slate-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-emerald-400 font-bold">{Math.round(product.discount * 100)}% off</span>
              </>
            )}
          </div>

          {/* Offers Section */}
          <div className="flex flex-col gap-2 font-mono">
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
          <form onSubmit={handleDeliveryCheck} className="flex flex-col gap-2.5 pt-4 border-t border-white/10 font-mono">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Check Delivery Availability</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter 6-digit pin code (e.g. 560001)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={6}
                className="max-w-[280px] font-mono"
              />
              <Button type="submit" variant="secondary" className="font-mono text-xs">Check</Button>
            </div>
            {deliveryStatus && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <Truck size={14} className="text-[#F8CB2E]" />
                <span>{deliveryStatus}</span>
              </div>
            )}
          </form>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10 font-mono">
            <Button
              onClick={handleAddCart}
              className="flex-1 py-3 text-sm font-bold uppercase tracking-wider"
              variant="primary"
            >
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 py-3 text-sm font-bold bg-[#F8CB2E] hover:bg-yellow-400 text-[#080c14] border-none uppercase tracking-wider shadow-lg shadow-[#F8CB2E]/20"
            >
              <span>Buy Now</span>
            </Button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-lg border text-sm font-semibold active:scale-95 transition-all cursor-pointer ${
                wishlist.includes(product.id)
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/60'
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
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex gap-4 border-b border-white/10 font-mono">
          <button
            onClick={() => handleTabChange('specs')}
            className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
              activeTab === 'specs' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Product Specifications
            {activeTab === 'specs' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8CB2E]" layoutId="detailsTabLine" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
              activeTab === 'reviews' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Reviews (45)
            {activeTab === 'reviews' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8CB2E]" layoutId="detailsTabLine" />
            )}
          </button>
        </div>

        <div>
          {activeTab === 'specs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl text-sm font-mono">
              <div className="flex border-b border-white/5 pb-2">
                <span className="w-1/3 text-slate-400 font-medium">Model Brand</span>
                <span className="w-2/3 text-slate-200">{product.brand}</span>
              </div>
              <div className="flex border-b border-white/5 pb-2">
                <span className="w-1/3 text-slate-400 font-medium">Category</span>
                <span className="w-2/3 text-slate-200">{product.category}</span>
              </div>
              <div className="flex border-b border-white/5 pb-2">
                <span className="w-1/3 text-slate-400 font-medium">Seller Account</span>
                <span className="w-2/3 text-slate-200">{product.seller}</span>
              </div>
              <div className="flex border-b border-white/5 pb-2">
                <span className="w-1/3 text-slate-400 font-medium">Description</span>
                <span className="w-2/3 text-slate-200">{product.description}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-2xl text-xs font-mono">
              <div className="p-4 bg-[#0d1220] rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">5 ★</span>
                    <span className="font-bold text-slate-200">Outstanding product quality</span>
                  </div>
                  <span className="text-slate-500">Buyer super_shopper — 2 days ago</span>
                </div>
                <p className="text-slate-400">Fits perfectly and functions exactly as detailed. Highly recommended for standard daily use!</p>
              </div>
              <div className="p-4 bg-[#0d1220] rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold">2 ★</span>
                    <span className="font-bold text-slate-200">Minor issues with packaging</span>
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
        <div className="flex flex-col gap-4 text-sm font-mono text-slate-300">
          <div className="grid grid-cols-3 gap-2 font-bold border-b border-white/10 pb-2">
            <span>Metric</span>
            <span>This Product</span>
            <span>Competitor alternative</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-2">
            <span className="text-slate-400">Name</span>
            <span className="font-bold text-white line-clamp-1">{product.name}</span>
            <span className="text-slate-400">{compProduct.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-2">
            <span className="text-slate-400">Customer Rating</span>
            <span className="text-amber-400 font-bold">{product.rating} ★</span>
            <span className="text-slate-400">{compProduct.rating} ★</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-2">
            <span className="text-slate-400">Price (Net)</span>
            <span className="font-bold text-[#F8CB2E]">₹{(product.price * (1 - product.discount)).toLocaleString()}</span>
            <span className="text-slate-400">₹{compProduct.price.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pb-2">
            <span className="text-slate-400">Seller Rating</span>
            <span className="text-emerald-400 font-bold">4.2 / 5</span>
            <span className="text-slate-400">{compProduct.sellerRating}</span>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ProductDetails;
