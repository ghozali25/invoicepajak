import React from 'react'
import { Settings2 } from 'lucide-react'

export default function TaxConfig({ cfg, onChange }) {
  const set = (patch) => onChange({ ...cfg, ...patch })

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <Settings2 size={16} /> Konfigurasi Pajak
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="PKP — Pengusaha Kena Pajak"
          desc="Centang kalau penjual PKP. PPN 12% dihitung dari DPP."
          checked={cfg.isPkp}
          onChange={(v) => set({ isPkp: v })}
        />
        <Toggle
          label="PPh 23 — Jasa (2%)"
          desc="Dipotong buyer. Berlaku buat jasa konsultan, manajemen, teknik, dll."
          checked={cfg.pph23}
          onChange={(v) => set({ pph23: v })}
        />
        <Toggle
          label="PPh 22 — Marketplace (0,5%)"
          desc="Penjualan barang via marketplace (PMK 37/2025)."
          checked={cfg.pph22Marketplace}
          onChange={(v) => set({ pph22Marketplace: v })}
        />
        <div>
          <label className="label mb-2">PPh Final Pasal 4(2) — Sewa</label>
          <div className="flex gap-1">
            {[
              { v: 'none', l: 'Bukan sewa' },
              { v: 'building', l: 'Bangunan 2,5%' },
              { v: 'land', l: 'Tanah 7,5%' },
            ].map(opt => (
              <button key={opt.v}
                onClick={() => set({ pphFinal42: opt.v })}
                className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  cfg.pphFinal42 === opt.v
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-brand-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
      </div>
    </label>
  )
}
