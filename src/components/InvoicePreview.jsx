import React from 'react'
import { formatIDR, formatDateID, terbilang } from '../format.js'

export default function InvoicePreview({ invoice, totals }) {
  const { seller, buyer, items, invoiceNo, issueDate, dueDate, notes, taxConfig } = invoice

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
        Preview Invoice (real-time)
      </div>
      <div className="scale-[0.92] origin-top p-6 print:scale-100">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">IP</div>
              <span className="text-base font-bold">INVOICE</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">{invoiceNo || '—'}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{formatDateID(issueDate)}</div>
            {dueDate && <div className="text-xs text-slate-500 dark:text-slate-400">Jatuh tempo: {formatDateID(dueDate)}</div>}
          </div>
        </div>

        {/* Parties */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="mb-1 font-semibold uppercase tracking-wide text-slate-400">Dari</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">{seller.name || 'Nama Penjual'}</div>
            {seller.npwp && <div className="text-slate-500 dark:text-slate-400">NPWP: {seller.npwp}</div>}
            {seller.address && <div className="text-slate-500 dark:text-slate-400">{seller.address}</div>}
            {seller.city && <div className="text-slate-500 dark:text-slate-400">{seller.city}</div>}
            {taxConfig.isPkp && <div className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">PKP</div>}
          </div>
          <div>
            <div className="mb-1 font-semibold uppercase tracking-wide text-slate-400">Kepada</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">{buyer.name || 'Nama Pembeli'}</div>
            {buyer.npwp && <div className="text-slate-500 dark:text-slate-400">NPWP: {buyer.npwp}</div>}
            {buyer.address && <div className="text-slate-500 dark:text-slate-400">{buyer.address}</div>}
            {buyer.city && <div className="text-slate-500 dark:text-slate-400">{buyer.city}</div>}
          </div>
        </div>

        {/* Items table */}
        <table className="mb-4 w-full text-xs">
          <thead>
            <tr className="border-b border-slate-300 text-left text-slate-500 dark:border-slate-600 dark:text-slate-400">
              <th className="py-1.5 pr-2 font-medium">Deskripsi</th>
              <th className="w-12 py-1.5 pr-2 text-right font-medium">Qty</th>
              <th className="w-14 py-1.5 pr-2 font-medium">Satuan</th>
              <th className="w-24 py-1.5 pr-2 text-right font-medium">Harga</th>
              <th className="w-28 py-1.5 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.filter(i => i.desc || i.price).map((it, i) => (
              <tr key={it.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-1.5 pr-2 text-slate-700 dark:text-slate-200">
                  {it.desc || '—'}
                  <span className="ml-1 text-[10px] uppercase text-slate-400">{it.type}</span>
                </td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{it.qty}</td>
                <td className="py-1.5 pr-2 text-slate-500">{it.unit || ''}</td>
                <td className="py-1.5 pr-2 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatIDR(it.price)}</td>
                <td className="py-1.5 text-right tabular-nums font-medium">{formatIDR((Number(it.qty) || 0) * (Number(it.price) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="ml-auto w-full max-w-[260px] space-y-1 text-xs">
          <Row label="Subtotal" value={formatIDR(totals.subtotal)} />
          {totals.isPkp && (
            <>
              <Row label="DPP" value={formatIDR(totals.dpp)} muted />
              <Row label="PPN 12%" value={formatIDR(totals.ppn)} accent />
            </>
          )}
          <Row label="Total Tagihan" value={formatIDR(totals.grossTotal)} bold />
          {totals.pph.breakdown.map((b, i) => (
            <Row key={i} label={`− ${b.label}`} value={formatIDR(b.amount)} danger />
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-slate-300 pt-2 dark:border-slate-600">
            <span className="font-bold text-brand-600 dark:text-brand-400">Net Diterima</span>
            <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400">{formatIDR(totals.netPayable)}</span>
          </div>
        </div>

        {totals.netPayable > 0 && (
          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] italic text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            Terbilang: <strong>{capitalize(terbilang(totals.netPayable))} rupiah</strong>.
          </div>
        )}

        {notes && (
          <div className="mt-4 border-t border-slate-200 pt-3 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <strong>Catatan:</strong> {notes}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold, muted, accent, danger }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${muted ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'} ${bold ? 'font-semibold' : ''}`}>
        {label}
      </span>
      <span className={`font-mono tabular-nums ${
        danger ? 'text-rose-600 dark:text-rose-400'
        : accent ? 'text-brand-600 dark:text-brand-400'
        : bold ? 'font-semibold text-slate-900 dark:text-white'
        : 'text-slate-700 dark:text-slate-200'
      }`}>
        {value}
      </span>
    </div>
  )
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
