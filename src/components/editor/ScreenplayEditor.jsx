import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiType, FiSearch, FiMinus, FiPlus, FiRotateCcw, FiRotateCw,
} from 'react-icons/fi'
import {
  MdFormatStrikethrough, MdFormatColorText, MdHighlight,
  MdFormatClear, MdSuperscript, MdSubscript, MdFormatSize,
} from 'react-icons/md'

// ─── Screenplay block types ────────────────────────────────────────────────
const BLOCK_TYPES = [
  { key: 'scene-heading',  label: 'Scene',      shortcut: '⌘1' },
  { key: 'action',         label: 'Action',     shortcut: '⌘2' },
  { key: 'character',      label: 'Character',  shortcut: '⌘3' },
  { key: 'dialogue',       label: 'Dialogue',   shortcut: '⌘4' },
  { key: 'parenthetical',  label: 'Parens',     shortcut: '⌘5' },
  { key: 'transition',     label: 'Transition', shortcut: '⌘6' },
  { key: 'centered',       label: 'Centered',   shortcut: '⌘7' },
  { key: 'note',           label: 'Note',       shortcut: '⌘8' },
]

// ─── Text-color presets ────────────────────────────────────────────────────
const TEXT_COLORS = [
  { hex: '#111111', label: 'Black' },
  { hex: '#ef4444', label: 'Red' },
  { hex: '#f97316', label: 'Orange' },
  { hex: '#eab308', label: 'Yellow' },
  { hex: '#22c55e', label: 'Green' },
  { hex: '#3b82f6', label: 'Blue' },
  { hex: '#a855f7', label: 'Purple' },
  { hex: '#ec4899', label: 'Pink' },
  { hex: '#6b7280', label: 'Gray' },
  { hex: '#ffffff', label: 'White' },
]

// ─── Highlight colors ──────────────────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { hex: '#fef08a', label: 'Yellow' },
  { hex: '#bbf7d0', label: 'Green' },
  { hex: '#bfdbfe', label: 'Blue' },
  { hex: '#fecaca', label: 'Red' },
  { hex: '#e9d5ff', label: 'Purple' },
  { hex: '#fed7aa', label: 'Orange' },
  { hex: '#f9a8d4', label: 'Pink' },
  { hex: 'transparent', label: 'None' },
]

// ─── Font size options ─────────────────────────────────────────────────────
const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32]

// ─── Line spacing options ──────────────────────────────────────────────────
const LINE_SPACINGS = [
  { value: '1.2', label: 'Tight' },
  { value: '1.5', label: 'Normal' },
  { value: '1.65', label: 'Screenplay' },
  { value: '2',   label: 'Double' },
  { value: '2.5', label: 'Wide' },
]

// ─── Letter spacing options ────────────────────────────────────────────────
const LETTER_SPACINGS = [
  { value: '-0.05em', label: 'Tighter' },
  { value: '0em',     label: 'Normal' },
  { value: '0.05em',  label: 'Wide' },
  { value: '0.1em',   label: 'Wider' },
  { value: '0.2em',   label: 'Widest' },
]

// ─── Paragraph spacing (top margin of selected block) ─────────────────────
const PARA_SPACINGS = [
  { value: '0',     label: 'None' },
  { value: '0.5em', label: 'Small' },
  { value: '1em',   label: 'Normal' },
  { value: '1.5em', label: 'Medium' },
  { value: '2em',   label: 'Large' },
  { value: '3em',   label: 'Extra' },
]

// ─── ToolbarButton ─────────────────────────────────────────────────────────
function TBtn({ onClick, active, title, children, className = '' }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick?.() }}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors
        ${active
          ? 'bg-amber-accent text-white'
          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100'}
        ${className}`}
    >
      {children}
    </button>
  )
}

// ─── Dropdown wrapper ──────────────────────────────────────────────────────
function Dropdown({ label, children, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onMouseDown={e => { e.preventDefault(); setOpen(o => !o) }}
        className="flex h-7 items-center gap-1 rounded px-2 text-xs font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
      >
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[130px] animate-pop-in rounded-xl border border-ink-100 bg-white p-1.5 shadow-xl dark:border-ink-800 dark:bg-ink-900">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main Editor ───────────────────────────────────────────────────────────
export default function ScreenplayEditor({ content, onChange, fullScreen = false }) {
  const editorRef   = useRef(null)
  const internalRef = useRef(false)

  // Find/Replace state
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [findText,    setFindText]    = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [findCount,   setFindCount]   = useState(0)

  // Line spacing state (applied to the whole page)
  const [lineSpacing,   setLineSpacingState]   = useState('1.65')
  const [letterSpacing, setLetterSpacingState] = useState('0em')
  const [fontSize,      setFontSizeState]      = useState(12)

  // Sync external content → DOM without clobbering cursor
  useEffect(() => {
    if (editorRef.current && !internalRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || ''
    }
    internalRef.current = false
  }, [content])

  const emit = useCallback(() => {
    if (!editorRef.current) return
    internalRef.current = true
    onChange(editorRef.current.innerHTML)
  }, [onChange])

  // ── execCommand helpers (still works great for contentEditable) ──────────
  const exec = useCallback((cmd, value = null) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    emit()
  }, [emit])

  // ── Screenplay block type ────────────────────────────────────────────────
  const applyBlockType = useCallback((type) => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    let node = sel.getRangeAt(0).startContainer
    while (node && node.nodeType !== 1) node = node.parentNode
    while (node && node.parentElement !== editorRef.current && node !== editorRef.current) {
      node = node.parentElement
    }
    if (node && node !== editorRef.current) node.className = type
    emit()
  }, [emit])

  // ── Case transformations ─────────────────────────────────────────────────
  const applyCase = useCallback((mode) => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    const text  = range.toString()
    let result  = ''
    if (mode === 'upper')   result = text.toUpperCase()
    else if (mode === 'lower') result = text.toLowerCase()
    else if (mode === 'title')
      result = text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    else if (mode === 'small-caps') {
      // Wrap selection in a span with font-variant: small-caps
      const span = document.createElement('span')
      span.style.fontVariant = 'small-caps'
      try { range.surroundContents(span) } catch {}
      emit(); return
    } else if (mode === 'sentence')
      result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    else result = text
    range.deleteContents()
    range.insertNode(document.createTextNode(result))
    emit()
  }, [emit])

  // ── Paragraph spacing ────────────────────────────────────────────────────
  const applyParaSpacing = useCallback((value) => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    let node = sel.getRangeAt(0).startContainer
    while (node && node.nodeType !== 1) node = node.parentNode
    while (node && node.parentElement !== editorRef.current) node = node.parentElement
    if (node && node !== editorRef.current) node.style.marginTop = value
    emit()
  }, [emit])

  // ── Indent / outdent ─────────────────────────────────────────────────────
  const applyIndent = useCallback((dir) => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    let node = sel.getRangeAt(0).startContainer
    while (node && node.nodeType !== 1) node = node.parentNode
    while (node && node.parentElement !== editorRef.current) node = node.parentElement
    if (node && node !== editorRef.current) {
      const cur = parseFloat(node.style.marginLeft || 0)
      node.style.marginLeft = `${Math.max(0, cur + (dir === 'in' ? 24 : -24))}px`
    }
    emit()
  }, [emit])

  // ── Insert soft-return space paragraph ──────────────────────────────────
  const insertSpace = useCallback((numLines = 1) => {
    editorRef.current?.focus()
    for (let i = 0; i < numLines; i++) {
      const br  = document.createElement('br')
      const sel = window.getSelection()
      if (sel && sel.rangeCount) {
        const r = sel.getRangeAt(0)
        r.deleteContents()
        r.insertNode(br)
        r.setStartAfter(br)
        r.collapse(true)
        sel.removeAllRanges()
        sel.addRange(r)
      }
    }
    emit()
  }, [emit])

  // ── Line / letter / font-size apply to page ──────────────────────────────
  const setLineSpacing = useCallback((v) => {
    setLineSpacingState(v)
    if (editorRef.current) editorRef.current.style.lineHeight = v
    emit()
  }, [emit])

  const setLetterSpacing = useCallback((v) => {
    setLetterSpacingState(v)
    if (editorRef.current) editorRef.current.style.letterSpacing = v
    emit()
  }, [emit])

  const setFontSize = useCallback((v) => {
    setFontSizeState(v)
    if (editorRef.current) editorRef.current.style.fontSize = `${v}pt`
    emit()
  }, [emit])

  // ── Find & Replace ───────────────────────────────────────────────────────
  const doFind = useCallback(() => {
    if (!editorRef.current || !findText) return
    // Remove prior highlights
    editorRef.current.querySelectorAll('.find-highlight').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent))
    })
    editorRef.current.normalize()

    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT)
    const regex  = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const nodes  = []
    let n
    while ((n = walker.nextNode())) nodes.push(n)

    let count = 0
    nodes.forEach(textNode => {
      const text    = textNode.textContent
      const parts   = text.split(regex)
      const matches = text.match(regex)
      if (!matches) return
      const frag = document.createDocumentFragment()
      parts.forEach((part, i) => {
        frag.appendChild(document.createTextNode(part))
        if (i < matches.length) {
          const span = document.createElement('span')
          span.className = 'find-highlight'
          span.textContent = matches[i]
          frag.appendChild(span)
          count++
        }
      })
      textNode.replaceWith(frag)
    })
    setFindCount(count)
    emit()
  }, [findText, emit])

  const doReplaceAll = useCallback(() => {
    if (!editorRef.current) return
    editorRef.current.querySelectorAll('.find-highlight').forEach(el => {
      el.textContent = replaceText
      el.classList.remove('find-highlight')
    })
    setFindCount(0)
    emit()
  }, [replaceText, emit])

  const clearHighlights = useCallback(() => {
    editorRef.current?.querySelectorAll('.find-highlight').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent))
    })
    editorRef.current?.normalize()
    setFindCount(0)
    emit()
  }, [emit])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    const mod = e.metaKey || e.ctrlKey

    if (mod) {
      const blockMap = { '1':'scene-heading','2':'action','3':'character','4':'dialogue','5':'parenthetical','6':'transition','7':'centered','8':'note' }
      if (blockMap[e.key]) { e.preventDefault(); applyBlockType(blockMap[e.key]); return }

      if (e.key === 'f') { e.preventDefault(); setShowFindReplace(o => !o); return }
      if (e.key === 's') { e.preventDefault(); return } // auto-save handles it
      if (e.key === 'b') { e.preventDefault(); exec('bold'); return }
      if (e.key === 'i') { e.preventDefault(); exec('italic'); return }
      if (e.key === 'u') { e.preventDefault(); exec('underline'); return }

      if (e.shiftKey && e.key === 'U') { e.preventDefault(); applyCase('upper'); return }
      if (e.shiftKey && e.key === 'L') { e.preventDefault(); applyCase('lower'); return }
      if (e.shiftKey && e.key === 'T') { e.preventDefault(); applyCase('title'); return }

      if (e.key === ']') { e.preventDefault(); applyIndent('in');  return }
      if (e.key === '[') { e.preventDefault(); applyIndent('out'); return }
    }

    // Auto-switch next line to dialogue after a character line
    if (e.key === 'Enter') {
      const sel = window.getSelection()
      if (sel?.rangeCount) {
        let n = sel.getRangeAt(0).startContainer
        while (n && n.nodeType !== 1) n = n.parentNode
        if (n?.className === 'character') setTimeout(() => applyBlockType('dialogue'), 0)
      }
    }
  }, [applyBlockType, exec, applyCase, applyIndent])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* ═══ PRIMARY TOOLBAR ═══════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 flex flex-col gap-1.5 rounded-2xl border border-ink-100 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur dark:border-ink-800 dark:bg-ink-900/95">

        {/* ROW 1 — Block types */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">Block</span>
          {BLOCK_TYPES.map(b => (
            <button
              key={b.key}
              onMouseDown={e => { e.preventDefault(); applyBlockType(b.key) }}
              title={b.shortcut}
              className="rounded-lg border border-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:border-amber-accent hover:bg-amber-accent/10 hover:text-amber-accent dark:border-ink-700 dark:text-ink-300 dark:hover:border-amber-accent dark:hover:bg-amber-accent/10 dark:hover:text-amber-accent-dark"
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="tb-sep w-full" />

        {/* ROW 2 — Text formatting */}
        <div className="flex flex-wrap items-center gap-0.5">

          {/* Bold / Italic / Underline / Strikethrough */}
          <TBtn onClick={() => exec('bold')}         title="Bold (⌘B)">      <FiBold size={13} /></TBtn>
          <TBtn onClick={() => exec('italic')}       title="Italic (⌘I)">    <FiItalic size={13} /></TBtn>
          <TBtn onClick={() => exec('underline')}    title="Underline (⌘U)"> <FiUnderline size={13} /></TBtn>
          <TBtn onClick={() => exec('strikeThrough')} title="Strikethrough"> <MdFormatStrikethrough size={14} /></TBtn>
          <TBtn onClick={() => exec('superscript')}  title="Superscript">   <MdSuperscript size={14} /></TBtn>
          <TBtn onClick={() => exec('subscript')}    title="Subscript">     <MdSubscript size={14} /></TBtn>

          <div className="tb-sep mx-1" />

          {/* Text color */}
          <Dropdown label={<><MdFormatColorText size={14} /><span className="hidden sm:inline"> Color</span></>}>
            <div className="grid grid-cols-5 gap-1.5 p-1">
              {TEXT_COLORS.map(c => (
                <button
                  key={c.hex}
                  onMouseDown={e => { e.preventDefault(); exec('foreColor', c.hex) }}
                  title={c.label}
                  style={{ background: c.hex, border: c.hex === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                  className="h-5 w-5 rounded-full transition-transform hover:scale-125"
                />
              ))}
            </div>
            <div className="mt-1 flex items-center gap-2 border-t border-ink-100 pt-1.5 dark:border-ink-800">
              <span className="text-[11px] text-ink-400">Custom</span>
              <input type="color" onInput={e => exec('foreColor', e.target.value)} />
            </div>
          </Dropdown>

          {/* Highlight color */}
          <Dropdown label={<><MdHighlight size={14} /><span className="hidden sm:inline"> Highlight</span></>}>
            <div className="grid grid-cols-4 gap-1.5 p-1">
              {HIGHLIGHT_COLORS.map(c => (
                <button
                  key={c.hex}
                  onMouseDown={e => {
                    e.preventDefault()
                    exec('hiliteColor', c.hex === 'transparent' ? 'transparent' : c.hex)
                  }}
                  title={c.label}
                  style={{ background: c.hex === 'transparent' ? '#f3f4f6' : c.hex, border: '1px solid rgba(0,0,0,0.1)' }}
                  className="h-5 w-5 rounded transition-transform hover:scale-125"
                />
              ))}
            </div>
          </Dropdown>

          <div className="tb-sep mx-1" />

          {/* Alignment */}
          <TBtn onClick={() => exec('justifyLeft')}   title="Align left">    <FiAlignLeft size={13} /></TBtn>
          <TBtn onClick={() => exec('justifyCenter')} title="Align center">  <FiAlignCenter size={13} /></TBtn>
          <TBtn onClick={() => exec('justifyRight')}  title="Align right">   <FiAlignRight size={13} /></TBtn>

          <div className="tb-sep mx-1" />

          {/* Undo / Redo */}
          <TBtn onClick={() => exec('undo')} title="Undo (⌘Z)"> <FiRotateCcw size={13} /></TBtn>
          <TBtn onClick={() => exec('redo')} title="Redo (⌘Y)"> <FiRotateCw size={13} /></TBtn>

          {/* Clear formatting */}
          <TBtn onClick={() => exec('removeFormat')} title="Clear formatting"> <MdFormatClear size={14} /></TBtn>

          <div className="tb-sep mx-1" />

          {/* Find & Replace toggle */}
          <TBtn onClick={() => setShowFindReplace(o => !o)} title="Find & Replace (⌘F)" active={showFindReplace}>
            <FiSearch size={13} />
          </TBtn>
        </div>

        <div className="tb-sep w-full" />

        {/* ROW 3 — Case / Spacing / Size */}
        <div className="flex flex-wrap items-center gap-1">

          {/* Case transforms */}
          <Dropdown label={<><FiType size={13} /><span className="ml-1">Case</span></>}>
            <div className="flex flex-col gap-0.5">
              {[
                { mode: 'upper',      label: 'UPPERCASE' },
                { mode: 'lower',      label: 'lowercase' },
                { mode: 'title',      label: 'Title Case' },
                { mode: 'sentence',   label: 'Sentence case' },
                { mode: 'small-caps', label: 'Small Caps' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onMouseDown={e => { e.preventDefault(); applyCase(mode) }}
                  className="rounded-lg px-3 py-1.5 text-left text-xs text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  {label}
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Font size */}
          <Dropdown label={<><MdFormatSize size={14} /><span className="ml-1">{fontSize}pt</span></>}>
            <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
              {FONT_SIZES.map(s => (
                <button
                  key={s}
                  onMouseDown={e => { e.preventDefault(); setFontSize(s) }}
                  className={`rounded-lg px-3 py-1 text-left text-xs ${fontSize === s ? 'bg-amber-accent/10 text-amber-accent' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'}`}
                >
                  {s}pt
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Line spacing */}
          <Dropdown label={`≡  Line`}>
            <div className="flex flex-col gap-0.5">
              {LINE_SPACINGS.map(({ value, label }) => (
                <button
                  key={value}
                  onMouseDown={e => { e.preventDefault(); setLineSpacing(value) }}
                  className={`rounded-lg px-3 py-1 text-left text-xs ${lineSpacing === value ? 'bg-amber-accent/10 text-amber-accent' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'}`}
                >
                  {label} ({value})
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Letter spacing */}
          <Dropdown label="A↔A Letter">
            <div className="flex flex-col gap-0.5">
              {LETTER_SPACINGS.map(({ value, label }) => (
                <button
                  key={value}
                  onMouseDown={e => { e.preventDefault(); setLetterSpacing(value) }}
                  className={`rounded-lg px-3 py-1 text-left text-xs ${letterSpacing === value ? 'bg-amber-accent/10 text-amber-accent' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Paragraph spacing above selected block */}
          <Dropdown label="↕ Spacing">
            <p className="px-3 pt-1 pb-1.5 text-[10px] uppercase tracking-wider text-ink-400">Space above block</p>
            <div className="flex flex-col gap-0.5">
              {PARA_SPACINGS.map(({ value, label }) => (
                <button
                  key={value}
                  onMouseDown={e => { e.preventDefault(); applyParaSpacing(value) }}
                  className="rounded-lg px-3 py-1 text-left text-xs text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  {label}
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Indent */}
          <div className="flex items-center gap-0.5 rounded-lg border border-ink-100 p-0.5 dark:border-ink-800">
            <TBtn onClick={() => applyIndent('out')} title="Decrease indent (⌘[)"> <FiMinus size={12} /></TBtn>
            <span className="px-1 text-[10px] text-ink-400">Indent</span>
            <TBtn onClick={() => applyIndent('in')}  title="Increase indent (⌘])"> <FiPlus size={12} /></TBtn>
          </div>

          {/* Insert space */}
          <Dropdown label="↵ Space">
            <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-ink-400">Insert blank lines</p>
            {[1,2,3,4].map(n => (
              <button
                key={n}
                onMouseDown={e => { e.preventDefault(); insertSpace(n) }}
                className="block w-full rounded-lg px-3 py-1 text-left text-xs text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                {n} line{n > 1 ? 's' : ''}
              </button>
            ))}
          </Dropdown>
        </div>

        {/* ═══ FIND & REPLACE PANEL ═══════════════════════════════════════ */}
        {showFindReplace && (
          <div className="mt-1 flex flex-wrap items-center gap-2 rounded-xl border border-amber-accent/30 bg-amber-accent/5 px-3 py-2">
            <div className="flex flex-1 min-w-[160px] items-center gap-2">
              <FiSearch size={13} className="shrink-0 text-ink-400" />
              <input
                autoFocus
                value={findText}
                onChange={e => setFindText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doFind()}
                placeholder="Find…"
                className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:text-ink-100"
              />
              {findCount > 0 && <span className="shrink-0 text-[11px] text-amber-accent">{findCount} found</span>}
            </div>
            <div className="flex flex-1 min-w-[160px] items-center gap-2 border-l border-ink-200 pl-3 dark:border-ink-700">
              <input
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                placeholder="Replace with…"
                className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:text-ink-100"
              />
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button onMouseDown={e => { e.preventDefault(); doFind() }}
                className="rounded-lg bg-amber-accent px-3 py-1 text-xs font-semibold text-white hover:bg-amber-accent-dark">
                Find
              </button>
              <button onMouseDown={e => { e.preventDefault(); doReplaceAll() }}
                className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800">
                Replace all
              </button>
              <button onMouseDown={e => { e.preventDefault(); clearHighlights(); setShowFindReplace(false) }}
                className="rounded-lg px-2 py-1 text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200">
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ WRITING SURFACE ════════════════════════════════════════════════ */}
      <div
        ref={editorRef}
        className="script-page mx-auto rounded-sm shadow-sm outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onKeyDown={handleKeyDown}
        spellCheck
        style={{ lineHeight: lineSpacing, letterSpacing: letterSpacing, fontSize: `${fontSize}pt` }}
        aria-label="Script editor"
        aria-multiline="true"
      />

      {/* Quick-reference keyboard shortcut legend */}
      <details className="mx-auto w-full max-w-3xl">
        <summary className="cursor-pointer select-none py-1 text-center text-xs text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
          Keyboard shortcuts ▾
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 rounded-xl border border-ink-100 bg-white p-4 text-[11px] dark:border-ink-800 dark:bg-ink-900 sm:grid-cols-3">
          {[
            ['⌘B', 'Bold'], ['⌘I', 'Italic'], ['⌘U', 'Underline'],
            ['⌘1–8', 'Block type'], ['⌘Z / ⌘Y', 'Undo / Redo'],
            ['⌘F', 'Find & Replace'], ['⌘]', 'Indent in'], ['⌘[', 'Indent out'],
            ['⌘⇧U', 'UPPERCASE'], ['⌘⇧L', 'lowercase'], ['⌘⇧T', 'Title Case'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-ink-600 dark:bg-ink-800 dark:text-ink-300">{k}</code>
              <span className="text-ink-500 dark:text-ink-400">{v}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
