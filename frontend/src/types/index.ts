export interface WalletData {
  id: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  kycStatus: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TransactionData {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  amount: number;
  currency: string;
  type: 'ADD_MONEY' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REFUND' | 'WITHDRAWAL' | 'ADJUSTMENT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentMethod?: string;
  description?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CheckoutSession {
  sessionId: string;
  sessionUrl: string;
}

export interface UpiPaymentResponse {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  qrCodeUrl?: string;
  qrCodePng?: string;
  hostedInstructionsUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
