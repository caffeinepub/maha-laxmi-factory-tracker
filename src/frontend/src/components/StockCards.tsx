import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Hand, TrendingUp, Waves } from "lucide-react";
import { motion } from "motion/react";
import { useStock } from "../hooks/useQueries";

function formatMeters(n: number): string {
  return `${n.toLocaleString("en-IN")} m`;
}

type StockCardProps = {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  icon: React.ElementType;
  gradientClass: string;
  ocid: string;
  index: number;
};

function StockCard({
  label,
  value,
  isLoading,
  icon: Icon,
  gradientClass,
  ocid,
  index,
}: StockCardProps) {
  return (
    <motion.div
      data-ocid={ocid}
      className={`rounded-xl border p-5 ${gradientClass} relative overflow-hidden shadow-card hover:shadow-card-hover transition-shadow`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
        aria-hidden="true"
        style={{ background: "currentColor" }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(var(--primary) / 0.15)" }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground/50" />
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label} Towels
        </p>
        {isLoading ? (
          <Skeleton
            className="h-9 w-32 shimmer"
            data-ocid={`${ocid}.loading_state`}
          />
        ) : (
          <p className="font-display text-3xl font-bold text-foreground tracking-tight">
            {formatMeters(value ?? 0)}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Current stock</p>
      </div>
    </motion.div>
  );
}

export function StockCards() {
  const { data: stock, isLoading } = useStock();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StockCard
        label="Bath"
        value={stock?.bathTowels}
        isLoading={isLoading}
        icon={Waves}
        gradientClass="stock-bath-gradient"
        ocid="stock.bath.card"
        index={0}
      />
      <StockCard
        label="Hand"
        value={stock?.handTowels}
        isLoading={isLoading}
        icon={Hand}
        gradientClass="stock-hand-gradient"
        ocid="stock.hand.card"
        index={1}
      />
      <StockCard
        label="Face"
        value={stock?.faceTowels}
        isLoading={isLoading}
        icon={Eye}
        gradientClass="stock-face-gradient"
        ocid="stock.face.card"
        index={2}
      />
    </div>
  );
}
