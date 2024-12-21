import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 font-semibold">
          <FileSpreadsheet className="h-6 w-6" />
          <span>Excel Processor</span>
        </Link>
      </div>
    </header>
  );
}