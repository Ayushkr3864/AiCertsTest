import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function SuccessAnimation({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="mt-6 flex flex-col items-center gap-3 p-6 rounded-2xl
                 bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring" }}
      >
        <CheckCircle size={64} className="text-emerald-400" />
      </motion.div>

      <p className="text-emerald-200 text-lg font-semibold">
        {message || "ZIP validated successfully!"}
      </p>
    </motion.div>
  );
}
