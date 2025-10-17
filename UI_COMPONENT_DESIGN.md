# UI Component & Color Palette Design

## shadcn/ui Component Mapping

### 1. Header Component

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Theme Toggle | `dropdown-menu` + custom toggle | 3 options: Light, Dark, System |
| Global Actions Menu | `dropdown-menu` | Export, Import, Clear All, Settings |
| App Title | Custom component | Just text/logo |
| Action Buttons | `button` (variant: ghost) | Icon buttons with tooltips |

**Components Needed:**
- `button`
- `dropdown-menu`
- `tooltip`
- `separator` (for menu dividers)

---

### 2. Snippet Library Panel

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Search Bar | `input` | With search icon from Lucide |
| Filter Dropdown | `select` or `dropdown-menu` | Category filter |
| Sort Options | `dropdown-menu` | Name, Date, Usage |
| Category Folders | `collapsible` + `accordion` | Tree structure |
| Tag Filter Chips | `badge` (variant: secondary) | Removable tags |
| Snippet Cards | `card` | Custom styled cards |
| Favorite Star | `button` (variant: ghost) | Toggle star icon |
| Add Snippet Button | `button` (variant: default) | Primary action |
| Edit/Delete Actions | `dropdown-menu` | 3-dot menu on cards |
| Snippet Modal | `dialog` or `sheet` | Desktop: dialog, Mobile: sheet |
| Category Manager | `dialog` + `tabs` | Manage categories/tags |
| Confirmation Dialog | `alert-dialog` | Before delete actions |
| Empty State | Custom with illustration | When no snippets |

**Components Needed:**
- `input`
- `select`
- `dropdown-menu`
- `collapsible`
- `accordion`
- `badge`
- `card`
- `button`
- `dialog`
- `sheet`
- `alert-dialog`
- `tabs`
- `scroll-area`
- `label`
- `textarea`

---

### 3. Prompt Builder Panel

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Tree Container | `scroll-area` | Scrollable tree view |
| Block Node Cards | `card` (variant: outline) | Nested cards with hover states |
| Collapse/Expand Toggle | `button` (variant: ghost) | Chevron icon |
| Edit Block Button | `button` (variant: ghost) | Pencil icon |
| Delete Block Button | `button` (variant: ghost) | X icon |
| Add Block Button | `button` (variant: outline) | With plus icon |
| Drag Handle | Custom component | Using @dnd-kit |
| Block Type Selector | `select` or `radio-group` | Text, Container, Snippet |
| XML Tag Input | `input` | For tag names |
| Attributes Editor | `dialog` with dynamic inputs | Key-value pairs |
| Text Content Editor | `textarea` | Auto-resize |
| Insert Snippet Menu | `command` or `popover` + `select` | Searchable snippet selector |
| Wrap with Tag Action | `context-menu` | Right-click menu |
| Confirmation (Delete) | `alert-dialog` | When deleting blocks with children |

**Components Needed:**
- `scroll-area`
- `card`
- `button`
- `select`
- `radio-group`
- `input`
- `textarea`
- `dialog`
- `command` (for searchable snippet insert)
- `popover`
- `context-menu`
- `alert-dialog`
- `separator`
- `hover-card` (for preview on hover)

---

### 4. Live Preview Panel

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Preview Container | `card` or `scroll-area` | Code display area |
| Copy Button | `button` (variant: default) | With success toast |
| Download Button | `button` (variant: outline) | Menu for .txt/.xml |
| Settings Toggle | `switch` | Line numbers, format options |
| Settings Dropdown | `dropdown-menu` | Quick settings |
| Code Display | Custom with `pre` + `code` | Syntax highlighting library |
| Toast Notification | `toast` | Copy success, download success |

**Components Needed:**
- `card`
- `scroll-area`
- `button`
- `switch`
- `dropdown-menu`
- `toast`
- `separator`

---

### 5. Mobile Navigation

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Tab Bar | `tabs` | Bottom navigation |
| Hamburger Menu | `sheet` | Side drawer for settings |
| Bottom Sheet | `sheet` | For snippet selector, editors |

**Components Needed:**
- `tabs`
- `sheet`

---

### 6. Forms & Modals

| Functionality | shadcn/ui Component | Notes |
|--------------|---------------------|-------|
| Snippet Create/Edit Form | `dialog` + `form` | Full CRUD form |
| Category/Tag Manager | `dialog` + `form` + `table` | List with inline edit |
| Settings Panel | `dialog` + `form` | App settings |
| Form Labels | `label` | Accessible labels |
| Form Validation | `form` (react-hook-form) | With Zod validation |
| Color Picker (Category) | Custom or `popover` | For category colors |
| Icon Picker (Category) | `command` or `popover` | Searchable icon grid |

**Components Needed:**
- `dialog`
- `form`
- `label`
- `input`
- `textarea`
- `select`
- `checkbox`
- `switch`
- `popover`
- `command`
- `table`

---

## Complete shadcn/ui Components List

### Core Components (Priority 1)
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
```

### Secondary Components (Priority 2)
```bash
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
```

### Advanced Components (Priority 3)
```bash
npx shadcn-ui@latest add command
npx shadcn-ui@latest add context-menu
npx shadcn-ui@latest add hover-card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
```

---

## Color Palette Design

### Design Philosophy
- **Professional & Modern**: Clean, minimal distraction
- **Code-Friendly**: High contrast for XML/code readability
- **Eye Comfort**: Optimized for long prompt engineering sessions
- **Clear Hierarchy**: Distinct colors for different element types
- **Semantic Colors**: Intuitive color meanings

---

### Light Mode Palette

#### Base Colors
```css
/* Backgrounds */
--background: 0 0% 100%;           /* Pure white - main background */
--surface: 240 10% 98%;            /* Slate-50 - cards, panels */
--surface-secondary: 240 5% 96%;   /* Slightly darker cards */

/* Text */
--foreground: 222 47% 11%;         /* Slate-900 - primary text */
--muted-foreground: 215 16% 47%;   /* Slate-600 - secondary text */

/* Borders */
--border: 214 32% 91%;             /* Slate-200 - default borders */
--border-hover: 217 33% 84%;       /* Slate-300 - hover state */
```

#### Interactive Colors
```css
/* Primary Action (Blue) */
--primary: 221 83% 53%;            /* Blue-600 - main CTA */
--primary-hover: 224 76% 48%;      /* Blue-700 - hover */
--primary-light: 213 97% 87%;      /* Blue-200 - backgrounds */

/* Secondary Action (Purple) */
--secondary: 262 83% 58%;          /* Purple-600 - secondary actions */
--secondary-hover: 263 70% 50%;    /* Purple-700 - hover */
--secondary-light: 263 90% 92%;    /* Purple-100 - backgrounds */

/* Success (Green) */
--success: 142 71% 45%;            /* Green-600 - success states */
--success-light: 142 76% 92%;      /* Green-100 - backgrounds */

/* Warning (Amber) */
--warning: 38 92% 50%;             /* Amber-500 - warnings */
--warning-light: 48 96% 89%;       /* Amber-100 - backgrounds */

/* Danger (Red) */
--destructive: 0 84% 60%;          /* Red-500 - delete, errors */
--destructive-light: 0 86% 95%;    /* Red-50 - backgrounds */

/* Info (Cyan) */
--info: 199 89% 48%;               /* Cyan-600 - informational */
--info-light: 195 92% 90%;         /* Cyan-100 - backgrounds */
```

#### Semantic UI Colors
```css
/* Snippet Library */
--snippet-card: 240 10% 98%;       /* Card background */
--snippet-hover: 240 5% 96%;       /* Hover state */
--category-badge: 262 90% 92%;     /* Category badges */
--tag-badge: 213 97% 87%;          /* Tag chips */
--favorite-star: 38 92% 50%;       /* Favorite icon */

/* Prompt Builder */
--block-container: 0 0% 100%;      /* Block background */
--block-border: 214 32% 91%;       /* Block border */
--block-hover: 213 97% 97%;        /* Hover background */
--block-selected: 213 97% 92%;     /* Selected/focus state */
--xml-tag: 262 83% 58%;            /* XML tag names */
--xml-attribute: 199 89% 48%;      /* Attribute names */
--xml-value: 142 71% 45%;          /* Attribute values */
--nesting-guide: 214 32% 91%;      /* Indentation guides */

/* Preview Panel */
--preview-bg: 222 47% 11%;         /* Dark code background */
--preview-text: 210 40% 98%;       /* Light code text */
--line-number: 215 16% 47%;        /* Line numbers */
--syntax-tag: 280 100% 70%;        /* XML tags in preview */
--syntax-attribute: 188 90% 55%;   /* Attributes in preview */
--syntax-value: 113 70% 65%;       /* Values in preview */
--syntax-text: 210 40% 98%;        /* Content text */
```

---

### Dark Mode Palette

#### Base Colors
```css
/* Backgrounds */
--background: 222 47% 11%;         /* Slate-900 - main background */
--surface: 217 33% 17%;            /* Slate-800 - cards, panels */
--surface-secondary: 215 28% 20%;  /* Slate-750 - secondary surfaces */

/* Text */
--foreground: 210 40% 98%;         /* Slate-50 - primary text */
--muted-foreground: 215 20% 65%;   /* Slate-400 - secondary text */

/* Borders */
--border: 217 33% 24%;             /* Slate-700 - default borders */
--border-hover: 215 28% 30%;       /* Slate-650 - hover state */
```

#### Interactive Colors
```css
/* Primary Action (Blue) */
--primary: 213 94% 68%;            /* Blue-400 - main CTA */
--primary-hover: 217 91% 60%;      /* Blue-500 - hover */
--primary-light: 221 83% 25%;      /* Blue-900/30 - backgrounds */

/* Secondary Action (Purple) */
--secondary: 270 91% 75%;          /* Purple-400 - secondary actions */
--secondary-hover: 263 85% 70%;    /* Purple-500 - hover */
--secondary-light: 262 83% 25%;    /* Purple-900/30 - backgrounds */

/* Success (Green) */
--success: 142 76% 60%;            /* Green-400 - success states */
--success-light: 142 71% 20%;      /* Green-900/30 - backgrounds */

/* Warning (Amber) */
--warning: 38 92% 60%;             /* Amber-400 - warnings */
--warning-light: 38 92% 20%;       /* Amber-900/30 - backgrounds */

/* Danger (Red) */
--destructive: 0 72% 65%;          /* Red-400 - delete, errors */
--destructive-light: 0 84% 25%;    /* Red-900/30 - backgrounds */

/* Info (Cyan) */
--info: 191 91% 65%;               /* Cyan-400 - informational */
--info-light: 199 89% 20%;         /* Cyan-900/30 - backgrounds */
```

#### Semantic UI Colors
```css
/* Snippet Library */
--snippet-card: 217 33% 17%;       /* Card background */
--snippet-hover: 215 28% 20%;      /* Hover state */
--category-badge: 262 83% 25%;     /* Category badges */
--tag-badge: 221 83% 25%;          /* Tag chips */
--favorite-star: 38 92% 60%;       /* Favorite icon */

/* Prompt Builder */
--block-container: 217 33% 17%;    /* Block background */
--block-border: 217 33% 24%;       /* Block border */
--block-hover: 215 28% 20%;        /* Hover background */
--block-selected: 221 83% 25%;     /* Selected/focus state */
--xml-tag: 270 91% 75%;            /* XML tag names */
--xml-attribute: 191 91% 65%;      /* Attribute names */
--xml-value: 142 76% 60%;          /* Attribute values */
--nesting-guide: 217 33% 24%;      /* Indentation guides */

/* Preview Panel */
--preview-bg: 222 47% 8%;          /* Even darker code background */
--preview-text: 210 40% 98%;       /* Light code text */
--line-number: 215 20% 50%;        /* Line numbers */
--syntax-tag: 280 100% 75%;        /* XML tags in preview */
--syntax-attribute: 188 90% 65%;   /* Attributes in preview */
--syntax-value: 113 70% 70%;       /* Values in preview */
--syntax-text: 210 40% 98%;        /* Content text */
```

---

## Tailwind CSS Configuration

### Extended Theme
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          light: "hsl(var(--secondary-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          light: "hsl(var(--destructive-light))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
        },
        snippet: {
          card: "hsl(var(--snippet-card))",
          hover: "hsl(var(--snippet-hover))",
        },
        block: {
          container: "hsl(var(--block-container))",
          border: "hsl(var(--block-border))",
          hover: "hsl(var(--block-hover))",
          selected: "hsl(var(--block-selected))",
        },
        syntax: {
          tag: "hsl(var(--syntax-tag))",
          attribute: "hsl(var(--syntax-attribute))",
          value: "hsl(var(--syntax-value))",
          text: "hsl(var(--syntax-text))",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-in",
      },
    },
  },
}
```

---

## Component Variant Recommendations

### Button Variants by Use Case
```typescript
// Primary Actions
<Button variant="default">Save Snippet</Button>
<Button variant="default">Copy to Clipboard</Button>

// Secondary Actions
<Button variant="outline">Cancel</Button>
<Button variant="outline">Add Block</Button>

// Icon-only Actions
<Button variant="ghost" size="icon">
  <Pencil className="h-4 w-4" />
</Button>

// Destructive Actions
<Button variant="destructive">Delete Snippet</Button>

// Subtle Actions
<Button variant="ghost">Edit</Button>
<Button variant="link">Learn More</Button>
```

### Badge Variants by Use Case
```typescript
// Categories
<Badge variant="secondary" className="bg-secondary-light">
  System Prompts
</Badge>

// Tags
<Badge variant="outline" className="bg-primary-light border-primary">
  #technical
</Badge>

// Status Indicators
<Badge variant="default" className="bg-success-light text-success">
  Active
</Badge>

// Usage Count
<Badge variant="secondary">
  Used 12 times
</Badge>
```

### Card Variants by Use Case
```typescript
// Snippet Cards
<Card className="hover:bg-snippet-hover transition-colors">

// Block Nodes
<Card 
  className="border-block-border hover:border-primary"
  data-selected={isSelected}
>

// Preview Container
<Card className="bg-preview-bg text-preview-text font-mono">
```

---

## Accessibility Considerations

### Focus States
```css
/* All interactive elements */
.focus-visible:focus {
  @apply ring-2 ring-primary ring-offset-2 ring-offset-background;
}

/* Dark mode adjustments */
.dark .focus-visible:focus {
  @apply ring-offset-slate-900;
}
```

### Color Contrast Ratios
- **Text on Background**: 7:1 (AAA)
- **Interactive Elements**: 4.5:1 minimum (AA)
- **Borders**: 3:1 minimum
- **Syntax Highlighting**: Optimized for readability

### ARIA Labels
```typescript
<Button aria-label="Delete snippet" variant="ghost">
  <Trash2 className="h-4 w-4" />
</Button>

<Input 
  aria-label="Search snippets" 
  placeholder="Search..."
/>
```

---

## Design Patterns

### Panel Layouts
```typescript
// Desktop 3-panel (lg+)
<div className="hidden lg:grid lg:grid-cols-[25%_45%_30%] gap-4">
  <SnippetLibrary />
  <PromptBuilder />
  <LivePreview />
</div>

// Tablet 2-panel (md-lg)
<div className="hidden md:grid lg:hidden md:grid-cols-[60%_40%] gap-4">
  <div>
    <Sheet>...</Sheet> {/* Snippets Drawer */}
    <PromptBuilder />
  </div>
  <LivePreview />
</div>

// Mobile tabs (below md)
<Tabs defaultValue="snippets" className="md:hidden">
  <TabsList className="grid grid-cols-3">
    <TabsTrigger value="snippets">Snippets</TabsTrigger>
    <TabsTrigger value="builder">Builder</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
  </TabsList>
</Tabs>
```

### Drag & Drop Styling
```css
/* Draggable item */
.draggable {
  @apply cursor-grab active:cursor-grabbing;
  @apply transition-transform hover:scale-[1.02];
}

/* Drop zones */
.drop-zone {
  @apply border-2 border-dashed border-transparent;
  @apply transition-colors;
}

.drop-zone-active {
  @apply border-primary bg-primary-light;
}

/* Drag overlay */
.drag-overlay {
  @apply opacity-80 rotate-3 shadow-2xl;
}
```

---

## Summary

### Best Practices
1. **Consistent Spacing**: Use Tailwind's spacing scale (4px base)
2. **Color Hierarchy**: Primary (blue) > Secondary (purple) > Tertiary (neutral)
3. **Interactive Feedback**: Hover states, active states, loading states
4. **Responsive Typography**: Base 16px, scale with viewport
5. **Motion**: Use transitions for state changes, avoid excessive animation
6. **Loading States**: Skeleton screens, spinners, progressive rendering

### Component Priority
**Phase 1 (MVP):**
- Button, Card, Input, Dialog, Toast, Scroll Area

**Phase 2 (Core Features):**
- Sheet, Tabs, Select, Badge, Dropdown Menu, Alert Dialog

**Phase 3 (Polish):**
- Command, Tooltip, Context Menu, Hover Card, Table

This design system provides a cohesive, accessible, and scalable foundation for the prompt engineering tool.
