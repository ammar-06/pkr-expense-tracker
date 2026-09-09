"use client";

import { Transaction } from "@/types/finance";
import { formatPKR } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map((t) => (
        <div key={t.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{t.description || t.category}</span>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(t.date), "dd MMM")} • {t.category}
            </span>
          </div>
          <div className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
            {t.type === "income" ? "+" : "-"}{formatPKR(t.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
