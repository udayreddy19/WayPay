import type { ApiResponse, WalletData, UserData, TransactionData, CheckoutSession, PageResponse, UpiPaymentResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // In production, get token from Clerk
    // const token = await getToken();
    // if (token) headers['Authorization'] = `Bearer ${token}`;

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async syncUser(clerkId: string, email: string, name: string) {
    return this.request<UserData>(
      `/api/v1/auth/sync?clerkId=${clerkId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`,
      { method: 'POST' }
    );
  }

  // Wallet
  async getWallet() {
    return this.request<WalletData>('/api/v1/wallet');
  }

  async addMoney(amount: number) {
    return this.request<CheckoutSession>('/api/v1/wallet/add-money', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async addMoneyUpi(amount: number, vpa: string) {
    return this.request<UpiPaymentResponse>('/api/v1/wallet/add-money/upi', {
      method: 'POST',
      body: JSON.stringify({ amount, vpa }),
    });
  }

  async transfer(recipientEmailOrPhone: string, amount: number, description?: string) {
    return this.request<string>('/api/v1/wallet/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientEmailOrPhone, amount, description }),
    });
  }

  // Transactions
  async getTransactions(page = 0, size = 20) {
    return this.request<PageResponse<TransactionData>>(
      `/api/v1/transactions?page=${page}&size=${size}`
    );
  }

  // Profile
  async getProfile() {
    return this.request<UserData>('/api/v1/profile');
  }

  async updateProfile(data: Partial<UserData>) {
    return this.request<UserData>('/api/v1/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // KYC
  async submitKyc(data: { aadhaar: string; pan: string; fullName: string; dateOfBirth?: string; address?: string }) {
    return this.request<string>('/api/v1/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKycStatus() {
    return this.request<string>('/api/v1/kyc/status');
  }
}

export const api = new ApiClient(API_URL);
