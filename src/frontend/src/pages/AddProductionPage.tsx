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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TowelType, useAddProductionEntry } from "../hooks/useQueries";

export function AddProductionPage() {
  const [towelType, setTowelType] = useState<TowelType | "">("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const addMutation = useAddProductionEntry();

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!towelType || !quantity || !date) return;
    const qty = Number.parseFloat(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }
    try {
      await addMutation.mutateAsync({
        towelType: towelType as TowelType,
        quantityMeters: qty,
        date,
        notes,
      });
      toast.success("Production entry recorded!");
      setSubmitted(true);
      // Reset after 2s
      setTimeout(() => {
        setSubmitted(false);
        setTowelType("");
        setQuantity("");
        setNotes("");
      }, 2000);
    } catch {
      toast.error("Failed to add entry. Please try again.");
    }
  }

  const towelLabels: Record<TowelType, string> = {
    [TowelType.bath]: "Bath Towel",
    [TowelType.hand]: "Hand Towel",
    [TowelType.face]: "Face Towel",
  };

  return (
    <div className="space-y-6 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <PlusCircle className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Add Production</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Log your daily towel production in meters
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Production Entry Form
            </CardTitle>
            <CardDescription className="text-sm">
              Fill in the details for today's production
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <motion.div
                className="text-center py-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                data-ocid="production.add.success_state"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-display font-semibold text-lg">
                  Entry Recorded!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {towelLabels[towelType as TowelType] ?? "Towel"} –{" "}
                  {Number.parseFloat(quantity).toLocaleString("en-IN")} m
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Towel type selector */}
                <div className="space-y-2">
                  <Label
                    htmlFor="wk-towel-type"
                    className="text-sm font-semibold"
                  >
                    Towel Type *
                  </Label>
                  <Select
                    value={towelType}
                    onValueChange={(v) => setTowelType(v as TowelType)}
                  >
                    <SelectTrigger
                      id="wk-towel-type"
                      data-ocid="production.towel_type.select"
                      className="h-12"
                    >
                      <SelectValue placeholder="Select towel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TowelType.bath}>
                        <div className="flex items-center gap-2">
                          <span>🛁</span>
                          <span>Bath Towel</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={TowelType.hand}>
                        <div className="flex items-center gap-2">
                          <span>🤲</span>
                          <span>Hand Towel</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={TowelType.face}>
                        <div className="flex items-center gap-2">
                          <span>😊</span>
                          <span>Face Towel</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label
                    htmlFor="wk-quantity"
                    className="text-sm font-semibold"
                  >
                    Quantity (meters) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="wk-quantity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Enter quantity in meters"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      data-ocid="production.quantity.input"
                      className="h-12 pr-12"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      m
                    </span>
                  </div>
                  {quantity &&
                    !Number.isNaN(Number.parseFloat(quantity)) &&
                    Number.parseFloat(quantity) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        = {Number.parseFloat(quantity).toLocaleString("en-IN")}{" "}
                        meters
                      </p>
                    )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="wk-date" className="text-sm font-semibold">
                    Production Date *
                  </Label>
                  <Input
                    id="wk-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    data-ocid="production.date.input"
                    className="h-12"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="wk-notes" className="text-sm font-semibold">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="wk-notes"
                    placeholder="Any notes about this production batch, quality issues, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    data-ocid="production.notes.textarea"
                    className="resize-none h-20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    addMutation.isPending || !towelType || !quantity || !date
                  }
                  data-ocid="production.add.submit_button"
                  className="w-full h-12 text-base font-semibold"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Production Entry"
                  )}
                </Button>

                {addMutation.isError && (
                  <p
                    data-ocid="production.add.error_state"
                    className="text-sm text-destructive text-center"
                  >
                    Failed to submit. Please try again.
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
