import { Package2, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import Image from "next/image"

// Reuse navItems from Navbar
const navItems = [
  { path: "/admin", name: "Dashboard" },
  { path: "/admin/customers", name: "Customers" },
  { path: "/admin/products", name: "Products" },
  { path: "/admin/categories", name: "Categories" },
  { path: "/admin/orders", name: "Orders" },
  { path: "/admin/pos", name: "Point of Sale" },
  { path: "/admin/cashiers", name: "Cashiers" },
  { path: "/admin/sales", name: "Sales" },
]

const Header = () => {
  const pathname = usePathname()

  // Dynamically get the current page name
  const currentPage = navItems.find((item) => item.path === pathname)?.name || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Admin Panel</span>
      </Link>

      {/* Page Title */}
      <h1 className="text-xl font-bold">{currentPage}</h1>

      {/* Search */}
      <div className="relative ml-auto flex-1 md:flex-none">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* Avatar Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Image
              src="/cate.jpg"
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
