import { Activity, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { StockCards } from "../components/StockCards";

export function WorkerDashboard() {
  return (
    <div className="space-y-8">
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

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Current Stock Overview
        </h2>
        <StockCards />
      </section>

      <motion.div
        className="rounded-xl border border-border p-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.16 55 / 0.08), oklch(0.72 0.13 40 / 0.05))",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="font-display font-semibold text-base mb-2">
          Production Guidelines
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">·</span>
            Record your production at the end of each shift
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">·</span>
            Enter accurate measurements in meters for each towel type
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">·</span>
            Add notes for any quality issues or special batches
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">·</span>
            Contact admin if you spot stock discrepancies
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
