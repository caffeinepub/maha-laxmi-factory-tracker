import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Filter, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TowelTypeBadge } from "../components/TowelTypeBadge";
import {
  TowelType,
  useAddProductionEntry,
  useProductionHistory,
} from "../hooks/useQueries";

function formatMeters(n: number): string {
  return `${n.toLocaleString("en-IN")} m`;
}

type ProductionPageProps = {
  isAdmin: boolean;
};

export function ProductionPage({ isAdmin }: ProductionPageProps) {
  const [towelType, setTowelType] = useState<TowelType | "">("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const [filterType, setFilterType] = useState<TowelType | "all">("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const { data: production, isLoading } = useProductionHistory();
  const addMutation = useAddProductionEntry();

  const filtered = (production ?? []).filter((e) => {
    if (filterType !== "all" && e.towelType !== filterType) return false;
    if (filterDateFrom && e.date < filterDateFrom) return false;
    if (filterDateTo && e.date > filterDateTo) return false;
    return true;
  });

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!towelType || !quantity || !date) return;
    const qty = Number.parseFloat(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    try {
      await addMutation.mutateAsync({
        towelType: towelType as TowelType,
        quantityMeters: qty,
        date,
        notes,
      });
      toast.success("Production entry added!");
      setTowelType("");
      setQuantity("");
      setNotes("");
    } catch {
      toast.error("Failed to add entry. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Production</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Full production history and management"
            : "Log daily production"}
        </p>
      </motion.div>

      {/* Add entry form */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Add Production Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="prod-towel-type">Towel Type *</Label>
                    <Select
                      value={towelType}
                      onValueChange={(v) => setTowelType(v as TowelType)}
                    >
                      <SelectTrigger
                        id="prod-towel-type"
                        data-ocid="production.towel_type.select"
                      >
                        <SelectValue placeholder="Select towel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TowelType.bath}>
                          Bath Towel
                        </SelectItem>
                        <SelectItem value={TowelType.hand}>
                          Hand Towel
                        </SelectItem>
                        <SelectItem value={TowelType.face}>
                          Face Towel
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prod-quantity">Quantity (meters) *</Label>
                    <Input
                      id="prod-quantity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g. 250"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      data-ocid="production.quantity.input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prod-date">Date *</Label>
                    <Input
                      id="prod-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      data-ocid="production.date.input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prod-notes">Notes (optional)</Label>
                    <Textarea
                      id="prod-notes"
                      placeholder="Any additional notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      data-ocid="production.notes.textarea"
                      className="resize-none h-9 py-1.5"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    addMutation.isPending || !towelType || !quantity || !date
                  }
                  data-ocid="production.add.submit_button"
                  className="w-full sm:w-auto"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Add Production Entry"
                  )}
                </Button>

                {addMutation.isError && (
                  <p
                    data-ocid="production.add.error_state"
                    className="text-sm text-destructive"
                  >
                    Failed to submit entry. Please try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isAdmin ? 0.1 : 0.2 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Filter className="w-4 h-4 text-primary" />
                Production History
              </CardTitle>
              <Badge variant="outline" className="self-start sm:self-auto">
                {filtered.length} entries
              </Badge>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Select
                value={filterType}
                onValueChange={(v) => setFilterType(v as TowelType | "all")}
              >
                <SelectTrigger className="w-36 h-8 text-sm">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={TowelType.bath}>Bath</SelectItem>
                  <SelectItem value={TowelType.hand}>Hand</SelectItem>
                  <SelectItem value={TowelType.face}>Face</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-36 h-8 text-sm"
                placeholder="From date"
              />
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-36 h-8 text-sm"
                placeholder="To date"
              />
              {(filterType !== "all" || filterDateFrom || filterDateTo) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setFilterType("all");
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div
                data-ocid="production.history.loading_state"
                className="p-6 space-y-3"
              >
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <Skeleton key={k} className="h-10 shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                data-ocid="production.history.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="font-medium">No production entries found</p>
                <p className="text-sm mt-1">
                  {filterType !== "all" || filterDateFrom || filterDateTo
                    ? "Try adjusting your filters"
                    : "Add your first production entry above"}
                </p>
              </div>
            ) : (
              <div
                data-ocid="production.history.table"
                className="overflow-x-auto"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {isAdmin && <TableHead>Worker</TableHead>}
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Notes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((entry) => (
                      <TableRow key={String(entry.id)}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {entry.date}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-sm font-medium">
                            {entry.workerName}
                          </TableCell>
                        )}
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
