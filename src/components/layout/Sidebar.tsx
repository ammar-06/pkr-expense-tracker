"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  ArrowRightLeft, 
  PieChart, 
  Target,
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/income", label: "Income", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowRightLeft },
  { href: "/dashboard/analytics", label: "Analytics", icon: PieChart },
  { href: "/dashboard/goals", label: "Savings Goals", icon: Target },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-6 py-2 mb-6">
        <h1 className="text-2xl font-bold text-primary">PKR Tracker</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
              )}
            >
              <Icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
