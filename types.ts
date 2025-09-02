export type Page = 'Dashboard' | 'Créditos' | 'Contado' | 'Inventarios' | 'Facturación';

export type CreditTab = 'Facturación' | 'Pagos' | 'Notas de crédito';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  dateAdded: string;
}

export type InvoiceStatus = 'Pendiente' | 'Cancelada' | 'Vencida';

export interface Invoice {
  id: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

export interface CreditNote {
  id: string;
  invoiceId: string;
  clientName: string;
  date: string;
  amount: number;
  reason: string;
}

export interface NewCreditNote {
    invoiceId: string;
    amount: number;
    reason: string;
}

export interface Payment {
    id: string;
    invoiceId: string;
    date: string;
    amount: number;
    paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
}


export interface CashSale {
  id: string;
  date: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
}