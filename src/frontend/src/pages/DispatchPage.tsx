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
import { Filter, Loader2, PlusCircle, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TowelTypeBadge } from "../components/TowelTypeBadge";
import {
  TowelType,
  useAddDispatchEntry,
  useDispatchHistory,
} from "../hooks/useQueries";

function formatMeters(n: number): string {
  return `${n.toLocaleString("en-IN")} m`;
}

export function DispatchPage() {
  const [towelType, setTowelType] = useState<TowelType | "">("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");

  const [filterType, setFilterType] = useState<TowelType | "all">("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const { data: dispatches, isLoading } = useDispatchHistory();
  const addMutation = useAddDispatchEntry();

  const filtered = (dispatches ?? []).filter((e) => {
    if (filterType !== "all" && e.towelType !== filterType) return false;
    if (filterDateFrom && e.date < filterDateFrom) return false;
    if (filterDateTo && e.date > filterDateTo) return false;
    return true;
  });

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!towelType || !quantity || !date || !destination) return;
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
        destination,
        notes,
      });
      toast.success("Dispatch entry recorded!");
      setTowelType("");
      setQuantity("");
      setDestination("");
      setNotes("");
    } catch {
      toast.error("Failed to record dispatch. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Truck className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Dispatch</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Record outgoing dispatches and view dispatch history
        </p>
      </motion.div>

      {/* Add dispatch form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <PlusCircle className="w-4 h-4 text-primary" />
              New Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="disp-towel-type">Towel Type *</Label>
                  <Select
                    value={towelType}
                    onValueChange={(v) => setTowelType(v as TowelType)}
                  >
                    <SelectTrigger
                      id="disp-towel-type"
                      data-ocid="dispatch.towel_type.select"
                    >
                      <SelectValue placeholder="Select towel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TowelType.bath}>Bath Towel</SelectItem>
                      <SelectItem value={TowelType.hand}>Hand Towel</SelectItem>
                      <SelectItem value={TowelType.face}>Face Towel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="disp-quantity">Quantity (meters) *</Label>
                  <Input
                    id="disp-quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    data-ocid="dispatch.quantity.input"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="disp-date">Dispatch Date *</Label>
                  <Input
                    id="disp-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    data-ocid="dispatch.date.input"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="disp-destination">Destination *</Label>
                  <Input
                    id="disp-destination"
                    type="text"
                    placeholder="e.g. Mumbai Warehouse"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    data-ocid="dispatch.destination.input"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="disp-notes">Notes (optional)</Label>
                  <Textarea
                    id="disp-notes"
                    placeholder="Any notes about this dispatch..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none h-16"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  addMutation.isPending ||
                  !towelType ||
                  !quantity ||
                  !date ||
                  !destination
                }
                data-ocid="dispatch.add.submit_button"
                className="w-full sm:w-auto"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  "Record Dispatch"
                )}
              </Button>

              {addMutation.isError && (
                <p
                  data-ocid="dispatch.add.error_state"
                  className="text-sm text-destructive"
                >
                  Failed to record dispatch. Please try again.
                </p>
              )}
              {addMutation.isSuccess && (
                <p
                  data-ocid="dispatch.add.success_state"
                  className="text-sm text-green-600"
                >
                  Dispatch recorded successfully!
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* History table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Filter className="w-4 h-4 text-primary" />
                Dispatch History
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
              />
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-36 h-8 text-sm"
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
                data-ocid="dispatch.history.loading_state"
                className="p-6 space-y-3"
              >
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <Skeleton key={k} className="h-10 shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                data-ocid="dispatch.history.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Truck className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="font-medium">No dispatch entries found</p>
                <p className="text-sm mt-1">
                  {filterType !== "all" || filterDateFrom || filterDateTo
                    ? "Try adjusting your filters"
                    : "Record your first dispatch above"}
                </p>
              </div>
            ) : (
              <div
                data-ocid="dispatch.history.table"
                className="overflow-x-auto"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Destination</TableHead>
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
                        <TableCell>
                          <TowelTypeBadge type={entry.towelType} />
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {entry.destination}
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
