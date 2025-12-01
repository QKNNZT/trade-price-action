import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const SETUP_TYPES = [
  { value: "pinbar", label: "Pinbar", color: "bg-blue-500" },
  { value: "fakey", label: "Fakey", color: "bg-purple-500" },
  { value: "inside_bar", label: "Inside Bar", color: "bg-cyan-500" },
  { value: "db_dbr", label: "Double Bottom/Top (DBR)", color: "bg-green-500" },
  { value: "trend_cont", label: "Trend Continuation", color: "bg-yellow-500" },
  { value: "bos_choch", label: "BOS / CHOCH", color: "bg-red-500" },
  { value: "ob", label: "Order Block", color: "bg-orange-500" },
  { value: "fvg", label: "Fair Value Gap", color: "bg-pink-500" },
];

export const RESULT_TYPES = [
  {
    value: "win",
    label: "Win",
    icon: CheckCircle2,
    colorDark: "text-emerald-400",
    colorLight: "text-emerald-600",
  },
  {
    value: "loss",
    label: "Loss",
    icon: XCircle,
    colorDark: "text-rose-400",
    colorLight: "text-rose-600",
  },
  {
    value: "be",
    label: "Breakeven",
    icon: AlertCircle,
    colorDark: "text-amber-300",
    colorLight: "text-amber-500",
  },
];
