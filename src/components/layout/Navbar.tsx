"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-slate-900">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">PKR Tracker</span>
      </div>
      
      <div className="hidden md:block">
        {/* Breadcrumbs or page title could go here */}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden md:block">
            {user?.email}
          </span>
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
