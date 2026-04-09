import React, { useReducer, createContext, useContext } from "react";
import API_BASE_URL from "../config";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Helpers to keep a separate cart for each logged-in user
const getCurrentUserEmail = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const userObj = JSON.parse(userStr);
    return userObj?.email || null;
  } catch {
    return null;
  }
};

const loadInitialCart = () => {
  const email = getCurrentUserEmail();
  if (!email) return [];
  try {
    const stored = localStorage.getItem(`cart_${email}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const persistCart = async (state) => {
  const email = getCurrentUserEmail();
  if (!email) return;
  try {
    localStorage.setItem(`cart_${email}`, JSON.stringify(state));
    // Persist to backend as well
    await fetch(`${API_BASE_URL}/api/updatecart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, cartData: state }),
    });
  } catch (err) {
    console.error("Failed to persist cart to backend", err);
  }
};

const reducer = (state, action) => {
  let newState = state;
  switch (action.type) {
    case "SET_CART":
      newState = action.cart;
      return newState; // Return directly, don't persist SET_CART as it's from backend
    case "ADD":
      newState = [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];
      break;
    case "REMOVE": {
      let newArr = [...state];
      newArr.splice(action.index, 1);
      newState = newArr;
      break;
    }
    case "DROP":
      newState = [];
      break;
    case "LOGOUT":
      return []; // Return directly, don't persist empty cart on logout
    default:
      console.log("Error in Reducer");
      newState = state;
  }
  persistCart(newState);
  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [], loadInitialCart);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);