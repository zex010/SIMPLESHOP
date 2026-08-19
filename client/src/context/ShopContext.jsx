import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const ShopContext = createContext();

const CART_STORAGE_KEY = "avernus_cart";
const WISHLIST_STORAGE_KEY = "avernus_wishlist";

const API_URL =
  "https://avernus-api.onrender.com/api";

/* ============================================================
   SIZE OPTIONS
============================================================ */

const SIZE_MULTIPLIERS = {
  "30ML": 0.5,
  "50ML": 0.72,
  "100ML": 1,
};

/* ============================================================
   AUTH CONFIG
============================================================ */

const getAuthConfig = () => {
  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

/* ============================================================
   LOCAL STORAGE
============================================================ */

function loadStorage(key) {
  try {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(
      `Error loading ${key}:`,
      error
    );

    return [];
  }
}

/* ============================================================
   NORMALIZE CART ITEM
   Old cart items without selectedSize become 50ML.
============================================================ */

function normalizeCartItem(item) {
  const selectedSize =
    item.selectedSize || "50ML";

  return {
    ...item,
    selectedSize,
    qty: Math.max(
      1,
      Number(item.qty || 1)
    ),
  };
}

/* ============================================================
   GET BASE PRICE
   ProductDetails normally stores the price for the selected
   size. This converts it back to the 100ML/base price.
============================================================ */

function getBasePrice(
  price,
  selectedSize
) {
  const currentMultiplier =
    SIZE_MULTIPLIERS[selectedSize] ||
    SIZE_MULTIPLIERS["50ML"];

  const numericPrice =
    Number(price || 0);

  if (!numericPrice) {
    return 0;
  }

  return (
    numericPrice /
    currentMultiplier
  );
}

/* ============================================================
   GET SIZE PRICE
============================================================ */

function getSizePrice(
  basePrice,
  size
) {
  const multiplier =
    SIZE_MULTIPLIERS[size] ||
    SIZE_MULTIPLIERS["50ML"];

  return Math.round(
    basePrice * multiplier * 100
  ) / 100;
}

/* ============================================================
   SHOP PROVIDER
============================================================ */

export function ShopProvider({
  children,
}) {
  /* ==========================================================
     CART
  ========================================================== */

  const [cart, setCart] = useState(() => {
    const storedCart =
      loadStorage(
        CART_STORAGE_KEY
      );

    return storedCart.map(
      normalizeCartItem
    );
  });

  /* ==========================================================
     WISHLIST
  ========================================================== */

  const [wishlist, setWishlist] =
    useState(() =>
      loadStorage(
        WISHLIST_STORAGE_KEY
      )
    );

  /* ==========================================================
     ORDERS
  ========================================================== */

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  /* ==========================================================
     SAVE CART
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Error saving cart:",
        error
      );
    }
  }, [cart]);

  /* ==========================================================
     SAVE WISHLIST
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Error saving wishlist:",
        error
      );
    }
  }, [wishlist]);

  /* ============================================================
     ADD TO CART

     IMPORTANT:
     If product doesn't have selectedSize,
     50ML is automatically used.
  ============================================================ */

  const addToCart = (product) => {
    const selectedSize =
      product.selectedSize ||
      "50ML";

    const normalizedProduct = {
      ...product,

      selectedSize,

      qty: Math.max(
        1,
        Number(product.qty || 1)
      ),
    };

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item._id ===
            normalizedProduct._id &&
          (item.selectedSize ||
            "50ML") === selectedSize
      );

      /* ========================================================
         PRODUCT + SAME SIZE ALREADY EXISTS
      ======================================================== */

      if (existing) {
        return prev.map((item) => {
          if (
            item._id ===
              normalizedProduct._id &&
            (item.selectedSize ||
              "50ML") === selectedSize
          ) {
            return {
              ...item,

              selectedSize,

              qty:
                Number(item.qty || 0) +
                Number(
                  normalizedProduct.qty ||
                    1
                ),
            };
          }

          return item;
        });
      }

      /* ========================================================
         NEW PRODUCT
      ======================================================== */

      return [
        ...prev,
        normalizedProduct,
      ];
    });
  };

  /* ============================================================
     REMOVE FROM CART
  ============================================================ */

  const removeFromCart = (
    id,
    size = "50ML"
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === id &&
            (item.selectedSize ||
              "50ML") === size
          )
      )
    );
  };

  /* ============================================================
     UPDATE QUANTITY
  ============================================================ */

  const updateQuantity = (
    id,
    size = "50ML",
    amount
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        const itemSize =
          item.selectedSize ||
          "50ML";

        if (
          item._id === id &&
          itemSize === size
        ) {
          return {
            ...item,

            selectedSize: itemSize,

            qty: Math.max(
              1,
              Number(item.qty || 1) +
                Number(amount || 0)
            ),
          };
        }

        return item;
      })
    );
  };

  /* ============================================================
     UPDATE CART SIZE

     Allows:
     30ML
     50ML
     100ML

     Price automatically changes.
  ============================================================ */

  const updateCartSize = (
    id,
    oldSize = "50ML",
    newSize = "50ML"
  ) => {
    if (!newSize) {
      newSize = "50ML";
    }

    if (
      !SIZE_MULTIPLIERS[newSize]
    ) {
      return;
    }

    setCart((prev) => {
      /* ========================================================
         FIND CURRENT ITEM
      ======================================================== */

      const currentItem =
        prev.find(
          (item) =>
            item._id === id &&
            (item.selectedSize ||
              "50ML") === oldSize
        );

      if (!currentItem) {
        return prev;
      }

      /* ========================================================
         SAME SIZE
      ======================================================== */

      if (oldSize === newSize) {
        return prev;
      }

      /* ========================================================
         CHECK IF SAME PRODUCT + NEW SIZE
         ALREADY EXISTS
      ======================================================== */

      const existingNewSize =
        prev.find(
          (item) =>
            item._id === id &&
            (item.selectedSize ||
              "50ML") === newSize
        );

      /* ========================================================
         IF NEW SIZE ALREADY EXISTS
         MERGE QUANTITY
      ======================================================== */

      if (existingNewSize) {
        return prev
          .filter(
            (item) =>
              !(
                item._id === id &&
                (item.selectedSize ||
                  "50ML") ===
                  oldSize
              )
          )
          .map((item) => {
            if (
              item._id === id &&
              (item.selectedSize ||
                "50ML") === newSize
            ) {
              return {
                ...item,

                selectedSize:
                  newSize,

                qty:
                  Number(
                    item.qty || 0
                  ) +
                  Number(
                    currentItem.qty ||
                      0
                  ),
              };
            }

            return item;
          });
      }

      /* ========================================================
         CALCULATE BASE PRICE

         Example:

         100ML = $220
         50ML  = $158.40
         30ML  = $110
      ======================================================== */

      const basePrice =
        getBasePrice(
          currentItem.price,
          oldSize
        );

      const newPrice =
        getSizePrice(
          basePrice,
          newSize
        );

      /* ========================================================
         UPDATE SIZE + PRICE
      ======================================================== */

      return prev.map((item) => {
        if (
          item._id === id &&
          (item.selectedSize ||
            "50ML") === oldSize
        ) {
          return {
            ...item,

            selectedSize:
              newSize,

            price: newPrice,
          };
        }

        return item;
      });
    });
  };

  /* ============================================================
     WISHLIST
  ============================================================ */

  const addToWishlist = (
    product
  ) => {
    setWishlist((prev) => {
      if (
        prev.some(
          (item) =>
            item._id === product._id
        )
      ) {
        return prev;
      }

      return [
        ...prev,
        product,
      ];
    });
  };

  /* ============================================================
     REMOVE FROM WISHLIST
  ============================================================ */

  const removeFromWishlist = (
    id
  ) => {
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          item._id !== id
      )
    );
  };

  /* ============================================================
     GET MY ORDERS
  ============================================================ */

  const getMyOrders = async () => {
    const config =
      getAuthConfig();

    if (!config.headers) {
      setOrders([]);

      return;
    }

    setOrdersLoading(true);

    try {
      const response =
        await axios.get(
          `${API_URL}/orders/my`,
          config
        );

      if (
        response.data.success
      ) {
        setOrders(
          response.data.orders ||
            []
        );
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  /* ============================================================
     PLACE ORDER
  ============================================================ */

  const placeOrder = async (
    orderData
  ) => {
    const config =
      getAuthConfig();

    if (!config.headers) {
      throw new Error(
        "User not authenticated"
      );
    }

    try {
      const response =
        await axios.post(
          `${API_URL}/orders`,
          orderData,
          config
        );

      if (
        response.data.success
      ) {
        /* ================================================
           CLEAR CART AFTER SUCCESSFUL ORDER
        ================================================= */

        setCart([]);

        /* ================================================
           REFRESH ORDERS
        ================================================= */

        await getMyOrders();

        return response.data;
      }

      throw new Error(
        response.data.message ||
          "Failed to place order"
      );
    } catch (error) {
      console.error(
        "Error placing order:",
        error
      );

      throw error;
    }
  };

  /* ============================================================
     CANCEL ORDER
  ============================================================ */

  const cancelOrder = async (
    orderId
  ) => {
    const config =
      getAuthConfig();

    if (!config.headers) {
      throw new Error(
        "User not authenticated"
      );
    }

    try {
      const response =
        await axios.patch(
          `${API_URL}/orders/${orderId}/cancel`,
          {},
          config
        );

      return response.data;
    } catch (error) {
      console.error(
        "Error cancelling order:",
        error
      );

      throw error;
    }
  };

  /* ============================================================
     CART COUNT
  ============================================================ */

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.qty || 0),
      0
    );

  /* ============================================================
     WISHLIST COUNT
  ============================================================ */

  const wishlistCount =
    wishlist.length;

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <ShopContext.Provider
      value={{
        /* CART */
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartSize,

        /* WISHLIST */
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,

        /* ORDERS */
        orders,
        ordersLoading,
        getMyOrders,
        placeOrder,
        cancelOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

/* ============================================================
   USE SHOP
============================================================ */

export function useShop() {
  return useContext(
    ShopContext
  );
}