import React from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { emptyItem } from '../schema.js'
import { formatIDR } from '../format.js'

export default function LineItems({ items, onChange }) {
  const update = (id, patch) => onChange(items.map(it => it.id === id ? { ...it, ...patch } : it))
  const addRow = () => onChange([...items, emptyItem()])
  const removeRow = (id) => onChange(items.filter(it => it.id !== id))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Item Invoice</h2>
        <button onClick={addRow} className="btn-ghost !py-1.5 !text-xs">
          <Plus size={14} /> Tambah baris
        </button>
      </div>

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={it.id} className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
            <div className="flex items-start gap-2">
              <div className="hidden pt-2 text-slate-400 sm:block"><GripVertical size={14} /></div>
              <div className="grid flex-1 gap-2">
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder={`Deskripsi item ${idx + 1}`}
                    value={it.desc}
                    onChange={(e) => update(it.id, { desc: e.target.value })}
                  />
                  <select
                    className="input !w-24"
                    value={it.type}
                    onChange={(e) => update(it.id, { type: e.target.value })}
                    title="Tipe item (auto-suggest PPh)"
                  >
                    <option value="jasa">Jasa</option>
                    <option value="barang">Barang</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div>
                    <label className="label">Qty</label>
                    <input type="number" min="0" step="any" className="input"
                      value={it.qty} onChange={(e) => update(it.id, { qty: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Satuan</label>
                    <input className="input" placeholder="unit/jam/paket"
                      value={it.unit || ''} onChange={(e) => update(it.id, { unit: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Harga (incl PPN)</label>
                    <input type="number" min="0" step="any" className="input"
                      value={it.price} onChange={(e) => update(it.id, { price: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Total</label>
                    <div className="input !bg-slate-50 !text-slate-600 dark:!bg-slate-800/50 dark:!text-slate-300">
                      {formatIDR((Number(it.qty) || 0) * (Number(it.price) || 0))}
                    </div>
                  </div>
                </div>
                {it.type === 'barang' && (
                  <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <input type="checkbox" checked={!!it.isMarketplace}
                      onChange={(e) => update(it.id, { isMarketplace: e.target.checked })} />
                    Penjualan via marketplace (kena PPh 22 0,5%)
                  </label>
                )}
              </div>
              <button onClick={() => removeRow(it.id)}
                className="mt-1 rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                disabled={items.length <= 1}
                title="Hapus baris"
                aria-label="Hapus baris"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Tip: harga diisi <strong>sudah termasuk PPN</strong> (inclusive). Sistem akan hitung DPP &amp; PPN otomatis.
      </p>
    </div>
  )
}
