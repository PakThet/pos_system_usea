import React from "react"
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingCart,
  Monitor,
  DollarSign,
} from "lucide-react"

const navItems = [
  { path: "/admin", name: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/customers", name: "Customers", icon: Users },
  { path: "/admin/products", name: "Products", icon: Package },
  { path: "/admin/categories", name: "Categories", icon: Tags },
  { path: "/admin/orders", name: "Orders", icon: ShoppingCart },
  { path: "/admin/pos", name: "Point of Sale", icon: Monitor },
  { path: "/admin/cashiers", name: "Cashier", icon: DollarSign },
  { path: "/admin/sales", name: "Sales", icon: DollarSign },
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <TooltipProvider>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  href={item.path}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </nav>
  )
}

export default Navbar
