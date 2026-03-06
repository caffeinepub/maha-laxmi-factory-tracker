import { Badge } from "@/components/ui/badge";
import { TowelType } from "../hooks/useQueries";

const towelConfig = {
  [TowelType.bath]: {
    label: "Bath",
    style: {
      background: "oklch(0.62 0.13 220 / 0.18)",
      color: "oklch(0.42 0.14 220)",
      border: "1px solid oklch(0.62 0.13 220 / 0.35)",
    },
  },
  [TowelType.hand]: {
    label: "Hand",
    style: {
      background: "oklch(0.68 0.15 140 / 0.18)",
      color: "oklch(0.42 0.14 140)",
      border: "1px solid oklch(0.68 0.15 140 / 0.35)",
    },
  },
  [TowelType.face]: {
    label: "Face",
    style: {
      background: "oklch(0.72 0.17 55 / 0.18)",
      color: "oklch(0.48 0.14 50)",
      border: "1px solid oklch(0.72 0.17 55 / 0.35)",
    },
  },
};

export function TowelTypeBadge({ type }: { type: TowelType }) {
  const config = towelConfig[type];
  return (
    <Badge style={config.style} className="font-medium text-xs">
      {config.label}
    </Badge>
  );
}
