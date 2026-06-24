import React from 'react'
import { FileText, Download, RotateCcw, Moon, Sun, Github } from 'lucide-react'
import InvoiceForm from './components/InvoiceForm.jsx'
import InvoicePreview from './components/InvoicePreview.jsx'
import { computeTotals } from './calc.js'
import { InvoiceSchema, emptyItem, defaultInvoiceNo, todayISO } from './schema.js'
import { generateInvoicePdf } from './utils/pdf.js'

function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('ip-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('ip-theme', theme)
  }, [theme])
  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')]
}

export default function App() {
  const [theme, toggleTheme] = useTheme()

  const [invoice, setInvoice] = React.useState(() => ({
    invoiceNo: defaultInvoiceNo(),
    issueDate: todayISO(),
    dueDate: '',
    seller: { name: '', npwp: '', address: '', city: '' },
    buyer: { name: '', npwp: '', address: '', city: '' },
    items: [{ ...emptyItem(), desc: 'Jasa konsultasi pajak', type: 'jasa', price: 1_120_000 }],
    taxConfig: { isPkp: true, pph23: true, pph22Marketplace: false, pphFinal42: 'none' },
    notes: 'Pembayaran via transfer bank dalam 14 hari kerja.',
  }))

  // Derived: validation + totals
  const parsed = safeParse(invoice)
  const totals = React.useMemo(() => computeTotals(invoice.items, invoice.taxConfig), [invoice.items, invoice.taxConfig])

  const update = React.useCallback((patch) => {
    setInvoice(prev => ({ ...prev, ...patch }))
  }, [])

  const resetAll = () => {
    if (!confirm('Reset semua field invoice? Data tidak bisa dikembalikan.')) return
    setInvoice({
      invoiceNo: defaultInvoiceNo(),
      issueDate: todayISO(),
      dueDate: '',
      seller: { name: '', npwp: '', address: '', city: '' },
      buyer: { name: '', npwp: '', address: '', city: '' },
      items: [{ ...emptyItem() }],
      taxConfig: { isPkp: true, pph23: false, pph22Marketplace: false, pphFinal42: 'none' },
      notes: '',
    })
  }

  const downloadPdf = async () => {
    if (!parsed.success) {
      alert('Data invoice belum lengkap/benar:\n' + parsed.error.issues.map(i => `- ${i.path.join('.')}: ${i.message}`).join('\n'))
      return
    }
    await generateInvoicePdf(parsed.data, totals)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">InvoicePajak</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Generator Invoice + Pajak Otomatis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost !p-2" title="Ganti tema" aria-label="Ganti tema">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={resetAll} className="btn-ghost !p-2" title="Reset" aria-label="Reset invoice">
              <RotateCcw size={18} />
            </button>
            <button onClick={downloadPdf} className="btn-primary">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: Form */}
          <section className="space-y-4">
            <InvoiceForm invoice={invoice} update={update} totals={totals} />
          </section>
          {/* RIGHT: Preview */}
          <section className="lg:sticky lg:top-20 lg:self-start">
            <InvoicePreview invoice={invoice} totals={totals} />
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Dibuat untuk WP Indonesia · Tarif PPN 12% & PPh sesuai regulasi 2026 ·
          Data diproses 100% di browser, tidak ada yang dikirim ke server.
        </p>
      </footer>
    </div>
  )
}

function safeParse(inv) {
  try { return { success: true, data: InvoiceSchema.parse(inv) } }
  catch (e) { return { success: false, error: e } }
}
