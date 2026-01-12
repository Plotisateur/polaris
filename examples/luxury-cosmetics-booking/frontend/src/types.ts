export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface Booking {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  appointmentDate: string;
  userEmail: string;
  userName: string;
  status: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}
