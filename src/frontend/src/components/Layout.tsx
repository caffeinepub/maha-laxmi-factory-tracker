import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ClipboardList,
  Factory,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Truck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  ocid: string;
  adminOnly?: boolean;
};

const adminNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    id: "production",
    label: "Production",
    icon: ClipboardList,
    ocid: "nav.production.link",
  },
  { id: "dispatch", label: "Dispatch", icon: Truck, ocid: "nav.dispatch.link" },
  {
    id: "stock",
    label: "Stock",
    icon: Package,
    ocid: "nav.stock.link",
    adminOnly: true,
  },
  {
    id: "workers",
    label: "Workers",
    icon: Users,
    ocid: "nav.workers.link",
    adminOnly: true,
  },
];

const workerNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    id: "add-production",
    label: "Add Production",
    icon: PlusCircle,
    ocid: "nav.production.link",
  },
  {
    id: "my-history",
    label: "My History",
    icon: ClipboardList,
    ocid: "nav.production.link",
  },
];

type LayoutProps = {
  isAdmin: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  workerName?: string;
};

export function Layout({
  isAdmin,
  activeTab,
  onTabChange,
  children,
  workerName,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();

  const navItems = isAdmin ? adminNavItems : workerNavItems;
  const principalShort = `${identity?.getPrincipal().toString().slice(0, 12)}...`;

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground shrink-0 fixed h-full z-20">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.16 38))",
              }}
            >
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">
                MAHA LAXMI
              </p>
              <p className="font-display text-xs tracking-widest opacity-60 uppercase">
                Factory
              </p>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-sidebar-border">
          <Badge
            className="text-xs font-semibold"
            style={{
              background: isAdmin
                ? "oklch(0.72 0.17 58 / 0.25)"
                : "oklch(0.68 0.15 140 / 0.2)",
              color: isAdmin ? "oklch(0.78 0.18 60)" : "oklch(0.65 0.18 140)",
              border: isAdmin
                ? "1px solid oklch(0.72 0.17 58 / 0.4)"
                : "1px solid oklch(0.68 0.15 140 / 0.4)",
            }}
          >
            {isAdmin ? "Admin" : "Worker"}
          </Badge>
          {workerName && (
            <p className="text-xs text-sidebar-foreground/60 mt-1 truncate">
              {workerName}
            </p>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-sidebar-primary" : ""}`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs text-sidebar-foreground/40 font-mono truncate">
              {principalShort}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clear()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 h-14 flex items-center">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.16 38))",
            }}
          >
            <Factory className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm">
            MAHA LAXMI FACTORY
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* ── Mobile Side Drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-sidebar text-sidebar-foreground shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="px-6 py-6 border-b border-sidebar-border flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.16 38))",
                  }}
                >
                  <Factory className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm">MAHA LAXMI</p>
                  <p className="font-display text-xs tracking-widest opacity-60 uppercase">
                    Factory
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-sidebar-foreground/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="px-6 py-3 border-b border-sidebar-border">
                <Badge
                  className="text-xs"
                  style={{
                    background: isAdmin
                      ? "oklch(0.72 0.17 58 / 0.25)"
                      : "oklch(0.68 0.15 140 / 0.2)",
                    color: isAdmin
                      ? "oklch(0.78 0.18 60)"
                      : "oklch(0.65 0.18 140)",
                    border: isAdmin
                      ? "1px solid oklch(0.72 0.17 58 / 0.4)"
                      : "1px solid oklch(0.68 0.15 140 / 0.4)",
                  }}
                >
                  {isAdmin ? "Admin" : "Worker"}
                </Badge>
                {workerName && (
                  <p className="text-xs text-sidebar-foreground/60 mt-1">
                    {workerName}
                  </p>
                )}
              </div>

              <nav className="px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      data-ocid={item.ocid}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-sidebar-border">
                <button
                  type="button"
                  onClick={() => clear()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
