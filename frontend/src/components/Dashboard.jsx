import React, { useEffect, useState } from "react";
import { Eye, RefreshCcw, RotateCcw, ExternalLink } from "lucide-react";
import BatchProgress from "./BatchProgress";

const STATUS_COLORS = {
  PENDING: "text-yellow-500",
  IN_PROGRESS: "text-blue-500",
  ISSUED: "text-green-500",
  FAILED: "text-red-500",
};

const API_BASE = "http://localhost:3000/dashboard";
const pdfUrl = "http://localhost:3000";

export default function CertificateDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch certificates from backend
  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/certificates`);
        const data = await res.json();
        console.log(data);
        
      setCertificates(data);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // 🔹 Retry / Reissue actions
  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/certificates/${id}/${action}`, {
        method: "POST",
      });
      fetchCertificates(); // refresh state after action
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Issuance Dashboard</h1>

      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Certificate ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {certificates.map((cert) => (
            <tr key={cert._id} className="border-t">
              <td className="p-2">{cert.certificateId}</td>

              <td className={`p-2 font-medium ${STATUS_COLORS[cert.status]}`}>
                {cert.status}
              </td>

              <td className="p-2 flex gap-3 items-center">
                {/* View PDF */}
                <button
                  title="View"
                  onClick={() => window.open(`${pdfUrl}/${cert.pdfUrl}`, "_blank")}
                >
                  <Eye size={18} />
                </button>

                {/* Retry (only if FAILED) */}
                {cert.status === "FAILED" && (
                  <button
                    title="Retry"
                    disabled={loading}
                    onClick={() => handleAction(cert._id, "retry")}
                  >
                    <RefreshCcw size={18} />
                  </button>
                )}

                {/* Reissue */}
                <button
                  title="Reissue"
                  disabled={loading}
                  onClick={() => handleAction(cert._id, "reissue")}
                >
                  <RotateCcw size={18} />
                </button>

                {/* Verification Portal */}
                <a
                  href={`https://verify.example.com?id=${cert.certificateId}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Verify"
                >
                  <ExternalLink size={18} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Batch progress */}
      <BatchProgress certificates={certificates} />
    </div>
  );
}
