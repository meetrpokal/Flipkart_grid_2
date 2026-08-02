import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Card, Input } from '../components/DesignSystem';

const Cart: React.FC = () => {
  const { cart, changeQuantity, removeFromCart, logEvent } = useStore();
  const navigate = useNavigate();

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // 0.0 to 1.0 (e.g. 0.10 for 10% off)
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Log cart page view on mount
  useEffect(() => {
    logEvent('Cart', 'OPEN_CART');
  }, [logEvent]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const netPrice = item.product.price * (1 - item.product.discount);
    return acc + (netPrice * item.quantity);
  }, 0);

  // Free delivery threshold: ₹500
  const shippingCharges = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  
  const couponDiscountAmount = subtotal * appliedDiscount;
  const grandTotal = subtotal - couponDiscountAmount + shippingCharges;

  // Event handlers
  const handleQuantityIncrease = (productId: string, currentQty: number) => {
    changeQuantity(productId, currentQty + 1);
    logEvent('Cart', 'CHANGE_QUANTITY', { productId, quantity: currentQty + 1 });
  };

  const handleQuantityDecrease = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      changeQuantity(productId, currentQty - 1);
      logEvent('Cart', 'CHANGE_QUANTITY', { productId, quantity: currentQty - 1 });
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    logEvent('Cart', 'REMOVE_FROM_CART', { productId });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'FLIPKART50') {
      setAppliedDiscount(0.50);
      setCouponSuccess("FLIPKART50 applied successfully! 50% discount applied.");
      logEvent('Cart', 'APPLY_COUPON', { code, discount: 0.50 });
    } else if (code === 'SAVE10') {
      setAppliedDiscount(0.10);
      setCouponSuccess("SAVE10 applied successfully! 10% discount applied.");
      logEvent('Cart', 'APPLY_COUPON', { code, discount: 0.10 });
    } else {
      setAppliedDiscount(0);
      setCouponError("Invalid coupon code. Try 'FLIPKART50' or 'SAVE10'.");
      logEvent('Cart', 'FAILED_COUPON', { code });
    }
  };

  const handleCheckout = () => {
    logEvent('Cart', 'CHECKOUT', { 
      cartItemsCount: cart.length,
      subtotal,
      grandTotal,
      couponApplied: appliedDiscount > 0
    });
    // Route to AI Dashboard to inspect risk profiles
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 px-6 max-w-lg mx-auto text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-500">
          <ShoppingBag size={28} />
        </div>
        <h3 className="text-xl font-bold text-white">Your Cart is Empty</h3>
        <p className="text-sm text-slate-500">Add products from the store to test the real-time AI cart abandonment risk indicators.</p>
        <Button onClick={() => navigate('/store')}>Browse Store Products</Button>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 text-left">
      {/* 1. Left Panel: Cart items list */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Shopping Cart ({cart.length} items)</h2>
        
        {cart.map(item => {
          const productPrice = item.product.price * (1 - item.product.discount);
          return (
            <Card key={item.product.id} className="flex gap-4 items-center">
              {/* Product Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{item.product.name}</h4>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-500 hover:bg-slate-800/60 active:scale-95 transition-all"
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Seller: {item.product.seller}</div>

                <div className="flex items-center justify-between mt-2.5">
                  {/* Price */}
                  <span className="text-sm font-extrabold text-white">
                    ₹{(productPrice * item.quantity).toLocaleString()}
                  </span>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 border border-slate-800 rounded bg-slate-950 px-1">
                    <button
                      onClick={() => handleQuantityDecrease(item.product.id, item.quantity)}
                      className="p-1 text-slate-500 hover:text-white transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold text-white px-2 select-none">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityIncrease(item.product.id, item.quantity)}
                      className="p-1 text-slate-500 hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2. Right Panel: Order Summary & Coupon Form */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white mb-2">Order Summary</h2>

        {/* Coupon Apply Form */}
        <Card className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={12} />
            <span>Apply Coupon Code</span>
          </label>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g. FLIPKART50"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="uppercase"
            />
            <Button type="submit" variant="secondary">Apply</Button>
          </form>
          {couponError && <span className="text-xs text-rose-500">{couponError}</span>}
          {couponSuccess && <span className="text-xs text-emerald-400">{couponSuccess}</span>}
        </Card>

        {/* Pricing Summary */}
        <Card className="flex flex-col gap-4 text-sm text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Cart Subtotal</span>
            <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between border-b border-slate-800 pb-2 text-emerald-400">
              <span>Coupon Discount</span>
              <span>- ₹{couponDiscountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500 flex items-center gap-1">
              <Truck size={14} />
              <span>Shipping Charges</span>
            </span>
            <span className="font-semibold text-white">
              {shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}
            </span>
          </div>

          <div className="flex justify-between pt-1 text-base font-extrabold text-white">
            <span>Grand Total</span>
            <span className="text-lg bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full py-3 text-base mt-4 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
