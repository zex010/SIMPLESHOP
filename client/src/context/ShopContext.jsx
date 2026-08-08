import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ShopContext = createContext();

const CART_STORAGE_KEY = "avernus_cart";
const WISHLIST_STORAGE_KEY = "avernus_wishlist";
const API_URL = "http://192.168.10.6:5000/api"; // Adjust based on backend port

// Helper to get auth config
const getAuthConfig = () => {
  // SignIn.jsx stores the JWT as "auth_token" — in localStorage when
  // "Remember Me" is checked, otherwise in sessionStorage for the session only.
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

function loadStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => loadStorage(CART_STORAGE_KEY));
  const [wishlist, setWishlist] = useState(() => loadStorage(WISHLIST_STORAGE_KEY));
  // Removed local storage orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // SAVE CART
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // SAVE WISHLIST
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // ============================
  // ORDER ACTIONS (MongoDB API)
  // ============================

  // Fetch logged-in user's orders
  const getMyOrders = async () => {
    const config = getAuthConfig();
    if (!config.headers) return; // Not logged in

    setOrdersLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/my`, config);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Place new order
  const placeOrder = async (orderData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("User not authenticated");

    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, config);
      if (response.data.success) {
        setCart([]); // Clear cart locally on success
        await getMyOrders(); // Refresh orders list
        return response.data;
      }
    } catch (error) {
      console.error("Error placing order:", error);
      throw error; // Propagate error to Checkout component
    }
  };

  // Cancel one of the logged-in user's own orders (Pending/Confirmed only —
  // enforced server-side in cancelMyOrder).
  const cancelOrder = async (orderId) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("User not authenticated");

    try {
      const response = await axios.patch(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error; // Propagate so the caller (MyOrders) can show the message
    }
  };

  // ADD CART
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id && item.selectedSize === product.selectedSize
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.selectedSize === product.selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // REMOVE CART
  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter((item) => !(item._id === id && item.selectedSize === size))
    );
  };

  // UPDATE QUANTITY
  const updateQuantity = (id, size, amount) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id && item.selectedSize === size) {
          return {
            ...item,
            qty: Math.max(1, item.qty + amount),
          };
        }
        return item;
      })
    );
  };

  // WISHLIST
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        ordersLoading,
        cartCount: cart.length,
        wishlistCount: wishlist.length,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        getMyOrders, // Export API function
        placeOrder, // Export API function
        cancelOrder, // Export API function
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}