import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideBarChart2, LucideLayoutDashboard, LucideSettings } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LucideLayoutDashboard,
  },
  {
    title: "Sites",
    href: "/sites",
    icon: LucideSettings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="group flex h-full flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Performance Dashboard
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
