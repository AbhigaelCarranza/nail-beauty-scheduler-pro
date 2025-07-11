import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  is_active: boolean;
}

export interface CartItem {
  service: Service;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  getItemCount: () => number;
  isInCart: (serviceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bella-nails-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (service: Service) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);
      
      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { service, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === serviceId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Si tiene más de 1, decrementar cantidad
        return prevItems.map(item =>
          item.service.id === serviceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Si tiene 1 o menos, remover completamente
        return prevItems.filter(item => item.service.id !== serviceId);
      }
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.service.price * item.quantity), 0);
  };

  const getTotalDuration = () => {
    return items.reduce((total, item) => total + (item.service.duration_minutes * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (serviceId: string) => {
    return items.some(item => item.service.id === serviceId);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalDuration,
      getItemCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};