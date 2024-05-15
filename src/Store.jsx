import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
  },
  returns: {
    returnItems: localStorage.getItem('returnItems')
      ? JSON.parse(localStorage.getItem('returnItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'RETURNS_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.returns.returnItems.find(
        (item) => item._id === newItem._id
      );
      const returnItems = existItem
        ? state.returns.returnItems.map((item) =>
            item._id === existItem._id
              ? { ...item, quantity: newItem.quantity }
              : item
          )
        : [...state.returns.returnItems, newItem];
      localStorage.setItem('returnItems', JSON.stringify(returnItems));
      return { ...state, returns: { returnItems } };
    }

    case 'RETURNS_REMOVE_ITEM': {
      const returnItems = state.returns.returnItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('returnItems', JSON.stringify(returnItems));
      return { ...state, returns: { ...state.returns, returnItems } };
    }

    case 'RETURNS_CLEAR':
      return { ...state, returns: { ...state.returns, returnItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          // shippingAddress: {},
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case 'SAVE_PURCHASE_ORDER':
      return {
        ...state,
        cart: {
          ...state.cart,
          purchaseOrder: action.payload,
        },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
