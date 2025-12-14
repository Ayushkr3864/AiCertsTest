import React, { useState, useRef } from "react";
import Joyride from "react-joyride";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";
import { Upload, MapPin, Sparkles } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function CreateProjectStep1() {
  const pdfWrapperRef = useRef(null);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    issuer: "",
    issueDate: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [qrCoords, setQrCoords] = useState(null);

  const [joyride] = useState({
    run: true,
    steps: [
      {
        target: "#projectName",
        content: "Give your certificate project a name",
      },
      { target: "#pdfUpload", content: "Upload the certificate template PDF" },
      { target: "#pdfViewer", content: "Click to place the QR code" },
    ],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePdfClick = (e) => {
    if (!pdfWrapperRef.current) return;
    const rect = pdfWrapperRef.current.getBoundingClientRect();
    setQrCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  const handleSubmit = async () => {
    if (
      !form.projectName ||
      !form.issuer ||
      !form.issueDate ||
      !pdfFile ||
      !qrCoords
    ) {
      alert("Please fill all fields, upload PDF and select QR position");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("projectName", form.projectName);
      formData.append("issuer", form.issuer);
      formData.append("issueDate", form.issueDate);
      formData.append("description", form.description);
      formData.append("templatePdf", pdfFile);
      formData.append("qrCoordinates", JSON.stringify(qrCoords));

      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      alert("Project created successfully");
      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-sky-900 to-emerald-900 p-8">
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <Joyride
        steps={joyride.steps}
        run={joyride.run}
        continuous
        showSkipButton
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl space-y-10"
      >
        {/* Header */}
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3 text-4xl font-extrabold text-white"
        >
          <Sparkles className="h-8 w-8 text-cyan-300" />
          Certificate Project Setup
        </motion.h1>

        {/* Form */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              id="projectName"
              name="projectName"
              placeholder="Project Name"
              className="rounded-xl border border-white/20 bg-white/80 p-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-cyan-400"
              value={form.projectName}
              onChange={handleChange}
            />
            <input
              name="issuer"
              placeholder="Issuer / Organization"
              className="rounded-xl border border-white/20 bg-white/80 p-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-cyan-400"
              value={form.issuer}
              onChange={handleChange}
            />
            <input
              type="date"
              name="issueDate"
              className="rounded-xl border border-white/20 bg-white/80 p-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-cyan-400"
              value={form.issueDate}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Project Description"
              className="col-span-2 resize-none rounded-xl border border-white/20 bg-white/80 p-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-cyan-400"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </motion.div>

        {/* Upload */}
        <motion.label
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 p-5 text-white shadow-2xl"
        >
          <motion.span
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <Upload className="relative z-10" />
          <span className="relative z-10 font-semibold">
            Upload Template PDF
          </span>
          <input
            id="pdfUpload"
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </motion.label>
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-bold text-white shadow-lg"
        >
          Create Project
        </motion.button>
        {qrCoords && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-fit rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 font-semibold text-gray-900 shadow-lg"
          >
            QR Position → X: {qrCoords.x}, Y: {qrCoords.y}
          </motion.div>
        )}
        {/* PDF Viewer */}
        {pdfFile && (
          <motion.div
            id="pdfViewer"
            ref={pdfWrapperRef}
            onClick={handlePdfClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-fit cursor-crosshair rounded-2xl border border-white/10 bg-white p-4 shadow-2xl"
          >
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages || 0), (_, i) => (
                <Page key={i} pageNumber={i + 1} width={620} />
              ))}
            </Document>

            {qrCoords && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-xl"
                style={{ left: qrCoords.x - 16, top: qrCoords.y - 16 }}
              >
                <MapPin className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Coordinates */}

        {/* Submit Button */}
      </motion.div>
    </div>
  );
}
