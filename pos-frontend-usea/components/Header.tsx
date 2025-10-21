"use client";

import { Package2, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuthStore } from "@/types/auth";

const navItems = [
  { path: "/admin", name: "Dashboard" },
  { path: "/admin/customers", name: "Customers" },
  { path: "/admin/products", name: "Products" },
  { path: "/admin/categories", name: "Categories" },
  { path: "/admin/orders", name: "Orders" },
  { path: "/admin/pos", name: "Point of Sale" },
  { path: "/admin/cashiers", name: "Cashiers" },
  { path: "/admin/sales", name: "Sales" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const currentPage = navItems.find((item) => item.path === pathname)?.name || "Dashboard";

  const handleLogout = async () => {
    await logout();         // Clear auth state
    router.replace("/login"); // Redirect to login immediately
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="hidden sm:inline-block">POS System</span>
      </Link>

      {/* Page Title */}
      <h1 className="text-lg font-bold sm:text-xl">{currentPage}</h1>

      {/* Search */}
      <div className="relative ml-auto flex-1 md:flex-none">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* User Info & Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
            <span className="hidden sm:inline">
              {user?.first_name} {user?.last_name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className="font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-sm text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
