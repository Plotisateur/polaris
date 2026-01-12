export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'Parfum' | 'Soin' | 'Maquillage';
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
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  email: string;
  name?: string;
  sub: string;
}
