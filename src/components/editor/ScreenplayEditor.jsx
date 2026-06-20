import { useRef, useEffect, useCallback } from 'react'

const BLOCK_TYPES = [
  { key: 'scene-heading', label: 'Scene Heading', shortcut: '⌘1' },
  { key: 'action', label: 'Action', shortcut: '⌘2' },
  { key: 'character', label: 'Character', shortcut: '⌘3' },
  { key: 'dialogue', label: 'Dialogue', shortcut: '⌘4' },
  { key: 'parenthetical', label: 'Parenthetical', shortcut: '⌘5' },
  { key: 'transition', label: 'Transition', shortcut: '⌘6' },
]

// A focused, distraction-free contentEditable screenplay editor. Each paragraph
// is a <div> tagged with a screenplay element class (scene-heading, action,
// character, dialogue, parenthetical, transition) which both the on-screen
// CSS and the PDF exporter understand.
export default function ScreenplayEditor({ content, onChange, fullScreen = false }) {
  const editorRef = useRef(null)
  const isInternalUpdate = useRef(false)

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || ''
    }
    isInternalUpdate.current = false
  }, [content])

  const emitChange = useCallback(() => {
    if (!editorRef.current) return
    isInternalUpdate.current = true
    onChange(editorRef.current.innerHTML)
  }, [onChange])

  const applyBlockType = useCallback((type) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    let node = sel.getRangeAt(0).startContainer
    while (node && node.nodeType !== 1) node = node.parentNode
    while (node && node.parentElement !== editorRef.current && node !== editorRef.current) {
      node = node.parentElement
    }
    if (node && node !== editorRef.current) {
      node.className = type
    }
    emitChange()
  }, [emitChange])

  const handleKeyDown = useCallback((e) => {
    if (e.metaKey || e.ctrlKey) {
      const map = { '1': 'scene-heading', '2': 'action', '3': 'character', '4': 'dialogue', '5': 'parenthetical', '6': 'transition' }
      if (map[e.key]) {
        e.preventDefault()
        applyBlockType(map[e.key])
        return
      }
      if (e.key === 's') {
        e.preventDefault() // saving is automatic; block the browser's save dialog
        return
      }
    }
    if (e.key === 'Enter') {
      // After a character line, default the next line to dialogue (industry convention)
      const sel = window.getSelection()
      if (sel && sel.rangeCount) {
        let node = sel.getRangeAt(0).startContainer
        while (node && node.nodeType !== 1) node = node.parentNode
        if (node && node.className === 'character') {
          setTimeout(() => applyBlockType('dialogue'), 0)
        }
      }
    }
  }, [applyBlockType])

  return (
    <div className={fullScreen ? 'h-full overflow-y-auto' : ''}>
      <div className="sticky top-0 z-10 mb-4 flex flex-wrap gap-1 rounded-xl border border-ink-100 bg-white/90 p-1.5 backdrop-blur dark:border-ink-800 dark:bg-ink-900/90">
        {BLOCK_TYPES.map((b) => (
          <button
            key={b.key}
            onClick={() => applyBlockType(b.key)}
            title={b.shortcut}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="mx-auto">
        <div
          ref={editorRef}
          className="script-page mx-auto rounded-sm shadow-sm outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onKeyDown={handleKeyDown}
          spellCheck
          aria-label="Script editor"
        />
      </div>
    </div>
  )
}
