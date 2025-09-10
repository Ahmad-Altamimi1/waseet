import { User, Product, Order, OrderStatus } from "../types";

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: "1",
    email: "sophia@example.com",
    name: "Sophia Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b2e0d1b3?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    email: "admin@aura.com",
    name: "Aura Admin",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

// Dummy Products
export const dummyProducts: Product[] = [
  {
    id: "1",
    link: "https://shein.com/summer-floral-dress",
    price: 29.99,
    quantity: 2,
    color: "Blush Pink",
    size: "M",
    name: "Summer Floral Dress",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
  },
  {
    id: "2",
    link: "https://shein.com/lavender-cardigan",
    price: 24.5,
    quantity: 1,
    color: "Lavender",
    size: "S",
    name: "Soft Knit Cardigan",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    link: "https://shein.com/gold-accessories-set",
    price: 15.99,
    quantity: 1,
    color: "Gold",
    size: "One Size",
    name: "Delicate Jewelry Set",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop",
  },
  {
    id: "4",
    link: "https://shein.com/pastel-handbag",
    price: 35.0,
    quantity: 1,
    color: "Beige",
    size: "Medium",
    name: "Pastel Mini Handbag",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
  },
];

// Dummy Orders
export const dummyOrders: Order[] = [
  {
    id: "1",
    userId: "1",
    products: [dummyProducts[0], dummyProducts[1]],
    status: "shipped",
    totalAmount: 54.49,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-08"),
  },
  {
    id: "2",
    userId: "1",
    products: [dummyProducts[2], dummyProducts[3]],
    status: "approved",
    totalAmount: 50.99,
    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-08"),
  },
  {
    id: "3",
    userId: "1",
    products: [dummyProducts[0]],
    status: "pending",
    totalAmount: 29.99,
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-08"),
  },
];

// Order status progression
export const orderStatusFlow: { [key in OrderStatus]: OrderStatus | null } = {
  pending: "approved",
  approved: "ordered",
  ordered: "shipped",
  shipped: "delivered",
  delivered: null,
};

// Status display information
export const orderStatusInfo = {
  pending: {
    label: "Pending Review",
    description: "Your order is being reviewed",
    color: "#F59E0B",
    icon: "time-outline",
  },
  approved: {
    label: "Approved",
    description: "Order approved, preparing to place",
    color: "#10B981",
    icon: "checkmark-circle-outline",
  },
  ordered: {
    label: "Ordered",
    description: "Order placed with supplier",
    color: "#3B82F6",
    icon: "bag-outline",
  },
  shipped: {
    label: "Shipped",
    description: "Package is on its way",
    color: "#8B5CF6",
    icon: "airplane-outline",
  },
  delivered: {
    label: "Delivered",
    description: "Package has been delivered",
    color: "#10B981",
    icon: "home-outline",
  },
} as const;

// Helper functions
export const getOrderById = (orderId: string): Order | undefined => {
  return dummyOrders.find((order) => order.id === orderId);
};

export const getUserOrders = (userId: string): Order[] => {
  return dummyOrders.filter((order) => order.userId === userId);
};

export const updateOrderStatus = (
  orderId: string,
  newStatus: OrderStatus
): Order | null => {
  const orderIndex = dummyOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return null;

  dummyOrders[orderIndex] = {
    ...dummyOrders[orderIndex],
    status: newStatus,
    updatedAt: new Date(),
  };

  return dummyOrders[orderIndex];
};

export const createOrder = (userId: string, products: Product[]): Order => {
  const totalAmount = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const newOrder: Order = {
    id: Date.now().toString(),
    userId,
    products,
    status: "pending",
    totalAmount,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dummyOrders.push(newOrder);
  return newOrder;
};
