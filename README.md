# InvoicePajak 🧾

> Generator invoice profesional dengan **auto-calculation pajak Indonesia** (PPN 12% & PPh 23/22/4(2)). 100% client-side, no backend, no data storage. Data diproses di browser, tidak ada yang dikirim ke server.

## Fitur

- ✅ **Auto-calc PPN 12%** (DPP = gross / 1.12, sesuai PMK 131/2024 efektif Jan 2025)
- ✅ **Auto-calc PPh**:
  - PPh 23 (2%) — jasa konsultan/manajemen/teknik
  - PPh 22 (0,5%) — penjualan marketplace (PMK 37/2025)
  - PPh Final 4(2) — sewa bangunan 2,5% / sewa tanah 7,5%
- ✅ **Net Payable** otomatis (gross − PPh dipotong)
- ✅ **Live preview** real-time
- ✅ **PDF export** profesional (jsPDF + autotable)
- ✅ **Terbilang** rupiah otomatis
- ✅ **Dark mode**
- ✅ **No persistence** — refresh = reset (privacy by design, UU PDP safe)

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & Deploy

```bash
npm run build    # output: dist/
npm run preview  # test production build locally
```

### Cloudflare Pages
1. Connect repo ini
2. Build command: `npm run build`
3. Output directory: `dist`
4. Done — no env vars, no backend needed.

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 (dark mode `class`) |
| PDF | jsPDF 2.5 + jspdf-autotable |
| Validation | zod 3 |
| Test | vitest 2 |
| Icons | lucide-react |

## Struktur

```
src/
├── App.jsx              # Root: header, layout split-view, state
├── main.jsx             # Entry + ErrorBoundary
├── calc.js              # Tax engine (PPN, PPh) — unit tested
├── calc.test.js         # 17 tests cover all tax scenarios
├── schema.js            # zod schemas + helpers (emptyItem, defaultInvoiceNo)
├── format.js            # IDR currency, tanggal ID, terbilang
├── styles.css           # Tailwind + design tokens (.card/.btn/.input)
├── components/
│   ├── InvoiceForm.jsx  # Seller/Buyer/Items/TaxConfig/Totals/Notes
│   ├── LineItems.jsx    # Dynamic items table
│   ├── TaxConfig.jsx    # PPh toggles
│   ├── TotalsPanel.jsx  # Breakdown ringkasan pajak
│   ├── InvoicePreview.jsx # Live preview
│   └── ErrorBoundary.jsx
└── utils/
    └── pdf.js           # jsPDF professional invoice layout
```

## Tarif Pajak (sesuai regulasi 2026)

| Pajak | Tarif | Dasar Hukum |
|---|---|---|
| PPN | 12% | UU HPP 2021, PMK 131/2024 (efektif Jan 2025) |
| PPh 23 jasa | 2% | PP 51/2008, relevan buat konsultan/manajemen |
| PPh 22 marketplace | 0,5% | PMK 81/2024 jo. PMK 37/2025 |
| PPh Final 4(2) sewa bangunan | 2,5% | PP 34/2017 |
| PPh Final 4(2) sewa tanah | 7,5% | PP 34/2017 |

> Tarif bisa di-parametrize di `src/calc.js` (`TAX_RATES`) kalau perlu adjust.

## Test

```bash
npm test              # run once
npm run test:watch    # watch mode
```

Coverage: round2, calcPpn (PKP/non-PKP), calcSubtotal, calcPph (semua kombinasi), computeTotals integration scenarios.

## Privasi & UU PDP

- Aplikasi **100% client-side** — tidak ada request ke server backend.
- Tidak ada `localStorage` untuk data invoice (hanya tema dark/light).
- Data hilang saat refresh — by design untuk privacy.
- PDF di-generate di browser, tidak ada yang di-upload.

## Roadmap (opsional)
- [ ] QR code pembayaran (e-wallet/VA)
- [ ] Multi-currency (USD, SGD)
- [ ] Logo perusahaan upload (base64 inline)
- [ ] Template warna/branding custom

---

Dibuat untuk WP Indonesia. License: MIT.
