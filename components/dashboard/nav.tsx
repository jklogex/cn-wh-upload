import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardNav() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            Inventory Manager
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/files" className="text-sm">
              Files
            </Link>
            <Link href="/dashboard/mappings" className="text-sm">
              Mappings
            </Link>
          </nav>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  );
}