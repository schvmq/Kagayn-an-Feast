export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'appetizer' | 'dessert' | 'drink';
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Reservation {
  name: string;
  date: string;
  time: string;
  pax: number;
  confirmed: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isToolResponse?: boolean;
}

export enum AppView {
  CHAT = 'CHAT',
  MENU = 'MENU',
  RESERVATION = 'RESERVATION',
  BILL = 'BILL',
}

export interface OrderDetails {
  items: CartItem[];
  total: number;
  deliveryAddress?: string;
  type: 'dine-in' | 'delivery' | 'pickup';
}
