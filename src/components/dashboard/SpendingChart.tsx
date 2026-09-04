"use client";

import { Transaction } from "@/types/finance";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export default function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Not enough data to display chart
      </div>
    );
  }

  // Generate data for current month (last 30 days or current month)
  // For simplicity, let's group by category for expense
  const expenses = transactions.filter(t => t.type === "expense");
  
  const categoryData: Record<string, number> = {};
  expenses.forEach(expense => {
    categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
  });

  const chartData = Object.keys(categoryData).map(category => ({
    name: category,
    amount: categoryData[category]
  })).sort((a, b) => b.amount - a.amount).slice(0, 7); // top 7 categories

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `₨${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            formatter={(value: number) => [`₨ ${value.toLocaleString()}`, 'Amount']}
          />
          <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
