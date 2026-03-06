import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Calendar, ClipboardList, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { StockCards } from "../components/StockCards";
import { TowelTypeBadge } from "../components/TowelTypeBadge";
import { useDispatchHistory, useProductionHistory } from "../hooks/useQueries";

function formatMeters(n: number): string {
  return `${n.toLocaleString("en-IN")} m`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AdminDashboard() {
  const { data: production, isLoading: prodLoading } = useProductionHistory();
  const { data: dispatches, isLoading: dispLoading } = useDispatchHistory();

  const today = todayStr();

  const todayProduction = useMemo(
    () => (production ?? []).filter((e) => e.date === today),
    [production, today],
  );
  const todayDispatches = useMemo(
    () => (dispatches ?? []).filter((e) => e.date === today),
    [dispatches, today],
  );

  const todayProdTotal = todayProduction.reduce(
    (s, e) => s + e.quantityMeters,
    0,
  );
  const todayDispTotal = todayDispatches.reduce(
    (s, e) => s + e.quantityMeters,
    0,
  );

  const recentProduction = (production ?? []).slice(0, 5);
  const recentDispatches = (dispatches ?? []).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Stock overview */}
      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Current Stock
        </h2>
        <StockCards />
      </section>

      {/* Today's summary */}
      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Today's Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Production Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prodLoading ? (
                  <Skeleton className="h-10 w-28 shimmer" />
                ) : (
                  <>
                    <p className="font-display text-3xl font-bold text-foreground">
                      {formatMeters(todayProdTotal)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {todayProduction.length} entries logged
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Truck className="w-4 h-4 text-primary" />
                  Dispatches Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dispLoading ? (
                  <Skeleton className="h-10 w-28 shimmer" />
                ) : (
                  <>
                    <p className="font-display text-3xl font-bold text-foreground">
                      {formatMeters(todayDispTotal)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {todayDispatches.length} dispatches made
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent production */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="w-4 h-4 text-primary" />
                Recent Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prodLoading ? (
                <div className="space-y-3">
                  {["p1", "p2", "p3", "p4"].map((k) => (
                    <Skeleton key={k} className="h-8 shimmer" />
                  ))}
                </div>
              ) : recentProduction.length === 0 ? (
                <div
                  data-ocid="production.empty_state"
                  className="text-center py-8 text-muted-foreground"
                >
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No production entries yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentProduction.map((entry) => (
                    <div
                      key={String(entry.id)}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <TowelTypeBadge type={entry.towelType} />
                        <span className="text-sm text-muted-foreground truncate">
                          {entry.workerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-medium text-sm">
                          {formatMeters(entry.quantityMeters)}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs hidden sm:inline-flex"
                        >
                          {entry.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent dispatches */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Truck className="w-4 h-4 text-primary" />
                Recent Dispatches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dispLoading ? (
                <div className="space-y-3">
                  {["d1", "d2", "d3", "d4"].map((k) => (
                    <Skeleton key={k} className="h-8 shimmer" />
                  ))}
                </div>
              ) : recentDispatches.length === 0 ? (
                <div
                  data-ocid="dispatch.empty_state"
                  className="text-center py-8 text-muted-foreground"
                >
                  <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No dispatches yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentDispatches.map((entry) => (
                    <div
                      key={String(entry.id)}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <TowelTypeBadge type={entry.towelType} />
                        <span className="text-sm text-muted-foreground truncate">
                          {entry.destination}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-medium text-sm">
                          {formatMeters(entry.quantityMeters)}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs hidden sm:inline-flex"
                        >
                          {entry.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
