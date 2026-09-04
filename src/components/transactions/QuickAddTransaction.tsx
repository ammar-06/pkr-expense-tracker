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
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" data-variant={type === "expense" ? "destructive" : "default"}>
        <PlusCircle className="h-4 w-4" />
        Add {type === "expense" ? "Expense" : "Income"}
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
