"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  discount: number;
  finalTotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Safe localStorage accessor that never crashes if blocked by Browser Tracking Prevention
function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn("Storage access restricted by browser tracking prevention.");
  }
  return null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("Storage access restricted by browser tracking prevention.");
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load cart on mount safely and sync with DB if logged in
  useEffect(() => {
    const initCart = async () => {
      let localItems: CartItem[] = [];
      const savedCart = getStorageItem('bpm_cart');
      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse saved cart JSON", e);
        }
      }

      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setIsLoggedIn(true);
          // Fetch from DB
          const res = await fetch('/api/cart');
          const data = await res.json();
          
          if (data.items && data.items.length > 0) {
            // DB has priority
            setItems(data.items);
          } else if (localItems.length > 0) {
            // DB is empty but we have local items, so sync local to DB
            setItems(localItems);
            fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: localItems })
            }).catch(console.error);
          } else {
            setItems([]);
          }
        } else {
          setItems(localItems);
        }
      } catch (e) {
        console.error("Failed to init auth/cart", e);
        setItems(localItems);
      }

      setIsInitialized(true);
    };

    initCart();
  }, []);

  // Save cart on changes safely
  useEffect(() => {
    if (isInitialized) {
      // Always save to local storage as fallback/cache
      setStorageItem('bpm_cart', JSON.stringify(items));
      
      // If logged in, sync to server API
      if (isLoggedIn) {
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        }).catch(e => console.error("Failed to sync cart to server", e));
      }
    }
  }, [items, isInitialized, isLoggedIn]);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    // Check if user is logged in (localStorage or Supabase session)
    const storedUser = getStorageItem("user");
    const storedAddress = getStorageItem("user_saved_address");
    
    if (!storedUser && !isLoggedIn && !storedAddress) {
      setShowAuthModal(true);
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Set shipping to 0 for now. You can add complex logic (weight-based or API) later.
  const shippingCost = 0; 
  const discount = totalPrice > 500000 ? 100000 : 0;
  const finalTotal = items.length > 0 ? Math.max(0, totalPrice + shippingCost - discount) : 0;

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{
      items,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      openCart,
      closeCart,
      totalItems,
      totalPrice,
      shippingCost,
      discount,
      finalTotal,
      clearCart
    }}>
      {children}

      {/* Animated Auth Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl border border-red-100 text-center relative overflow-hidden transform animate-scaleUp">
            {/* Header Accent Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-100/50 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Lock Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#51000d] to-[#7a0019] text-white rounded-3xl flex items-center justify-center shadow-xl mb-6 scale-110">
              <span className="material-symbols-outlined text-4xl">lock_person</span>
            </div>

            <h3 className="text-2xl font-black text-[#51000d] mb-2 tracking-tight">
              Akses Terbatas
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mb-8 leading-relaxed font-medium">
              Silakan <span className="font-extrabold text-[#51000d]">Masuk (Login)</span> terlebih dahulu untuk menambahkan produk Bakso Pak Mul ke keranjang dan melanjutkan transaksi.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="w-full py-4 bg-gradient-to-r from-[#51000d] to-[#7a0019] text-white rounded-2xl font-extrabold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Masuk Sekarang</span>
                <span className="material-symbols-outlined text-base">login</span>
              </a>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
