import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FileArchive, CheckCircle, XCircle } from "lucide-react";

import DarkButton from "./DarkButton";
import SuccessAnimation from "./SuccessAnimation";

export default function UploadBatchZip() {
  const [zipFile, setZipFile] = useState(null);
  const [stats, setStats] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleFileChange = (e) => {
    setZipFile(e.target.files[0]);
    setStats(null);
    setErrors([]);
    setValidated(false);
  };

  const handleValidate = async () => {
    if (!zipFile) return;

    setLoading(true);
    setErrors([]);
    setValidated(false);

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

      if (backendErrors?.length) {
        setErrors(backendErrors);
      } else {
        setValidated(true);
      }
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
    <div className="bg-gradient-to-br from-indigo-900 via-sky-900 to-emerald-900 min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          Step 2: Upload Batch ZIP
        </h2>

        {/* Upload Box */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border-2 border-dashed border-indigo-400/40
                     bg-white/10 backdrop-blur-md rounded-2xl
                     p-8 text-center shadow-lg"
        >
          <FileArchive className="mx-auto mb-3 text-indigo-300" size={48} />
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="block mx-auto text-sm text-gray-200"
          />
          <p className="text-sm text-gray-300 mt-3">
            ZIP must contain PDFs + <span className="font-medium">1 Excel</span>
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="mt-5 flex gap-4">
          <DarkButton
            onClick={handleValidate}
            loading={loading}
            disabled={!zipFile}
            variant="primary"
          >
            Validate ZIP
          </DarkButton>

          <DarkButton
            variant="secondary"
            onClick={() => {
              setZipFile(null);
              setStats(null);
              setErrors([]);
              setValidated(false);
            }}
          >
            Re-upload
          </DarkButton>
        </div>

        {/* Success Animation */}
        <AnimatePresence>
          {validated && stats && errors.length === 0 && (
            <SuccessAnimation message="Batch ZIP validated successfully" />
          )}
        </AnimatePresence>

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
                icon={<CheckCircle className="text-green-400" />}
              />
              <StatCard
                label="Invalid"
                value={stats.invalid}
                icon={<XCircle className="text-red-400" />}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch Breakdown */}
        {stats && (
          <div className="mt-6">
            <h3 className="font-semibold text-indigo-200 mb-2">
              Batch Breakdown
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.batches.map((b, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full
                             bg-indigo-500/20 text-indigo-200
                             border border-indigo-400/30 text-sm"
                >
                  Batch {i + 1}: {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-xl
                         bg-red-500/10 border border-red-500/30"
            >
              <h3 className="font-semibold text-red-300 mb-2">
                Validation Messages
              </h3>
              <ul className="list-disc list-inside text-sm text-red-200">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* Stat Card */
function StatCard({ label, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 rounded-xl shadow-lg
                 bg-white backdrop-blur-md
                 border border-amber-200
                 flex items-center gap-3 text-blue-500"
    >
      {icon}
      <div>
        <p className="text-sm text-balance">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
