"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionType, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, DEFAULT_PAYMENT_METHODS } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addTransaction } from "@/lib/services/transactions";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: TransactionType;
  onSuccess?: () => void;
}

export default function TransactionForm({ type, onSuccess }: TransactionFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const categories = type === "expense" ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      amount: 0,
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      paymentMethod: "Cash",
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await addTransaction(user.uid, {
        type,
        amount: data.amount,
        category: data.category,
        date: data.date,
        description: data.description || "",
        paymentMethod: data.paymentMethod,
      });
      
      toast.success(`${type === 'expense' ? 'Expense' : 'Income'} added successfully`);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh(); // Refresh current route to fetch new data
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₨)</Label>
        <Input 
          id="amount" 
          type="number" 
          step="0.01" 
          {...form.register("amount")} 
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            onValueChange={(val) => form.setValue("category", val as string)}
            defaultValue={form.getValues("category")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            {...form.register("date")} 
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input 
          id="description" 
          placeholder="What was this for?" 
          {...form.register("description")} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select 
          onValueChange={(val) => form.setValue("paymentMethod", val as string)}
          defaultValue={form.getValues("paymentMethod")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_PAYMENT_METHODS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
      </Button>
    </form>
  );
}
