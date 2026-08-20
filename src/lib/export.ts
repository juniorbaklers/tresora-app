function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell);
          return /[",;\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(";")
    )
    .join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(filename, blob);
}

export function exportWord(filename: string, title: string, bodyHtml: string) {
  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; color: #1A2230; }
  h1 { font-size: 22pt; margin-bottom: 4pt; }
  p.sub { color: #6C7580; margin-top: 0; }
  table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
  td, th { border: 1px solid #DCE1DC; padding: 6pt 10pt; text-align: left; font-size: 11pt; }
  th { background: #F5F6F3; }
  .total { font-weight: bold; }
</style></head>
<body>${bodyHtml}</body></html>`;
  const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
  downloadBlob(filename, blob);
}
