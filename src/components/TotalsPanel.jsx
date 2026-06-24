import React from 'react'
import { formatIDR } from '../format.js'

export default function TotalsPanel({ totals }) {
  const rows = [
    { label: 'Subtotal (incl PPN)', value: totals.subtotal, muted: true },
    ...(totals.isPkp ? [
      { label: 'DPP (Dasar Pengenaan Pajak)', value: totals.dpp, muted: true },
      { label: `PPN 12%`, value: totals.ppn, accent: 'brand' },
    ] : []),
    { label: 'Total Tagihan (Gross)', value: totals.grossTotal, bold: true },
  ]
  if (totals.totalPph > 0) {
    totals.pph.breakdown.forEach(b => rows.push({ label: `− ${b.label}`, value: b.amount, danger: true }))
    rows.push({ label: 'Total PPh Dipotong', value: -totals.totalPph, danger: true, muted: true })
  }
  rows.push({ label: 'Net Diterima (Net Payable)', value: totals.netPayable, final: true })

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Ringkasan Pajak</h2>
      <dl className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center justify-between gap-2 text-sm ${
            r.final ? 'mt-2 border-t border-slate-200 pt-2 dark:border-slate-700' : ''
          }`}>
            <dt className={`${r.muted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'} ${
              r.bold || r.final ? 'font-semibold' : ''
            }`}>
              {r.label}
            </dt>
            <dd className={`font-mono tabular-nums ${
              r.final ? 'text-lg font-bold text-brand-600 dark:text-brand-400'
              : r.danger ? 'text-rose-600 dark:text-rose-400'
              : r.accent === 'brand' ? 'text-brand-600 dark:text-brand-400 font-medium'
              : r.bold ? 'font-semibold text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-300'
            }`}>
              {formatIDR(r.value)}
            </dd>
          </div>
        ))}
      </dl>
      {totals.totalPph > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          💡 PPh dipotong oleh pembeli saat bayar. Anda menerima <strong>{formatIDR(totals.netPayable)}</strong> dari total tagihan {formatIDR(totals.grossTotal)}.
        </p>
      )}
    </div>
  )
}
