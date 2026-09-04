"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Transaction } from "@/types/finance";
import { formatPKR } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTransaction } from "@/lib/services/transactions";
import { toast } from "sonner";
import QuickAddTransaction from "@/components/transactions/QuickAddTransaction";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await deleteTransaction(user.uid, id);
      toast.success("Transaction deleted");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Transactions</h2>
          <p className="text-muted-foreground">Manage your income and expenses.</p>
        </div>
        <div className="flex gap-2">
          <QuickAddTransaction type="income" />
          <QuickAddTransaction type="expense" />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(parseISO(t.date), "dd MMM, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {t.description || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                      {t.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      t.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-bold whitespace-nowrap ${
                    t.type === "income" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {t.type === "income" ? "+" : "-"}{formatPKR(t.amount)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-600"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
