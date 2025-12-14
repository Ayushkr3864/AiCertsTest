const AdmZip = require("adm-zip");
const XLSX = require("xlsx");
const { MAX_CERT_LIMIT, BATCH_SIZE } = require("../config/config");

const estimateTime = (count) => `${Math.ceil(count * 0.15)} sec`;

const breakdownBatches = (total) => {
  const batches = [];
  let remaining = total;
  while (remaining > 0) {
    batches.push(Math.min(BATCH_SIZE, remaining));
    remaining -= BATCH_SIZE;
  }
  return batches;
};

exports.validateZip = (zipPath) => {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  const pdfFiles = entries
    .filter((e) => e.entryName.endsWith(".pdf"))
    .map((e) => e.entryName);

  const excelEntry = entries.find(
    (e) => e.entryName.endsWith(".xlsx") || e.entryName.endsWith(".xls")
  );

  if (!excelEntry) throw new Error("Excel file not found in ZIP");

  const workbook = XLSX.read(excelEntry.getData(), { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const total = rows.length;
  if (total > MAX_CERT_LIMIT)
    throw new Error(`Maximum limit exceeded (${MAX_CERT_LIMIT})`);

  const excelFiles = rows.map((r) => r.filename);
  const missing = excelFiles.filter((f) => !pdfFiles.includes(f));
  const extra = pdfFiles.filter((f) => !excelFiles.includes(f));

  return {
    total,
    valid: total - missing.length,
    invalid: missing.length,
    errors: [
      missing.length && `${missing.length} PDFs missing from ZIP`,
      extra.length && `${extra.length} extra PDFs not mapped in Excel`,
    ].filter(Boolean),
    estimatedTime: estimateTime(total),
    batches: breakdownBatches(total),
  };
};
