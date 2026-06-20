# ScriptVault

A focused, local-first screenplay writing app. Write, auto-format, auto-save, and export to a properly formatted PDF — all without a backend.

## Tech stack

- React 19 + Vite
- React Router v7
- Context API (Auth, Theme, Scripts)
- Tailwind CSS v4
- Custom contentEditable screenplay editor (scene heading / action / character / dialogue / parenthetical / transition formatting)
- jsPDF for industry-format PDF export
- IndexedDB (via `idb`) for script storage + localStorage for instant draft recovery and session/theme state
- react-hot-toast for notifications

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## How storage works

- **IndexedDB** (`scriptStore.js`) is the source of truth for full script content — it scales far better than localStorage for large documents.
- **localStorage** mirrors lightweight metadata (title, timestamps) for fast dashboard reads, and stores a synchronous **draft** of in-progress edits (`scriptvault:draft:<id>`) on every keystroke. If the IndexedDB save (debounced to every 5s) hasn't fired yet and the page refreshes/crashes, the editor recovers the newest draft automatically and shows a toast.
- Auth is a **demo, client-only auth layer** (`authService.js`) using localStorage — there's no real backend or password hashing. Swap it for real API calls in one file when you're ready to add a server.

## Project structure

```
src/
├── components/
│   ├── ui/           # Button, Input, Card, Modal, Loading, ErrorBoundary
│   ├── editor/        # ScreenplayEditor, EditorStatusBar
│   ├── dashboard/       # ScriptCard
│   └── layout/           # Sidebar
├── pages/                # Landing, Login, Signup, Dashboard, Editor, Settings, Profile
├── layouts/                # AppLayout (sidebar shell), AuthLayout
├── hooks/                    # useAutoSave, useScriptStats, useDebounce
├── context/                    # AuthContext, ThemeContext, ScriptsContext
├── services/                     # authService, scriptStore (IndexedDB), pdfExport
├── routes/                         # ProtectedRoute
└── utils/, features/                # reserved for growth (see "AI-ready" below)
```

## Keyboard shortcuts (in the editor)

- `Cmd/Ctrl + 1` Scene heading
- `Cmd/Ctrl + 2` Action
- `Cmd/Ctrl + 3` Character
- `Cmd/Ctrl + 4` Dialogue
- `Cmd/Ctrl + 5` Parenthetical
- `Cmd/Ctrl + 6` Transition
- `Enter` after a Character line auto-switches the next line to Dialogue
- `Esc` exits Focus mode

## Designed for AI features later

The `services/` layer is split by concern (`authService`, `scriptStore`, `pdfExport`) specifically so an `aiService.js` can be dropped in alongside them without touching components. Good next steps:

- Add `src/services/aiService.js` wrapping calls to an LLM API.
- Add toolbar buttons in `ScreenplayEditor.jsx` for "Improve scene", "Suggest dialogue", "Generate character", etc., each calling `aiService` and inserting the result via the existing `applyBlockType` / `emitChange` helpers.
- `ScriptsContext` already exposes `updateScript`, so AI edits can reuse the same save path (autosave + IndexedDB) with zero extra plumbing.

## Notes & known simplifications

- Auth is local-only (no server, no hashing) — intended as a UI/UX-complete demo layer.
- The editor is a hand-built contentEditable component rather than a rich-text library, because screenplay formatting (scene headings, character cues, dialogue indents) needed custom block types that general-purpose editors don't model well.
- PDF export parses the screenplay's HTML block types directly into jsPDF text blocks with standard margins (1.5in left / 1in others, 12pt Courier) rather than rasterizing the page, so exported PDFs stay text-selectable and properly paginated.
"# ScriptValut" 
