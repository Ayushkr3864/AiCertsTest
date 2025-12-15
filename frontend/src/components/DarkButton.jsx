import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DarkButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = "primary",
}) {
  const base =
    "flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:brightness-110",
    secondary:
      "border border-gray-500/40 text-gray-200 bg-white/5 hover:bg-white/10",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
