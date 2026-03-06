import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { TowelTypeBadge } from "../components/TowelTypeBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProductionHistory } from "../hooks/useQueries";

function formatMeters(n: number): string {
  return `${n.toLocaleString("en-IN")} m`;
}

export function MyHistoryPage() {
  const { identity } = useInternetIdentity();
  const { data: allProduction, isLoading } = useProductionHistory();

  const myPrincipal = identity?.getPrincipal().toString();

  const myEntries = useMemo(
    () =>
      (allProduction ?? []).filter(
        (e) => e.workerId.toString() === myPrincipal,
      ),
    [allProduction, myPrincipal],
  );

  const totalMeters = useMemo(
    () => myEntries.reduce((sum, e) => sum + e.quantityMeters, 0),
    [myEntries],
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">
            My Production History
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          All your personal production entries
        </p>
      </motion.div>

      {/* Summary stat */}
      {!isLoading && myEntries.length > 0 && (
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="rounded-xl border border-border px-5 py-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.16 55 / 0.1), oklch(0.72 0.13 40 / 0.06))",
            }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Total Produced
            </p>
            <p className="font-display text-2xl font-bold text-foreground mt-0.5">
              {formatMeters(totalMeters)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              across {myEntries.length} entries
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="w-4 h-4 text-primary" />
                Production Entries
              </CardTitle>
              <Badge variant="outline">{myEntries.length} entries</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div
                data-ocid="my-history.loading_state"
                className="p-6 space-y-3"
              >
                {["h1", "h2", "h3", "h4", "h5"].map((k) => (
                  <Skeleton key={k} className="h-10 shimmer" />
                ))}
              </div>
            ) : myEntries.length === 0 ? (
              <div
                data-ocid="my-history.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="font-medium">No production entries yet</p>
                <p className="text-sm mt-1">
                  Add your first entry from the "Add Production" tab
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Notes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myEntries.map((entry) => (
                      <TableRow key={String(entry.id)}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {entry.date}
                        </TableCell>
                        <TableCell>
                          <TowelTypeBadge type={entry.towelType} />
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm whitespace-nowrap">
                          {formatMeters(entry.quantityMeters)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">
                          {entry.notes || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
