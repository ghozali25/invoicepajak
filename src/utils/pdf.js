/**
 * pdf.js — Generate professional invoice PDF using jsPDF + autotable.
 * Semua proses client-side, tidak ada data yang dikirim ke server.
 */
import { formatIDR, formatDateID, terbilang } from '../format.js'

const BRAND = '#0f57f5'
const TEXT = '#1e293b'
const MUTED = '#64748b'
const LINE = '#e2e8f0'
const SOFT = '#f8fafc'
const DANGER = '#e11d48'

export async function generateInvoicePdf(invoice, totals) {
  const { default: jsPDF } = await import('jspdf')
  const autoTableMod = await import('jspdf-autotable')
  const autoTable = autoTableMod.default || autoTableMod.autoTable || autoTableMod

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const M = 15 // margin
  let y = M

  // ===== Header =====
  doc.setFillColor(BRAND)
  doc.roundedRect(M, y, 10, 10, 2, 2, 'F')
  doc.setTextColor('#ffffff')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('IP', M + 5, y + 6.5, { align: 'center' })

  doc.setTextColor(TEXT)
  doc.setFontSize(18)
  doc.text('INVOICE', M + 14, y + 6)

  doc.setTextColor(MUTED)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('InvoicePajak', M + 14, y + 10.5)

  // Right: invoice meta
  doc.setTextColor(TEXT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(invoice.invoiceNo, W - M, y + 5, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(MUTED)
  doc.text(`Tanggal: ${formatDateID(invoice.issueDate)}`, W - M, y + 10, { align: 'right' })
  if (invoice.dueDate) doc.text(`Jatuh tempo: ${formatDateID(invoice.dueDate)}`, W - M, y + 14.5, { align: 'right' })

  y += 22
  doc.setDrawColor(LINE)
  doc.line(M, y, W - M, y)
  y += 5

  // ===== Parties =====
  const partyBox = (x, title, p) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(MUTED)
    doc.text(title.toUpperCase(), x, y)
    doc.setTextColor(TEXT)
    doc.setFontSize(10)
    doc.text(doc.splitTextToSize(p.name || '—', (W - 3 * M) / 2), x, y + 5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(MUTED)
    let ly = y + 10
    if (p.npwp) { doc.text(`NPWP: ${p.npwp}`, x, ly); ly += 4 }
    if (p.address) { doc.splitTextToSize(p.address, (W - 3 * M) / 2).forEach(t => { doc.text(t, x, ly); ly += 4 }) }
    if (p.city) { doc.text(p.city, x, ly); ly += 4 }
    if (title.includes('PENJUAL') && invoice.taxConfig?.isPkp) {
      doc.setTextColor('#047857')
      doc.setFont('helvetica', 'bold')
      doc.text('[PKP]', x, ly + 1)
    }
  }
  partyBox(M, 'Dari / Penjual', invoice.seller)
  partyBox(W / 2 + M / 2, 'Kepada / Pembeli', invoice.buyer)
  y += 28

  // ===== Items table =====
  autoTable(doc, {
    startY: y,
    head: [['#', 'Deskripsi', 'Tipe', 'Qty', 'Satuan', 'Harga', 'Jumlah']],
    body: invoice.items.map((it, i) => [
      String(i + 1),
      it.desc || '—',
      it.type,
      String(it.qty),
      it.unit || '',
      formatIDR(it.price),
      formatIDR((Number(it.qty) || 0) * (Number(it.price) || 0)),
    ]),
    theme: 'striped',
    headStyles: { fillColor: hex(BRAND), textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.5, textColor: hex(TEXT) },
    alternateRowStyles: { fillColor: hex(SOFT) },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 12, halign: 'right' },
      4: { cellWidth: 16 },
      5: { cellWidth: 26, halign: 'right' },
      6: { cellWidth: 28, halign: 'right' },
    },
    margin: { left: M, right: M },
  })
  y = doc.lastAutoTable.finalY + 6

  // ===== Totals block (right aligned) =====
  const boxW = 80
  const boxX = W - M - boxW
  const rowH = 5.5
  let ty = y
  const trows = [
    { l: 'Subtotal', v: formatIDR(totals.subtotal), muted: true },
  ]
  if (totals.isPkp) {
    trows.push({ l: 'DPP', v: formatIDR(totals.dpp), muted: true })
    trows.push({ l: 'PPN 12%', v: formatIDR(totals.ppn), accent: true })
  }
  trows.push({ l: 'Total Tagihan', v: formatIDR(totals.grossTotal), bold: true })
  totals.pph.breakdown.forEach(b => trows.push({ l: `− ${b.label}`, v: formatIDR(b.amount), danger: true }))
  const tH = trows.length * rowH + 14
  doc.setFillColor(hex(SOFT))
  doc.roundedRect(boxX, ty, boxW, tH, 2, 2, 'F')

  ty += 7
  trows.forEach(r => {
    doc.setTextColor(r.danger ? hex(DANGER) : r.muted ? hex(MUTED) : hex(TEXT))
    doc.setFontSize(8.5)
    doc.setFont('helvetica', r.bold ? 'bold' : 'normal')
    doc.text(r.l, boxX + 4, ty)
    doc.setTextColor(r.danger ? hex(DANGER) : r.accent ? hex(BRAND) : hex(TEXT))
    doc.text(r.v, boxX + boxW - 4, ty, { align: 'right' })
    ty += rowH
  })

  // Net payable final
  doc.setDrawColor(hex(LINE))
  doc.line(boxX + 3, ty - 1, boxX + boxW - 3, ty - 1)
  doc.setTextColor(hex(BRAND))
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Net Diterima', boxX + 4, ty + 4)
  doc.text(formatIDR(totals.netPayable), boxX + boxW - 4, ty + 4, { align: 'right' })

  // ===== Terbilang (left) =====
  doc.setTextColor(hex(MUTED))
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.text(
    `Terbilang: ${capitalize(terbilang(totals.netPayable))} rupiah.`,
    M, y + 10
  )

  y = Math.max(ty + 12, y + tH + 4)

  // ===== Notes =====
  if (invoice.notes) {
    doc.setDrawColor(hex(LINE))
    doc.line(M, y, W - M, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(hex(MUTED))
    doc.text('CATATAN', M, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(hex(TEXT))
    doc.setFontSize(8.5)
    const noteLines = doc.splitTextToSize(invoice.notes, W - 2 * M)
    doc.text(noteLines, M, y + 4.5)
    y += 4.5 + noteLines.length * 4
  }

  // ===== Footer =====
  const pageH = doc.internal.pageSize.getHeight()
  doc.setDrawColor(hex(LINE))
  doc.line(M, pageH - 14, W - M, pageH - 14)
  doc.setTextColor(hex(MUTED))
  doc.setFontSize(7.5)
  doc.text(
    'Dibuat dengan InvoicePajak · Tarif PPN 12% & PPh sesuai regulasi 2026. Dokumen ini dibuat secara elektronik.',
    M, pageH - 9
  )
  doc.setFontSize(6.5)
  doc.text(
    'Catatan: PPh Pasal 22/23/4(2) adalah pajak yang dipotong oleh pihak lain (pembeli). Net diterima = total tagihan dikurangi PPh dipotong.',
    M, pageH - 6
  )

  // Save
  const safeName = (invoice.invoiceNo || 'invoice').replace(/[^\w-]/g, '_')
  doc.save(`${safeName}.pdf`)
}

function hex(h) {
  return h.replace('#', '')
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
