import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Bouteille, Zone } from "@/types";

interface CartContextType {
  items: CartItem[];
  selectedZone: Zone | null;
  deliveryAddress: string;
  deliveryCoordinates: { latitude: number; longitude: number } | null;
  addItem: (bouteille: Bouteille, quantite?: number) => void;
  removeItem: (bouteilleId: number) => void;
  updateQuantity: (bouteilleId: number, quantite: number) => void;
  clearCart: () => void;
  setDeliveryZone: (zone: Zone) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "@gazexpress_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addItem = (bouteille: Bouteille, quantite = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.bouteille.id === bouteille.id);
      if (existing) {
        return current.map((item) =>
          item.bouteille.id === bouteille.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...current, { bouteille, quantite }];
    });
  };

  const removeItem = (bouteilleId: number) => {
    setItems((current) => current.filter((item) => item.bouteille.id !== bouteilleId));
  };

  const updateQuantity = (bouteilleId: number, quantite: number) => {
    if (quantite <= 0) {
      removeItem(bouteilleId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.bouteille.id === bouteilleId ? { ...item, quantite } : item
      )
    );
  };

  const clearCart = async () => {
    setItems([]);
    setSelectedZone(null);
    setDeliveryAddress("");
    setDeliveryCoordinates(null);
    await AsyncStorage.removeItem(CART_KEY);
  };

  const setDeliveryZone = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.bouteille.prix * item.quantite, 0);
  };

  const getDeliveryFee = () => {
    return selectedZone?.frais_livraison || 0;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedZone,
        deliveryAddress,
        deliveryCoordinates,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setDeliveryZone,
        setDeliveryAddress,
        setDeliveryCoordinates,
        getSubtotal,
        getDeliveryFee,
        getTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
