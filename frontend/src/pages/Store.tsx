import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SearchBar, ProductCard, SidebarContainer } from '../components/DesignSystem';

const Store: React.FC = () => {
  const { products, wishlist, toggleWishlist, addToCart, logEvent } = useStore();
  const navigate = useNavigate();

  // Search, Filter, Sort local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [assuredOnly, setAssuredOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Log page view event on mount
  useEffect(() => {
    logEvent('Store', 'VIEW_STORE');
  }, [logEvent]);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.brand.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Flipkart Assured Filter
    if (assuredOnly) {
      result = result.filter(p => p.isFlipkartAssured);
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price * (1 - a.discount)) - (b.price * (1 - b.discount)));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price * (1 - b.discount)) - (a.price * (1 - a.discount)));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount-desc') {
      result.sort((a, b) => b.discount - a.discount);
    }

    return result;
  }, [products, searchQuery, selectedCategory, assuredOnly, sortBy]);

  // Event handlers with integrated logger triggers
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      logEvent('Store', 'SEARCH', { query: val });
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    logEvent('Store', 'FILTER', { type: 'category', value: category });
  };

  const handleAssuredToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAssuredOnly(checked);
    logEvent('Store', 'FILTER', { type: 'assured_only', value: checked });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    logEvent('Store', 'SORT', { type: 'sort_by', value: val });
  };

  const handleAddCart = (product: any) => {
    addToCart(product);
    logEvent('Store', 'ADD_TO_CART', { productId: product.id, price: product.price });
  };

  const handleWishlistToggle = (productId: string) => {
    toggleWishlist(productId);
    const active = wishlist.includes(productId);
    logEvent('Store', 'WISHLIST', { productId, action: active ? 'remove' : 'add' });
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* 1. Sidebar Filters */}
      <SidebarContainer title="Filters">
        {/* Category Filter list */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
          <div className="flex flex-col gap-1.5 mt-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-ai-blue/15 text-ai-blue border border-ai-blue/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flipkart Assured Checkbox */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
          <input
            type="checkbox"
            id="assured"
            checked={assuredOnly}
            onChange={handleAssuredToggle}
            className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-ai-blue focus:ring-ai-blue/30 focus:ring-1 focus:ring-offset-0 focus:outline-none"
          />
          <label htmlFor="assured" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
            Flipkart Assured Only
          </label>
        </div>
      </SidebarContainer>

      {/* 2. Products Grid Panel */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header tools (Search and Sort) */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="w-full md:max-w-md">
            <SearchBar onSearch={handleSearch} value={searchQuery} />
          </div>
          
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Sort By</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-ai-blue focus:ring-1 focus:ring-ai-blue/30 transition-all cursor-pointer w-full md:w-44"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
              <option value="discount-desc">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Catalog list */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddCart={handleAddCart}
                onToggleWish={handleWishlistToggle}
                isWished={wishlist.includes(product.id)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-xl border border-slate-800">
            <span className="text-sm font-semibold text-slate-500">No matching products found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
