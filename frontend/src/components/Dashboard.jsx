import React, { useEffect, useState } from "react";
import { Eye, RefreshCcw, RotateCcw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import BatchProgress from "./BatchProgress";

const STATUS_COLORS = {
  PENDING: "text-yellow-400",
  IN_PROGRESS: "text-blue-400",
  ISSUED: "text-green-400",
  FAILED: "text-red-400",
};

const API_BASE = "https://aicertstest.onrender.com/dashboard";
const pdfUrl = "https://aicertstest.onrender.com";

export default function CertificateDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/certificates`);
      const data = await res.json();
      setCertificates(data.certificates);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/certificates/${id}/${action}`, {
        method: "POST",
      });
      fetchCertificates();
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-6"
        >
          Issuance Dashboard
        </motion.h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-white/10">
              <tr>
                <th className="p-3">Certificate ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {certificates.map((cert, index) => (
                <motion.tr
                  key={cert._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{cert.certificateId}</td>

                  <td
                    className={`p-3 font-semibold ${
                      STATUS_COLORS[cert.status]
                    }`}
                  >
                    {cert.status}
                  </td>

                  <td className="p-3 flex gap-3 items-center">
                   

                    {cert.status === "FAILED" && (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={loading}
                        title="Retry"
                        onClick={() => handleAction(cert._id, "retry")}
                      >
                        <RefreshCcw size={18} />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={loading}
                      title="Reissue"
                      onClick={() => handleAction(cert._id, "reissue")}
                    >
                      <RotateCcw size={18} />
                    </motion.button>

                 
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Batch Progress */}
        <div className="mt-6">
          <BatchProgress certificates={certificates} />
        </div>
      </motion.div>
    </div>
  );
}
