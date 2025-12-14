import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileArchive,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";

export default function UploadBatchZip() {
  const [zipFile, setZipFile] = useState(null);
  const [stats, setStats] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setZipFile(e.target.files[0]);
    setStats(null);
    setErrors([]);
  };

  const handleValidate = async () => {
    if (!zipFile) return;

    setLoading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("batchZip", zipFile);

      const res = await axios.post(
        "https://aicertstest.onrender.com/api/batch/validate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const {
        total,
        valid,
        invalid,
        estimatedTime,
        batches,
        errors: backendErrors,
      } = res.data;

      setStats({
        total,
        valid,
        invalid,
        time: estimatedTime,
        batches,
      });

      if (backendErrors?.length) setErrors(backendErrors);
    } catch (err) {
      setErrors([
        err.response?.data?.message ||
          "Validation failed. Please re-upload ZIP.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Step 2: Upload Batch ZIP
      </h2>

      {/* Upload Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="border-2 border-dashed border-indigo-300 bg-indigo-50/40 rounded-2xl p-8 text-center shadow-sm"
      >
        <FileArchive className="mx-auto mb-3 text-indigo-500" size={48} />
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="block mx-auto text-sm"
        />
        <p className="text-sm text-gray-500 mt-3">
          ZIP must contain PDFs + <span className="font-medium">1 Excel</span>
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="mt-5 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleValidate}
          disabled={loading || !zipFile}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg disabled:opacity-50"
        >
          <Upload size={18} />
          {loading ? "Validating..." : "Validate ZIP"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setZipFile(null);
            setStats(null);
            setErrors([]);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 bg-white shadow"
        >
          <RefreshCcw size={18} /> Re-upload
        </motion.button>
      </div>

      {/* Stats */}
      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <StatCard label="Total Entries" value={stats.total} />
            <StatCard label="Estimated Time" value={stats.time} />
            <StatCard
              label="Valid"
              value={stats.valid}
              icon={<CheckCircle className="text-green-500" />}
            />
            <StatCard
              label="Invalid"
              value={stats.invalid}
              icon={<XCircle className="text-red-500" />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Breakdown */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <h3 className="font-semibold mb-2 text-indigo-600">
            Batch Breakdown
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.batches.map((b, i) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm"
              >
                Batch {i + 1}: {b}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50"
          >
            <h3 className="font-semibold mb-2 text-red-600">
              Validation Messages
            </h3>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Reusable stat card */
function StatCard({ label, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 rounded-xl shadow bg-white flex items-center gap-3"
    >
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
