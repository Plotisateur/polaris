import axios from 'axios';

import type { Product, Booking, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>('/api/products');
    return data.data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return data.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>(`/api/products/category/${category}`);
    return data.data;
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await api.get<ApiResponse<Booking[]>>('/api/bookings');
    return data.data;
  },

  create: async (booking: {
    productId: number;
    productName: string;
    quantity: number;
    appointmentDate: string;
  }): Promise<Booking> => {
    const { data } = await api.post<ApiResponse<Booking>>('/api/bookings', booking);
    return data.data;
  },

  cancel: async (id: number): Promise<void> => {
    await api.delete(`/api/bookings/${id}`);
  },
};
