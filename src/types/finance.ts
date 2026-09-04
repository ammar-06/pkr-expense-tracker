export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  receiptUrl?: string; // Optional URL for Firebase Storage
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  id: string;
  userId: string;
  category: string; // "all" for monthly total budget, or specific category
  limit: number;
  period: "monthly" | "weekly" | "yearly";
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
  isCustom: boolean;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Food",
  "Groceries",
  "Transport",
  "Petrol/Fuel",
  "Shopping",
  "Bills",
  "Rent",
  "Education",
  "University",
  "Health",
  "Entertainment",
  "Travel",
  "Subscriptions",
  "Family",
  "Other"
];

export const DEFAULT_INCOME_CATEGORIES = [
  "Salary",
  "Freelancing",
  "Business",
  "Investment",
  "Allowance",
  "Gift",
  "Other"
];

export const DEFAULT_PAYMENT_METHODS = [
  "Cash",
  "Bank",
  "Debit Card",
  "Credit Card",
  "Easypaisa",
  "JazzCash",
  "Other"
];
