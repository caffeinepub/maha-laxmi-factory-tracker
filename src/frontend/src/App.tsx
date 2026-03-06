import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Factory } from "lucide-react";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { AddProductionPage } from "./pages/AddProductionPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DispatchPage } from "./pages/DispatchPage";
import { MyHistoryPage } from "./pages/MyHistoryPage";
import { ProductionPage } from "./pages/ProductionPage";
import { StockPage } from "./pages/StockPage";
import { WorkerDashboard } from "./pages/WorkerDashboard";
import { WorkersPage } from "./pages/WorkersPage";

function AppLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.16 55), oklch(0.72 0.13 40))",
          }}
        >
          <Factory className="w-8 h-8 text-white" />
        </div>
        <Skeleton className="h-5 w-40 mx-auto shimmer" />
        <Skeleton className="h-4 w-28 mx-auto shimmer" />
        <p className="text-xs text-muted-foreground mt-4">
          Loading MAHA LAXMI FACTORY...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const [adminTab, setAdminTab] = useState("dashboard");
  const [workerTab, setWorkerTab] = useState("dashboard");

  // Not logged in
  if (isInitializing) {
    return <AppLoading />;
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Logged in but still checking role
  if (isAdminLoading) {
    return <AppLoading />;
  }

  // ── Admin view ──────────────────────────────────────────────────────────────
  if (isAdmin) {
    const renderAdminContent = () => {
      switch (adminTab) {
        case "dashboard":
          return <AdminDashboard />;
        case "production":
          return <ProductionPage isAdmin={true} />;
        case "dispatch":
          return <DispatchPage />;
        case "stock":
          return <StockPage />;
        case "workers":
          return <WorkersPage />;
        default:
          return <AdminDashboard />;
      }
    };

    return (
      <>
        <Layout isAdmin={true} activeTab={adminTab} onTabChange={setAdminTab}>
          {renderAdminContent()}
        </Layout>
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // ── Worker view ─────────────────────────────────────────────────────────────
  const renderWorkerContent = () => {
    switch (workerTab) {
      case "dashboard":
        return <WorkerDashboard />;
      case "add-production":
        return <AddProductionPage />;
      case "my-history":
        return <MyHistoryPage />;
      default:
        return <WorkerDashboard />;
    }
  };

  return (
    <>
      <Layout isAdmin={false} activeTab={workerTab} onTabChange={setWorkerTab}>
        {renderWorkerContent()}
      </Layout>
      <Toaster richColors position="top-right" />
    </>
  );
}
