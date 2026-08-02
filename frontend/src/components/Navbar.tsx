import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Store as StoreIcon, Sun, Moon, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

const Navbar: React.FC = () => {
  const { cart, theme, toggleTheme } = useStore();
  const location = useLocation();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = (path: string) => {
    const active = location.pathname === path;
    return `flex items-center gap-1.5 px-3.5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
      active 
        ? 'bg-ai-blue/15 text-ai-blue border border-ai-blue/30' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo & Tag */}
      <Link to="/" className="flex items-center gap-2 select-none group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-ai-blue to-ai-purple text-white shadow-md shadow-blue-500/10">
          <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-base leading-none text-white tracking-tight">Flipkart</span>
          <span className="text-[10px] text-ai-blue font-bold tracking-widest uppercase">AI Analytics</span>
        </div>
      </Link>

      {/* Navigation Options */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link to="/store" className={linkClass('/store')}>
          <StoreIcon size={16} />
          <span className="hidden sm:inline">Store</span>
        </Link>
        
        <Link to="/cart" className={linkClass('/cart')}>
          <div className="relative flex items-center gap-1.5">
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-3.5 -right-2 flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-ai-blue to-ai-purple text-white animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
        </Link>

        <Link to="/dashboard" className={linkClass('/dashboard')}>
          <LayoutDashboard size={16} />
          <span className="hidden sm:inline">AI Dashboard</span>
        </Link>

        {/* Theme toggle switch */}
        <button
          onClick={toggleTheme}
          className="ml-2 p-2 rounded-md border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
