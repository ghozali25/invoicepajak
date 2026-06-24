import { z } from 'zod'

export const PartySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(120),
  npwp: z.string().max(25, 'NPWP maks 25 karakter').optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
})
export const Party = (init = {}) =>
  PartySchema.parse({ name: '', npwp: '', address: '', city: '', ...init })

export const LineItemSchema = z.object({
  id: z.string(),
  desc: z.string().min(1, 'Deskripsi wajib').max(200),
  type: z.enum(['jasa', 'barang']),
  qty: z.coerce.number().positive('Qty harus > 0'),
  unit: z.string().max(20).optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  isMarketplace: z.boolean().optional().default(false),
})

export const CustomPphSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Nama PPh wajib').max(60),
  rate: z.coerce.number().min(0).max(1, 'Tarif maks 100% (1.0)').or(z.coerce.number().min(0).max(100)).optional().default(0),
  enabled: z.boolean().default(true),
})

export const TaxConfigSchema = z.object({
  isPkp: z.boolean().default(true),
  pph23: z.boolean().default(false),
  pph22Marketplace: z.boolean().default(false),
  pphFinal42: z.enum(['none', 'building', 'land']).default('none'),
  customPph: z.array(CustomPphSchema).default([]),
})

export const BrandingSchema = z.object({
  brandName: z.string().max(80).optional().or(z.literal('')),
  logoDataUrl: z.string().optional().or(z.literal('')), // base64 data URL (max ~200KB)
}).partial()

export const InvoiceSchema = z.object({
  invoiceNo: z.string().min(1, 'Nomor invoice wajib'),
  issueDate: z.string(), // ISO yyyy-mm-dd
  dueDate: z.string().optional().or(z.literal('')),
  seller: PartySchema,
  buyer: PartySchema,
  items: z.array(LineItemSchema).min(1, 'Minimal 1 item'),
  taxConfig: TaxConfigSchema,
  notes: z.string().max(500).optional().or(z.literal('')),
  branding: BrandingSchema.default({}),
})

/** Buat default line item kosong */
export function emptyItem() {
  return {
    id: cryptoRandom(),
    desc: '',
    type: 'jasa',
    qty: 1,
    unit: 'unit',
    price: 0,
    isMarketplace: false,
  }
}

/** Buat default custom PPh entry kosong */
export function emptyCustomPph() {
  return {
    id: cryptoRandom(),
    label: 'PPh 21',
    rate: 0, // persen (0-100), di-calc.js di-convert ke fraction
    enabled: true,
  }
}

/** Generate nomor invoice default: INV-YYYYMMDD-XXX */
export function defaultInvoiceNo() {
  const d = new Date()
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `INV-${ymd}-${seq}`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function cryptoRandom() {
  // Prefer crypto kalau ada (browser), fallback Math.random (test/jsdom)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2, 10)
}
