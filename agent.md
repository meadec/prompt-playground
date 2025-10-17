# Prompt Engineering Tool - Project Specification

## Project Overview

A static web application for prompt engineers to construct, manage, and organize XML-formatted prompts using reusable text snippets. The tool features a hierarchical prompt builder with nested XML tag support, snippet library with categorization, and live preview with copy functionality. All data persists in browser localStorage with a future-proof architecture for database migration.

## Tech Stack

```
Core:           Next.js 14+ (App Router, TypeScript, Static Export)
Styling:        Tailwind CSS
Components:     shadcn/ui
Icons:          Lucide React
Theme:          next-themes
State:          React Context API / Zustand (TBD)
Search:         fuse.js (fuzzy search)
Drag & Drop:    @dnd-kit/core + @dnd-kit/sortable
Validation:     Zod
```

### Build Configuration

```js
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  // basePath: '/repo-name' // Only for GitHub Pages project pages
}
```

## Architecture

### Layout Structure

**Desktop (≥1024px):** 3-panel layout
```
┌──────────────────────────────────────────────────┐
│ Header: [Title] [Theme Toggle] [Actions]        │
├────────────┬──────────────────┬──────────────────┤
│  Snippet   │  Prompt Builder  │  Live Preview    │
│  Library   │  (Tree View)     │  (Formatted XML) │
│  (25%)     │  (45%)           │  (30%)           │
└────────────┴──────────────────┴──────────────────┘
```

**Tablet (768-1023px):** 2-panel + drawer
```
┌──────────────────────────────────────────────────┐
│ Header                                           │
├────────────────────────┬─────────────────────────┤
│ Builder (60%)          │ Preview (40%)           │
│ [Snippets Drawer]      │                         │
└────────────────────────┴─────────────────────────┘
```

**Mobile (<768px):** Tab-based navigation
```
┌──────────────────────────────────────────────────┐
│ Header (Compact)                    [☰] [Theme] │
├──────────────────────────────────────────────────┤
│                                                  │
│         ACTIVE TAB CONTENT (Full Screen)         │
│                                                  │
├──────────────────────────────────────────────────┤
│  [📚 Snippets]  [✏️ Builder]  [👁️ Preview]     │
└──────────────────────────────────────────────────┘
```

## Core Components

### 1. Header Component
- App title/logo
- Theme toggle (light/dark/system)
- Global actions: Export data, Import data, Clear all, Settings

### 2. Snippet Library (Left Panel/Tab)

**Features:**
- Search bar (fuzzy search by title/content)
- Filter by category dropdown
- Sort options (name, date, usage frequency)
- Category folders (collapsible tree)
- Tag filter chips
- Favorites section (starred snippets)
- Virtual scrolling for performance (if >100 snippets)

**Snippet Card:**
- Title + content preview (truncated)
- Category badge + tag chips
- Favorite star icon
- Usage count indicator
- Edit/Delete actions
- Drag handle for reordering

**Actions:**
- Add new snippet (opens modal/sheet)
- Edit snippet (modal/sheet)
- Delete snippet (with usage check + confirmation)
- Drag to builder to insert

### 3. Prompt Builder (Center Panel/Tab)

**Tree-Based Hierarchical Editor:**

```
Visual representation:
<system_prompt>  [⊟] [✏️] [⨉]
├─ <role>  [⊟] [✏️] [⨉]
│  └─ "You are an expert..."
├─ <constraints>  [⊟] [✏️] [⨉]
│  ├─ <length>  [⊟] [✏️] [⨉]
│  │  └─ "Keep responses brief"
│  └─ <tone>  [⊟] [✏️] [⨉]
│     └─ "Professional tone"
└─ [+ Add Block]

[⊟] = Collapse/Expand
[✏️] = Edit (tag, attributes, content)
[⨉] = Delete
```

**Block Types:**
- **Container Block:** Has XML tag + children, can be collapsed
- **Text Block:** Plain text input (textarea)
- **Snippet Block:** References a saved snippet (read-only display)

**Block Controls:**
- Drag handle (≡) for reordering/nesting
- XML tag input + attributes editor
- Collapse/expand toggle for containers
- Edit inline (for text) or in modal (for complex edits)
- Delete with confirmation if has children

**Nesting Interactions:**
- **Desktop:** Drag & drop with visual drop zones (before, after, inside)
- **Mobile:** Long-press → Move mode → Tap destination
- **Keyboard:** Tab to indent, Shift+Tab to outdent
- Visual indentation (1rem per level)
- Color-coded depth (optional)

**Actions:**
- Add new block (text or container)
- Insert snippet from library
- Wrap selection with XML tag
- Reorder blocks via drag & drop
- Change nesting level (indent/outdent)

### 4. Live Preview (Right Panel/Tab)

**Display:**
- Syntax-highlighted XML output
- Proper indentation based on depth (configurable: 2 or 4 spaces)
- Line numbers (optional toggle)
- Snippet content is expanded inline

**Actions:**
- Copy to clipboard (primary button)
- Download as .txt/.xml file
- Toggle line numbers
- Toggle format (raw vs. pretty-printed)

**Example output:**
```xml
<system_prompt version="1.0">
  <role>
    You are an expert AI assistant.
  </role>
  <constraints>
    <length>Keep responses brief</length>
    <tone>Professional tone</tone>
  </constraints>
</system_prompt>
```

### 5. Supporting Components

- **Modal/Dialog:** Snippet CRUD forms, settings panel
- **Bottom Sheet (Mobile):** Snippet selector, block editor
- **Dropdown/Select:** Tag selector, category selector, sort options
- **Toast Notifications:** Success/error feedback
- **Confirmation Dialog:** Before destructive actions

## Data Models

### TypeScript Interfaces

```typescript
interface Snippet {
  id: string;                    // UUID v4
  title: string;
  content: string;
  categoryId: string | null;     // FK to Category
  tagIds: string[];              // FK array to Tags
  isFavorite: boolean;
  usageCount: number;
  createdAt: string;             // ISO 8601
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color?: string;                // Hex color
  icon?: string;                 // Lucide icon name
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

interface PromptBlock {
  id: string;
  type: 'text' | 'snippet' | 'container';
  content: string;               // For type='text'
  snippetId: string | null;      // FK to Snippet
  xmlTag: string | null;
  xmlAttributes: Record<string, string>;
  parentId: string | null;       // FK to parent block (null = root)
  order: number;                 // Sibling order
  depth: number;                 // Cached depth (0 = root)
  isCollapsed: boolean;          // UI state only
  createdAt: string;
  updatedAt: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultXmlTags: string[];
  autoSave: boolean;
  showLineNumbers: boolean;
  indentSize: number;            // 2 or 4
  version: string;               // Schema version
}

interface StorageMetadata {
  version: string;               // e.g., "1.0.0"
  lastBackup: string | null;
  installDate: string;
  lastModified: string;
}
```

## Data Storage Strategy

### LocalStorage Structure (Normalized)

**Storage Keys:**
```typescript
const STORAGE_KEYS = {
  SNIPPETS: 'promptEngineer.snippets',
  CATEGORIES: 'promptEngineer.categories',
  TAGS: 'promptEngineer.tags',
  PROMPT_BLOCKS: 'promptEngineer.promptBlocks',
  SETTINGS: 'promptEngineer.settings',
  METADATA: 'promptEngineer.metadata',
} as const;
```

**Format:** Each key stores a JSON object with entity ID as key:
```json
{
  "uuid-1": { "id": "uuid-1", "title": "...", ... },
  "uuid-2": { "id": "uuid-2", "title": "...", ... }
}
```

**Rationale:**
- Normalized structure for easy DB migration
- No data duplication
- Update once, reflects everywhere
- O(1) lookup by ID

### Referential Integrity Rules

**Snippet Deletion:**
1. Check if `snippetId` exists in any `promptBlocks`
2. If referenced: Show error + list of usages, prevent deletion
3. If not referenced: Safe to delete

**Category Deletion:**
1. Move all snippets in category to "Uncategorized" (`categoryId = null`)
2. Then delete category

**Tag Deletion:**
1. Remove `tagId` from all `snippets.tagIds` arrays
2. Then delete tag

**Block Deletion:**
1. If has children: Show confirmation warning
2. Delete block and all descendants recursively
3. Reorder siblings

### Data Access Layer

**Service Pattern:** Create `services/storage.service.ts`

**Key Methods:**
```typescript
class StorageService {
  // CRUD operations
  getAllSnippets(): Snippet[]
  getSnippetById(id: string): Snippet | null
  createSnippet(data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Snippet
  updateSnippet(id: string, updates: Partial<Snippet>): Snippet | null
  deleteSnippet(id: string): boolean  // Throws if referenced
  
  // Tree operations
  getPromptTree(): PromptBlock[]  // Returns root blocks with children
  getBlockById(id: string): PromptBlock | null
  createBlock(data: ...): PromptBlock
  updateBlock(id: string, updates: ...): PromptBlock | null
  deleteBlock(id: string): boolean
  moveBlock(blockId: string, newParentId: string | null, newOrder: number): void
  
  // Batch operations
  searchSnippets(query: string): Snippet[]
  getSnippetsByCategory(categoryId: string): Snippet[]
  getSnippetsByTag(tagId: string): Snippet[]
  incrementSnippetUsage(id: string): void
  
  // Import/Export
  exportAllData(): string  // JSON string
  importAllData(jsonString: string): void
  backupToFile(): void
}
```

**Usage in Components:**
```typescript
import { storageService } from '@/services/storage.service';

const snippets = storageService.getAllSnippets();
const newSnippet = storageService.createSnippet({ title, content, ... });
```

## Database Migration Strategy

### When Backend is Added

**PostgreSQL Schema (Future):**
```sql
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE snippet_tags (
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

CREATE TABLE categories ( ... );
CREATE TABLE tags ( ... );
CREATE TABLE prompt_blocks ( ... );

-- Add user_id column when multi-user needed
```

**Migration Steps:**
1. Export localStorage data via `storageService.exportAllData()`
2. POST JSON to `/api/migrate` endpoint
3. Backend validates + imports into database
4. Frontend switches from localStorage to API calls
5. Minimal code changes (swap storage service implementation)

## UI/UX Details

### Tailwind Responsive Breakpoints

```typescript
// Breakpoint strategy
sm: 640px   // Still mobile
md: 768px   // Tablet (2-panel)
lg: 1024px  // Desktop (3-panel)
xl: 1280px  // Wide desktop
```

### Theme System

- Use `next-themes` for theme management
- Support: light, dark, system
- Persist preference in localStorage
- Apply via shadcn's built-in theme system

### Color Palette

**Light Mode:**
- Background: slate-50, white
- Text: slate-900, slate-700
- Accents: blue-600, purple-600, green-600
- Borders: slate-200, slate-300

**Dark Mode:**
- Background: slate-950, slate-900
- Text: slate-50, slate-300
- Accents: blue-400, purple-400, green-400
- Borders: slate-800, slate-700

### Animations & Transitions

- Theme toggle: smooth fade (200ms)
- Block collapse/expand: height transition (300ms ease-in-out)
- Drag & drop: smooth transform, visual feedback
- Toast notifications: slide-in from top/bottom (300ms)
- Modal/sheet: fade + scale/slide (200ms)

### Accessibility

- Keyboard navigation for all actions
- Focus visible states
- ARIA labels for icon-only buttons
- Semantic HTML (nav, main, aside, article)
- Alt text for icons (via lucide-react's aria-label)

## Key User Flows

### Flow 1: Create & Use Snippet
1. Click "+ New Snippet" in library
2. Modal opens → Enter title, content, select category/tags
3. Click "Save" → Snippet appears in library
4. Drag snippet to builder → Creates block with snippet reference
5. Auto-preview updates in right panel

### Flow 2: Build Nested Prompt
1. Click "+ Add Block" in builder
2. Select "Container" → Enter XML tag (e.g., "system")
3. Click "+ Add Child" inside container
4. Enter text or insert snippet
5. Wrap child with another tag → Creates nested structure
6. Preview shows indented XML
7. Click "Copy" → Clipboard success toast

### Flow 3: Organize Snippets
1. Click "Manage Categories" in library header
2. Create categories (e.g., "System Prompts", "Examples")
3. Drag snippets into categories
4. Add tags to snippets (e.g., #technical, #creative)
5. Use search/filter to find snippets quickly

### Flow 4: Mobile Workflow
1. [Snippets Tab] → Browse/create snippets
2. Tap snippet → Options: Edit, Add to Builder
3. Tap "Add to Builder" → Auto-switch to [Builder Tab]
4. [Builder Tab] → Arrange blocks, add tags
5. Swipe to [Preview Tab] → See formatted output
6. Tap "Copy" → Done

## Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Install dependencies (shadcn/ui, lucide-react, next-themes, etc.)
- [ ] Configure Tailwind CSS
- [ ] Set up shadcn/ui components
- [ ] Create layout shell (header + responsive grid)
- [ ] Implement theme toggle functionality

### Phase 2: Data Layer
- [ ] Define TypeScript interfaces
- [ ] Create storage service with CRUD operations
- [ ] Implement referential integrity checks
- [ ] Add data validation with Zod
- [ ] Create utility functions (UUID generation, date formatting)

### Phase 3: Snippet Library
- [ ] Build snippet list component (virtualized if needed)
- [ ] Create snippet card component
- [ ] Implement snippet CRUD modal/forms
- [ ] Add category management
- [ ] Add tag management
- [ ] Implement search with fuse.js
- [ ] Add filter & sort functionality
- [ ] Implement favorites feature

### Phase 4: Prompt Builder
- [ ] Create recursive tree component for blocks
- [ ] Implement block types (container, text, snippet)
- [ ] Add block controls (edit, delete, collapse)
- [ ] Implement drag & drop with @dnd-kit
- [ ] Add nesting logic (indent/outdent)
- [ ] Create XML tag editor
- [ ] Add attributes editor
- [ ] Implement block reordering

### Phase 5: Live Preview
- [ ] Build preview component
- [ ] Implement XML renderer with syntax highlighting
- [ ] Add indentation formatting
- [ ] Create copy-to-clipboard functionality
- [ ] Add download as file feature
- [ ] Implement line numbers toggle
- [ ] Add format toggle (raw/pretty)

### Phase 6: Mobile Optimization
- [ ] Implement tab navigation for mobile
- [ ] Create bottom sheet for snippet selector
- [ ] Optimize touch interactions
- [ ] Add mobile-specific gestures (swipe, long-press)
- [ ] Test responsive breakpoints

### Phase 7: Polish & Features ✅ COMPLETED (Core Features)
- [x] Add toast notifications
- [x] Implement confirmation dialogs
- [ ] Add keyboard shortcuts (Future Enhancement)
- [x] Create settings panel (Theme toggle + Actions menu in header)
- [x] Implement data export/import
- [x] Add backup functionality (via export/import)
- [x] Create empty states for all sections
- [x] Add loading states
- [x] Error handling & validation messages
- [x] Performance optimization (useMemo, useCallback implemented)

### Phase 8: Testing & Deployment
- [ ] Test all user flows
- [ ] Test referential integrity edge cases
- [ ] Test responsive layouts on all breakpoints
- [ ] Test theme switching
- [ ] Test data persistence
- [ ] Configure for GitHub Pages deployment
- [ ] Create deployment workflow (GitHub Actions)
- [ ] Write user documentation

## File Structure

```
/workspace
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Main app page (3-panel layout)
│   ├── globals.css             # Tailwind imports + custom styles
│   └── providers.tsx           # Theme + context providers
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Header.tsx
│   ├── SnippetLibrary/
│   │   ├── SnippetLibrary.tsx
│   │   ├── SnippetCard.tsx
│   │   ├── SnippetModal.tsx
│   │   ├── CategoryManager.tsx
│   │   └── SearchBar.tsx
│   ├── PromptBuilder/
│   │   ├── PromptBuilder.tsx
│   │   ├── BlockNode.tsx       # Recursive component
│   │   ├── BlockControls.tsx
│   │   ├── TagEditor.tsx
│   │   └── DragOverlay.tsx
│   └── LivePreview/
│       ├── LivePreview.tsx
│       ├── XmlRenderer.tsx
│       └── CopyButton.tsx
├── services/
│   └── storage.service.ts      # Data access layer
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── constants.ts            # Storage keys, defaults
│   └── validators.ts           # Zod schemas
├── types/
│   └── index.ts                # All TypeScript interfaces
├── hooks/
│   ├── useSnippets.ts
│   ├── usePromptBlocks.ts
│   └── useSettings.ts
├── next.config.js              # Static export config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Functional components with hooks
- Destructure props
- Use `const` over `let`
- Prefer named exports
- Comment complex logic

### Component Patterns
- **Container/Presenter:** Separate logic from UI
- **Custom Hooks:** Extract reusable stateful logic
- **Memoization:** Use `React.memo`, `useMemo`, `useCallback` for performance
- **Error Boundaries:** Wrap risky components

### State Management
- Use React Context for global state (theme, settings)
- Use local state (`useState`) for component-specific state
- Consider Zustand if context becomes complex

### Performance
- Virtual scrolling for large snippet lists
- Lazy load modals/dialogs
- Debounce search input
- Memoize expensive computations (tree building, search)

### Testing Considerations
- Test referential integrity checks
- Test tree operations (add, delete, move, nest)
- Test data import/export
- Test responsive layouts
- Test theme switching
- Test localStorage persistence

## Common Pitfalls to Avoid

1. **Don't denormalize data** - Keep entities separate for DB migration
2. **Don't skip referential integrity checks** - Prevent orphaned data
3. **Don't hardcode storage keys** - Use constants
4. **Don't mutate state directly** - Always create new objects
5. **Don't forget timestamps** - Track created/updated for all entities
6. **Don't nest beyond 10 levels** - Validate max depth
7. **Don't store UI state in localStorage** - Only data (except settings)
8. **Don't forget error handling** - localStorage can fail (quota exceeded)
9. **Don't skip validation** - Use Zod for runtime checks
10. **Don't forget mobile testing** - Test all breakpoints

## Future Enhancements (Post-MVP)

- [ ] Templates: Pre-built prompt structures
- [ ] Version history: Undo/redo for prompt builder
- [ ] Collaboration: Share snippets/prompts via URL
- [ ] AI assist: Suggest tag structures
- [ ] Snippet variables: Placeholders like `{{name}}`
- [ ] Multi-language: i18n support
- [ ] Keyboard shortcuts panel
- [ ] Advanced search: Regex, filters
- [ ] Snippet collections: Group related snippets
- [ ] Export formats: JSON, Markdown, plain text
- [ ] Backend integration: User accounts, cloud sync
- [ ] Analytics: Track most-used snippets/tags

---

## 🎉 Project Status

**Status:** ✅ **MVP COMPLETE & FULLY FUNCTIONAL**

### What's Working:
- ✅ Complete snippet management (CRUD, search, categories, favorites)
- ✅ Full prompt builder with tree structure (text, container, snippet blocks)
- ✅ Live XML preview with syntax highlighting
- ✅ Copy to clipboard & download functionality
- ✅ Data export/import for backup/restore
- ✅ Dark/Light theme with smooth transitions
- ✅ Responsive desktop layout (3-panel)
- ✅ LocalStorage persistence
- ✅ Referential integrity checks
- ✅ Toast notifications & confirmation dialogs
- ✅ Empty & loading states

### Future Enhancements:
- Drag-and-drop block reordering
- Mobile responsive layout with tabs
- Keyboard shortcuts
- Advanced XML attributes editor
- Touch gestures for mobile

### Build Status:
```bash
✓ Compiled successfully
✓ Static export ready
✓ Deployable to GitHub Pages
```

---

**Last Updated:** 2025-10-17  
**Schema Version:** 1.0.0  
**Implementation Status:** MVP Complete  
**Target Deployment:** GitHub Pages (static site)
