import React from 'react'
import { Image as ImageIcon, X } from 'lucide-react'

const MAX_LOGO_BYTES = 2_000_000 // 2MB — fleksibel buat logo PNG/JPG asli

export default function BrandingSection({ branding, onChange }) {
  const set = (patch) => {
    if (typeof onChange !== 'function') {
      console.error('[BrandingSection] onChange prop tidak diterima! branding:', patch)
      return
    }
    onChange({ ...branding, ...patch })
  }

  const onPickLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_LOGO_BYTES) {
      alert(`Logo terlalu besar (${(file.size / 1024 / 1024).toFixed(2)} MB). Maksimal ${MAX_LOGO_BYTES / 1_000_000} MB.`)
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      console.log('[BrandingSection] logo loaded', file.name, file.type, `${(file.size / 1024).toFixed(0)}KB`)
      set({ logoDataUrl: reader.result })
    }
    reader.onerror = () => alert('Gagal membaca file logo: ' + (reader.error?.message || 'unknown'))
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    set({ logoDataUrl: '' })
    // reset input value biar bisa upload file yg sama lagi
    const inp = document.getElementById('logo-upload')
    if (inp) inp.value = ''
  }

  return (
    <div className="card p-4">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <ImageIcon size={16} /> Branding Invoice (opsional)
      </h2>
      <p className="mb-3 text-[11px] text-slate-400">
        Logo &amp; nama brand tampil di header invoice (preview &amp; PDF). Diproses lokal di browser, tidak di-upload.
      </p>

      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* Logo preview / upload */}
        <div className="flex items-center gap-3">
          {branding.logoDataUrl ? (
            <div className="relative">
              <img src={branding.logoDataUrl} alt="Logo" className="h-16 w-16 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
              <button
                onClick={removeLogo}
                className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-0.5 text-white shadow hover:bg-rose-600"
                title="Hapus logo"
                aria-label="Hapus logo"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="logo-upload"
              className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-slate-700"
            >
              <ImageIcon size={18} />
              <span className="mt-0.5 text-[9px]">Upload</span>
            </label>
          )}
          <input id="logo-upload" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={onPickLogo} className="hidden" />
        </div>

        {/* Brand name */}
        <div>
          <label className="label">Nama Brand / Perusahaan</label>
          <input
            className="input"
            placeholder="Mis. PT Andalan Jaya"
            value={branding.brandName || ''}
            onChange={(e) => set({ brandName: e.target.value })}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Jika kosong, header akan pakai nama penjual. Logo: PNG/JPG/SVG, maks {MAX_LOGO_BYTES / 1_000_000} MB.
          </p>
        </div>
      </div>
    </div>
  )
}
