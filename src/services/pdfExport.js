import { jsPDF } from 'jspdf'

// Maps contentEditable className → jsPDF layout parameters
const BLOCK_CONFIG = {
  'scene-heading':  { indentIn: 0,    widthIn: 6,   upper: true,  bold: true,  spaceBefore: 0.32 },
  'action':         { indentIn: 0,    widthIn: 6,   upper: false, bold: false, spaceBefore: 0.18 },
  'character':      { indentIn: 2.2,  widthIn: 2.5, upper: true,  bold: false, spaceBefore: 0.22 },
  'dialogue':       { indentIn: 1,    widthIn: 3.5, upper: false, bold: false, spaceBefore: 0.04 },
  'parenthetical':  { indentIn: 1.7,  widthIn: 2,   upper: false, bold: false, italic: true, spaceBefore: 0.02 },
  'transition':     { indentIn: 0,    widthIn: 6,   upper: true,  bold: false, align: 'right', spaceBefore: 0.22 },
  'centered':       { indentIn: 0,    widthIn: 6,   upper: false, bold: false, align: 'center', spaceBefore: 0.18 },
  'note':           { indentIn: 0,    widthIn: 6,   upper: false, bold: false, italic: true, spaceBefore: 0.12 },
}

export function exportScriptToPDF(script) {
  const doc   = new jsPDF({ unit: 'in', format: 'letter' })
  const mL    = 1.5, mR = 1, mT = 1, mB = 1
  const pW    = 8.5, pH = 11
  const lh    = 12 / 72 * 1.65
  let y = mT, page = 1

  const addPageNum = () => {
    doc.setFontSize(10)
    doc.text(`${page}.`, pW - mR, 0.6, { align: 'right' })
    doc.setFontSize(12)
  }
  addPageNum()

  const newPage = () => { doc.addPage(); page++; y = mT; addPageNum() }

  const writeLines = (text, { indentIn = 0, widthIn = pW - mL - mR, upper = false, bold = false, italic = false, align = 'left', spaceBefore = 0.18 } = {}) => {
    if (!text?.trim()) return
    y += spaceBefore
    doc.setFont('courier', bold && italic ? 'bolditalic' : bold ? 'bold' : italic ? 'italic' : 'normal')
    const content = upper ? text.toUpperCase() : text
    const usableW = Math.min(widthIn, pW - mL - mR - indentIn)
    const lines   = doc.splitTextToSize(content, usableW)
    for (const line of lines) {
      if (y + lh > pH - mB) newPage()
      const x = align === 'right' ? pW - mR : align === 'center' ? pW / 2 : mL + indentIn
      doc.text(line, x, y, { align })
      y += lh
    }
  }

  doc.setFont('courier', 'normal')
  doc.setFontSize(12)

  // Title page
  doc.text((script.title || 'Untitled').toUpperCase(), pW / 2, pH / 2 - 0.5, { align: 'center' })
  doc.setFontSize(10)
  doc.text('Written with ScriptVault', pW / 2, pH / 2 + 0.2, { align: 'center' })
  doc.addPage(); page++; y = mT; addPageNum()
  doc.setFontSize(12)

  const parser = new DOMParser()
  const docu   = parser.parseFromString(script.content || '', 'text/html')
  for (const node of docu.body.children) {
    const cls  = Array.from(node.classList).find(c => BLOCK_CONFIG[c]) || 'action'
    const conf = BLOCK_CONFIG[cls] || BLOCK_CONFIG['action']
    writeLines(node.textContent, conf)
  }

  doc.save(`${(script.title || 'script').replace(/[^\w\s-]/g, '').trim()}.pdf`)
}
