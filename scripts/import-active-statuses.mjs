// Imports the active-status workbook (PM_STATUS.RECORD_STATUS = 1, sheet "All") into registry/active-statuses.json.
// Usage: node scripts/import-active-statuses.mjs "C:\Users\<you>\Downloads\NGEPSIT_Active_Status_All_Modules.xlsx"
// The workbook comes from the SQL on its "SQL" sheet (pm_status + pm_status_desc, NGEP_SIT). Re-import when it changes.
import fs from 'node:fs';
import path from 'node:path';
import ExcelJS from 'exceljs';

const root = path.resolve(import.meta.dirname, '..');
const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error('Give the path of NGEPSIT_Active_Status_All_Modules.xlsx');
  process.exit(1);
}
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(file);
const ws = wb.getWorksheet('All');
if (!ws) throw new Error('sheet "All" missing');
const text = (v) => (v == null ? '' : String(typeof v === 'object' && 'text' in v ? v.text : typeof v === 'object' && 'result' in v ? v.result : v).trim());
const head = ws.getRow(1).values.map(text);
const col = (n) => head.indexOf(n);
const [cM, cD, cS, cE, cB, cN] = ['Module', 'Doc Type', 'Status ID', 'Status Name (EN)', 'Status Name (MS)', 'Note'].map(col);
if ([cM, cD, cS].some((i) => i < 0)) throw new Error(`unexpected header: ${head.join(' | ')}`);
const rows = [];
for (let r = 2; r <= ws.rowCount; r++) {
  const row = ws.getRow(r);
  const id = Number(text(row.getCell(cS).value));
  if (!id) continue;
  rows.push({ module: text(row.getCell(cM).value), docType: text(row.getCell(cD).value), statusId: id, en: text(row.getCell(cE).value), bm: text(row.getCell(cB).value), note: cN > 0 ? text(row.getCell(cN).value) : '' });
}
const title = text(wb.getWorksheet('Summary')?.getRow(1).getCell(1).value);
fs.writeFileSync(path.join(root, 'registry', 'active-statuses.json'), JSON.stringify({ _about: `Imported by scripts/import-active-statuses.mjs from ${path.basename(file)}. ${title}`, importedAt: new Date().toISOString(), count: rows.length, statuses: rows }, null, 1) + '\n');
const by = {};
for (const x of rows) by[x.module] = (by[x.module] ?? 0) + 1;
console.log(`registry/active-statuses.json: ${rows.length} active statuses`, by);
