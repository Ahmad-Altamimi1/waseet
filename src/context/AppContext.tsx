import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { User, Product, Order } from "../types";
import {
  dummyUsers,
  createOrder,
  updateOrderStatus as updateOrderStatusInData,
} from "../services/dummyData";

// State interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentOrder: Product[];
  isLoading: boolean;
  isAdmin: boolean;
}

// Action types
type AppAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "REMOVE_PRODUCT"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ADMIN"; payload: boolean };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentOrder: [],
  isLoading: false,
  isAdmin: false,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.email === "admin@aura.com",
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        currentOrder: [],
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        currentOrder: [...state.currentOrder, action.payload],
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        currentOrder: state.currentOrder.filter(
          (product) => product.id !== action.payload
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        currentOrder: [],
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ADMIN":
      return {
        ...state,
        isAdmin: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    addProduct: (product: Omit<Product, "id">) => void;
    removeProduct: (productId: string) => void;
    clearCart: () => void;
    confirmOrder: () => Promise<Order | null>;
    updateOrderStatus: (orderId: string, newStatus: any) => Order | null;
  };
} | null>(null);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    login: async (email: string, password: string): Promise<boolean> => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = dummyUsers.find((u) => u.email === email);
      if (user && password) {
        // Simple validation for demo
        dispatch({ type: "LOGIN", payload: user });
        dispatch({ type: "SET_LOADING", payload: false });
        return true;
      }

      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    },

    logout: () => {
      dispatch({ type: "LOGOUT" });
    },

    addProduct: (productData: Omit<Product, "id">) => {
      const product: Product = {
        ...productData,
        id: Date.now().toString(),
      };
      dispatch({ type: "ADD_PRODUCT", payload: product });
    },

    removeProduct: (productId: string) => {
      dispatch({ type: "REMOVE_PRODUCT", payload: productId });
    },

    clearCart: () => {
      dispatch({ type: "CLEAR_CART" });
    },

    confirmOrder: async (): Promise<Order | null> => {
      if (!state.user || state.currentOrder.length === 0) return null;

      dispatch({ type: "SET_LOADING", payload: true });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const order = createOrder(state.user.id, state.currentOrder);
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "SET_LOADING", payload: false });

      return order;
    },

    updateOrderStatus: (orderId: string, newStatus: any) => {
      return updateOrderStatusInData(orderId, newStatus);
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
