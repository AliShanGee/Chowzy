import React, { useReducer, createContext, useContext } from "react";

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

const persistCart = (state) => {
  const email = getCurrentUserEmail();
  if (!email) return;
  try {
    localStorage.setItem(`cart_${email}`, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
};

const reducer = (state, action) => {
  let newState = state;
  switch (action.type) {
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