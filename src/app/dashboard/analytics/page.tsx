"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Transaction } from "@/types/finance";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpendingChart from "@/components/dashboard/SpendingChart";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/transactions`), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Transaction);
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Deep dive into your financial data.</p>
      </div>

      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <SpendingChart transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
