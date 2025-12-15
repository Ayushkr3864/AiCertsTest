import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center mb-6 text-white"
        >
          Certificate Issuance Flow
        </motion.h1>

        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create-project")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            Step 1: Create Project & Upload Template PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/upload-batch")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Step 2: Upload Batch ZIP File
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg"
          >
            Step 3: Issuance Dashboard
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 transition shadow-lg"
          >
            Firstly Login as an Admin to Access Features
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
