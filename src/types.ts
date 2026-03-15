export type UserRole = 'consumer' | 'delivery' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
export type OrderType = 'delivery' | 'pickup' | 'dine-in';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  orderType: OrderType;
  tableNumber?: string;
  address?: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid';
  deliveryPartnerId?: string;
  createdAt: string;
}

export interface Table {
  id: string;
  number: string;
  qrCode: string;
}
