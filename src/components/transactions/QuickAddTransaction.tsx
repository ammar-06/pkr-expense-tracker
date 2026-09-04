"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { TransactionType } from "@/types/finance";
import { PlusCircle } from "lucide-react";

interface QuickAddTransactionProps {
  type: TransactionType;
}

export default function QuickAddTransaction({ type }: QuickAddTransactionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={type === "expense" ? "destructive" : "default"} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add {type === "expense" ? "Expense" : "Income"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {type === "expense" ? "Expense" : "Income"}</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          type={type} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
