import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Minus, Package, Plus, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StockCards } from "../components/StockCards";
import {
  TowelType,
  useAdjustStock,
  useSetInitialStock,
} from "../hooks/useQueries";

export function StockPage() {
  // Initial stock form
  const [initBath, setInitBath] = useState("");
  const [initHand, setInitHand] = useState("");
  const [initFace, setInitFace] = useState("");

  // Adjust stock form
  const [adjTowelType, setAdjTowelType] = useState<TowelType | "">("");
  const [adjQuantity, setAdjQuantity] = useState("");
  const [adjMode, setAdjMode] = useState<"add" | "subtract">("add");
  const [adjReason, setAdjReason] = useState("");
  const [adjDate, setAdjDate] = useState(new Date().toISOString().slice(0, 10));

  const setInitMutation = useSetInitialStock();
  const adjustMutation = useAdjustStock();

  async function handleSetInitial(ev: React.FormEvent) {
    ev.preventDefault();
    const b = Number.parseFloat(initBath);
    const h = Number.parseFloat(initHand);
    const f = Number.parseFloat(initFace);
    if (Number.isNaN(b) || Number.isNaN(h) || Number.isNaN(f)) {
      toast.error("Enter valid numbers for all three towel types");
      return;
    }
    try {
      await setInitMutation.mutateAsync({ bath: b, hand: h, face: f });
      toast.success("Initial stock set successfully!");
      setInitBath("");
      setInitHand("");
      setInitFace("");
    } catch {
      toast.error("Failed to set initial stock.");
    }
  }

  async function handleAdjust(ev: React.FormEvent) {
    ev.preventDefault();
    if (!adjTowelType || !adjQuantity || !adjReason) return;
    const qty = Number.parseFloat(adjQuantity);
    if (Number.isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    const finalQty = adjMode === "subtract" ? -qty : qty;
    try {
      await adjustMutation.mutateAsync({
        towelType: adjTowelType as TowelType,
        quantityMeters: finalQty,
        reason: adjReason,
        date: adjDate,
      });
      toast.success(
        `Stock ${adjMode === "add" ? "increased" : "decreased"} successfully!`,
      );
      setAdjTowelType("");
      setAdjQuantity("");
      setAdjReason("");
    } catch {
      toast.error("Failed to adjust stock.");
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Stock Management</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Set initial stock levels and make manual adjustments
        </p>
      </motion.div>

      {/* Current stock overview */}
      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Current Stock
        </h2>
        <StockCards />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Set initial stock */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Settings className="w-4 h-4 text-primary" />
                Set Initial Stock
              </CardTitle>
              <CardDescription className="text-sm">
                Set the starting stock values for all towel types at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetInitial} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="init-bath"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Bath (m)
                    </Label>
                    <Input
                      id="init-bath"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={initBath}
                      onChange={(e) => setInitBath(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="init-hand"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Hand (m)
                    </Label>
                    <Input
                      id="init-hand"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={initHand}
                      onChange={(e) => setInitHand(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="init-face"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Face (m)
                    </Label>
                    <Input
                      id="init-face"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={initFace}
                      onChange={(e) => setInitFace(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    setInitMutation.isPending ||
                    !initBath ||
                    !initHand ||
                    !initFace
                  }
                  data-ocid="stock.set_initial.submit_button"
                  className="w-full"
                >
                  {setInitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting...
                    </>
                  ) : (
                    "Set Initial Stock"
                  )}
                </Button>

                {setInitMutation.isError && (
                  <p
                    data-ocid="stock.set_initial.error_state"
                    className="text-sm text-destructive"
                  >
                    Failed to set initial stock. Please try again.
                  </p>
                )}
                {setInitMutation.isSuccess && (
                  <p
                    data-ocid="stock.set_initial.success_state"
                    className="text-sm text-green-600"
                  >
                    Initial stock set successfully!
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual adjustment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Package className="w-4 h-4 text-primary" />
                Manual Stock Adjustment
              </CardTitle>
              <CardDescription className="text-sm">
                Add or remove meters from stock with a reason
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdjust} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="adj-type">Towel Type *</Label>
                  <Select
                    value={adjTowelType}
                    onValueChange={(v) => setAdjTowelType(v as TowelType)}
                  >
                    <SelectTrigger id="adj-type">
                      <SelectValue placeholder="Select towel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TowelType.bath}>Bath Towel</SelectItem>
                      <SelectItem value={TowelType.hand}>Hand Towel</SelectItem>
                      <SelectItem value={TowelType.face}>Face Towel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Add / Subtract toggle */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">Adjustment Type *</Label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setAdjMode("add")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${
                          adjMode === "add"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjMode("subtract")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${
                          adjMode === "subtract"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                        Subtract
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="adj-qty">Quantity (meters) *</Label>
                    <Input
                      id="adj-qty"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g. 100"
                      value={adjQuantity}
                      onChange={(e) => setAdjQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adj-date">Date *</Label>
                  <Input
                    id="adj-date"
                    type="date"
                    value={adjDate}
                    onChange={(e) => setAdjDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adj-reason">Reason *</Label>
                  <Textarea
                    id="adj-reason"
                    placeholder="e.g. Damaged goods, inventory correction..."
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    className="resize-none h-16"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    adjustMutation.isPending ||
                    !adjTowelType ||
                    !adjQuantity ||
                    !adjReason
                  }
                  data-ocid="stock.adjust.submit_button"
                  variant={adjMode === "subtract" ? "destructive" : "default"}
                  className="w-full"
                >
                  {adjustMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    <>
                      {adjMode === "add" ? (
                        <Plus className="mr-2 h-4 w-4" />
                      ) : (
                        <Minus className="mr-2 h-4 w-4" />
                      )}
                      {adjMode === "add" ? "Add to Stock" : "Remove from Stock"}
                    </>
                  )}
                </Button>

                {adjustMutation.isError && (
                  <p
                    data-ocid="stock.adjust.error_state"
                    className="text-sm text-destructive"
                  >
                    Failed to adjust stock. Please try again.
                  </p>
                )}
                {adjustMutation.isSuccess && (
                  <p
                    data-ocid="stock.adjust.success_state"
                    className="text-sm text-green-600"
                  >
                    Stock adjusted successfully!
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
