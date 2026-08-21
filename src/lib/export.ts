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

const STYLES_WORD: Record<"classique" | "moderne" | "compact", string> = {
  classique: `
    body { font-family: Calibri, Arial, sans-serif; color: #1A2230; }
    h1 { font-size: 22pt; margin-bottom: 4pt; }
    p.sub { color: #6C7580; margin-top: 0; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: 1px solid #DCE1DC; padding: 6pt 10pt; text-align: left; font-size: 11pt; }
    th { background: #F5F6F3; }
    .total { font-weight: bold; }
  `,
  moderne: `
    body { font-family: Calibri, Arial, sans-serif; color: #1A2230; }
    h1 { font-size: 26pt; margin-bottom: 2pt; color: #B8860B; letter-spacing: 0.5pt; }
    h3 { color: #B8860B; text-transform: uppercase; letter-spacing: 0.5pt; font-size: 12pt; border-bottom: 2pt solid #B8860B; padding-bottom: 3pt; }
    p.sub { color: #6C7580; margin-top: 0; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: none; border-bottom: 1pt solid #E8E2D3; padding: 8pt 10pt; text-align: left; font-size: 11pt; }
    th { background: #1F2B4A; color: #F6F1E7; }
    .total { font-weight: bold; color: #B8860B; }
  `,
  compact: `
    body { font-family: Calibri, Arial, sans-serif; color: #1A2230; font-size: 9pt; }
    h1 { font-size: 16pt; margin-bottom: 2pt; }
    h3 { font-size: 10pt; margin: 8pt 0 4pt; }
    p.sub { color: #6C7580; margin-top: 0; font-size: 9pt; }
    table { border-collapse: collapse; width: 100%; margin: 6pt 0; }
    td, th { border: 1px solid #DCE1DC; padding: 3pt 6pt; text-align: left; font-size: 9pt; }
    th { background: #F5F6F3; }
    .total { font-weight: bold; }
  `,
};

export function exportWord(filename: string, title: string, bodyHtml: string, style: "classique" | "moderne" | "compact" = "classique") {
  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>${STYLES_WORD[style]}</style></head>
<body>${bodyHtml}</body></html>`;
  const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
  downloadBlob(filename, blob);
}
