import Link from "next/link";
import { Leaf, Menu, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-green-800">AgriAI</span>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600">Dashboard</Link>
          <Link href="/scanner" className="text-sm font-medium text-gray-600 hover:text-green-600">Scanner</Link>
          <Link href="/advisor" className="text-sm font-medium text-gray-600 hover:text-green-600">Advisor</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-green-600">
            <Bell className="h-5 w-5" />
          </button>
          <Link href="/login" className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            <User className="h-4 w-4" />
          </Link>
          <button className="md:hidden text-gray-500">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
