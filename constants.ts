import { Product, Invoice, CreditNote } from './types';

// Dummy data has been removed as the app is now structured to fetch from a backend API.
// The data below is kept for chart demonstration purposes but would also typically be fetched.

export const salesData = [
  { name: 'Lun', Ventas: 4000 },
  { name: 'Mar', Ventas: 3000 },
  { name: 'Mié', Ventas: 2000 },
  { name: 'Jue', Ventas: 2780 },
  { name: 'Vie', Ventas: 1890 },
  { name: 'Sáb', Ventas: 2390 },
  { name: 'Dom', Ventas: 3490 },
];

export const profitData = [
  { name: 'Ene', Ganancia: 12000 },
  { name: 'Feb', Ganancia: 15000 },
  { name: 'Mar', Ganancia: 11000 },
  { name: 'Abr', Ganancia: 18000 },
  { name: 'May', Ganancia: 17000 },
  { name: 'Jun', Ganancia: 21000 },
];

export const topProductsData = [
  { name: 'Leche', value: 400 },
  { name: 'Pan', value: 300 },
  { name: 'Huevos', value: 250 },
  { name: 'Manzanas', value: 200 },
  { name: 'Pollo', value: 150 },
];