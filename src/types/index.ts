// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Product types
export interface Product {
  id: string;
  link: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image?: string;
  name?: string;
}

// Order types
export type OrderStatus =
  | "pending"
  | "approved"
  | "ordered"
  | "shipped"
  | "delivered";

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  OrderSummary: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
  Admin: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Form types
export interface AddProductForm {
  link: string;
  quantity: string;
  price?: string;
  color?: string;
  size?: string;
  image?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
