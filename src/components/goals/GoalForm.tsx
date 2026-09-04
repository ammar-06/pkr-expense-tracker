"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addGoal } from "@/lib/services/goals";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.coerce.number().positive("Target must be positive"),
  currentAmount: z.coerce.number().min(0, "Current amount cannot be negative").default(0),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  onSuccess?: () => void;
}

export default function GoalForm({ onSuccess }: GoalFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
    },
  });

  const onSubmit = async (data: GoalFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await addGoal(user.uid, {
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
      });
      
      toast.success("Savings goal created!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name</Label>
        <Input 
          id="name" 
          placeholder="e.g., New Laptop, Vacation"
          {...form.register("name")} 
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount (₨)</Label>
        <Input 
          id="targetAmount" 
          type="number" 
          step="0.01" 
          {...form.register("targetAmount")} 
        />
        {form.formState.errors.targetAmount && (
          <p className="text-sm text-red-500">{form.formState.errors.targetAmount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentAmount">Already Saved? (₨)</Label>
        <Input 
          id="currentAmount" 
          type="number" 
          step="0.01" 
          {...form.register("currentAmount")} 
        />
        {form.formState.errors.currentAmount && (
          <p className="text-sm text-red-500">{form.formState.errors.currentAmount.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Create Goal"}
      </Button>
    </form>
  );
}
