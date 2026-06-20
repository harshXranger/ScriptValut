import { jsPDF } from 'jspdf'

// Converts our contentEditable HTML (divs with class scene-heading/action/character/
// dialogue/parenthetical/transition) into a properly-formatted screenplay PDF using
// standard industry margins (1.5in left, 1in others) and Courier 12pt.
export function exportScriptToPDF(script) {
  const doc = new jsPDF({ unit: 'in', format: 'letter' })
  const pageWidth = 8.5
  const pageHeight = 11
  const marginLeft = 1.5
  const marginRight = 1
  const marginTop = 1
  const marginBottom = 1
  const usableWidth = pageWidth - marginLeft - marginRight
  const lineHeight = 12 / 72 * 1.6 // approx 12pt font line height in inches

  doc.setFont('courier', 'normal')
  doc.setFontSize(12)

  let y = marginTop
  let pageNum = 1

  const addPageNumber = () => {
    doc.setFontSize(10)
    doc.text(`${pageNum}.`, pageWidth - marginRight, 0.6, { align: 'right' })
    doc.setFontSize(12)
  }
  addPageNumber()

  const newPage = () => {
    doc.addPage()
    pageNum += 1
    y = marginTop
    addPageNumber()
  }

  const writeBlock = (text, { indentIn = 0, widthIn = usableWidth, upper = false, align = 'left', spaceBefore = 0.16 } = {}) => {
    if (!text || !text.trim()) return
    y += spaceBefore
    const content = upper ? text.toUpperCase() : text
    const lines = doc.splitTextToSize(content, widthIn)
    for (const line of lines) {
      if (y + lineHeight > pageHeight - marginBottom) newPage()
      const x = align === 'right' ? pageWidth - marginRight : marginLeft + indentIn
      doc.text(line, x, y, { align })
      y += lineHeight
    }
  }

  // Parse the HTML content into block elements
  const parser = new DOMParser()
  const docu = parser.parseFromString(script.content || '', 'text/html')
  const nodes = Array.from(docu.body.children)

  if (nodes.length === 0) {
    writeBlock(script.content?.replace(/<[^>]+>/g, '') || '', {})
  }

  for (const node of nodes) {
    const text = node.textContent || ''
    const cls = node.className || ''
    if (cls.includes('scene-heading')) {
      writeBlock(text, { upper: true, spaceBefore: 0.28 })
    } else if (cls.includes('character')) {
      writeBlock(text, { indentIn: 2.2, widthIn: 2.5, upper: true, spaceBefore: 0.2 })
    } else if (cls.includes('parenthetical')) {
      writeBlock(text, { indentIn: 1.7, widthIn: 2, spaceBefore: 0.02 })
    } else if (cls.includes('dialogue')) {
      writeBlock(text, { indentIn: 1, widthIn: 3.5, spaceBefore: 0.02 })
    } else if (cls.includes('transition')) {
      writeBlock(text, { align: 'right', upper: true, spaceBefore: 0.2 })
    } else {
      writeBlock(text, { spaceBefore: 0.16 })
    }
  }

  doc.save(`${(script.title || 'script').replace(/[^a-z0-9-_ ]/gi, '')}.pdf`)
}
