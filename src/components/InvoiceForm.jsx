import React from 'react'
import { Building2, User, FileText as DocIcon } from 'lucide-react'
import LineItems from './LineItems.jsx'
import TaxConfig from './TaxConfig.jsx'
import TotalsPanel from './TotalsPanel.jsx'

export default function InvoiceForm({ invoice, update, totals }) {
  const setParty = (who) => (e) => {
    const { name, value } = e.target
    update({ [who]: { ...invoice[who], [name]: value } })
  }
  const setField = (name) => (e) => update({ [name]: e.target.value })

  return (
    <>
      {/* Metadata */}
      <div className="card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <DocIcon size={16} /> Detail Invoice
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="label">No. Invoice</label>
            <input className="input" value={invoice.invoiceNo} onChange={setField('invoiceNo')} />
          </div>
          <div>
            <label className="label">Tanggal</label>
            <input type="date" className="input" value={invoice.issueDate} onChange={setField('issueDate')} />
          </div>
          <div>
            <label className="label">Jatuh Tempo</label>
            <input type="date" className="input" value={invoice.dueDate || ''} onChange={setField('dueDate')} />
          </div>
        </div>
      </div>

      {/* Seller + Buyer */}
      <div className="grid gap-4 md:grid-cols-2">
        <PartyCard title="PENJUAL (Anda)" icon={<Building2 size={16} />} party={invoice.seller} onChange={setParty('seller')} />
        <PartyCard title="PEMBELI" icon={<User size={16} />} party={invoice.buyer} onChange={setParty('buyer')} />
      </div>

      {/* Items */}
      <div className="card p-4">
        <LineItems items={invoice.items} onChange={(items) => update({ items })} />
      </div>

      {/* Tax Config */}
      <div className="card p-4">
        <TaxConfig cfg={invoice.taxConfig} onChange={(taxConfig) => update({ taxConfig })} />
      </div>

      {/* Totals */}
      <div className="card p-4">
        <TotalsPanel totals={totals} />
      </div>

      {/* Notes */}
      <div className="card p-4">
        <label className="label">Catatan / Syarat & Ketentuan</label>
        <textarea
          className="input min-h-[72px]"
          placeholder="Contoh: Pembayaran via transfer bank dalam 14 hari kerja."
          value={invoice.notes || ''}
          onChange={setField('notes')}
        />
      </div>
    </>
  )
}

function PartyCard({ title, icon, party, onChange }) {
  return (
    <div className="card p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon} {title}
      </h2>
      <div className="space-y-2">
        <div>
          <label className="label">Nama</label>
          <input className="input" name="name" placeholder={title.includes('PENJUAL') ? 'PT Andalan Jaya' : 'PT Klien Sejahtera'}
            value={party.name} onChange={onChange} />
        </div>
        <div>
          <label className="label">NPWP</label>
          <input className="input" name="npwp" placeholder="01.234.567.8-901.000"
            value={party.npwp || ''} onChange={onChange} />
        </div>
        <div>
          <label className="label">Alamat</label>
          <input className="input" name="address" placeholder="Jl. Sudirman No. 1"
            value={party.address || ''} onChange={onChange} />
        </div>
        <div>
          <label className="label">Kota</label>
          <input className="input" name="city" placeholder="Jakarta Selatan"
            value={party.city || ''} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}
