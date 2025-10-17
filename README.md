# ✨ Prompt Engineer Tool

A modern, elegant, and fully responsive Next.js web application for constructing XML-based prompts from reusable text snippets. Built for prompt engineers to manage and compose complex prompts efficiently on any device.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🗂️ Snippet Library
- **Create, Edit, Delete** reusable text snippets
- **Search** snippets by title or content
- **Organize** with categories and tags
- **Favorite** frequently used snippets
- **Track usage** statistics for each snippet

### 🏗️ Prompt Builder
- **Hierarchical tree structure** for complex prompts
- **Three block types:**
  - **Text blocks** - Direct text content
  - **Container blocks** - XML tags with nested children
  - **Snippet blocks** - Reference saved snippets
- **Collapsible sections** for better organization
- **XML tag editing** with custom tags and attributes
- **Nested structure** support with visual depth indicators

### 👁️ Live Preview
- **Real-time XML rendering** with syntax highlighting
- **Customizable formatting:**
  - Toggle line numbers
  - Adjustable indent size (2 or 4 spaces)
- **Export options:**
  - Copy to clipboard
  - Download as .txt or .xml file

### 🎨 Modern UI/UX
- **Beautiful light and dark themes** with smooth transitions
- **Fully responsive** design (desktop, tablet, mobile)
- **Accessible** with keyboard navigation and ARIA labels
- **Toast notifications** for user feedback
- **Confirmation dialogs** for destructive actions

### 💾 Data Management
- **Local storage** - All data persists in browser
- **Export/Import** - Backup and restore your data
- **Referential integrity** - Prevents orphaned data
- **Clear all** option with safety confirmation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd workspace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, ready for deployment.

## 📦 Deployment

### GitHub Pages (Recommended - Automated)

This project includes a GitHub Actions workflow for automatic deployment!

**Quick Start:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Enable GitHub Pages in repository settings
# Settings → Pages → Source: "GitHub Actions"

# 3. Done! Your site deploys automatically
# https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions**

### Other Static Hosts

Deploy the `out/` directory to any static hosting service:
- **Vercel** - `npx vercel --prod`
- **Netlify** - Drag & drop `out/` folder
- **Cloudflare Pages** - Connect GitHub repo
- **AWS S3** - Upload `out/` to S3 bucket

## 🛠️ Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Unstyled, accessible primitives
- **Lucide React** - Modern icon library
- **next-themes** - Theme management

### State & Data
- **React Context API** - Global state management
- **Zustand** - Optional lightweight state management
- **Zod** - Runtime type validation
- **LocalStorage** - Browser-based data persistence

### Utilities
- **uuid** - Unique ID generation
- **clsx + tailwind-merge** - Conditional class names

## 📂 Project Structure

```
workspace/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main app page
│   └── globals.css          # Global styles + theme colors
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Header.tsx           # App header with actions
│   ├── SnippetLibrary/      # Snippet management components
│   ├── PromptBuilder/       # Prompt builder components
│   └── LivePreview/         # XML preview components
├── services/
│   └── storage.service.ts   # LocalStorage data layer
├── hooks/
│   ├── use-snippets.ts      # Snippet state management
│   ├── use-categories.ts    # Category state management
│   ├── use-prompt-blocks.ts # Block state management
│   └── use-toast.ts         # Toast notifications
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── constants.ts         # App constants
│   ├── validators.ts        # Zod schemas
│   └── xml-generator.ts     # XML generation logic
├── types/
│   └── index.ts             # TypeScript interfaces
└── agent.md                 # Project specification
```

## 🎯 Usage Guide

### 1. Create Snippets

1. Click **"+ New"** in the Snippet Library
2. Enter a title and content
3. (Optional) Assign a category
4. Click **"Create Snippet"**

### 2. Build Prompts

1. Click **"+ Add Block"** in the Prompt Builder
2. Choose block type:
   - **Text** - For direct content
   - **Container** - For XML structure
   - **Snippet** - To reference saved snippets
3. Add XML tags (optional but recommended)
4. Nest blocks by clicking the **"+"** button on container blocks

### 3. Export Prompts

1. View your formatted XML in the **Live Preview** panel
2. Click **"Copy"** to copy to clipboard
3. Or click **"Download"** to save as a file

### 4. Manage Data

- **Export:** Settings menu → "Export Data" (creates a backup JSON)
- **Import:** Settings menu → "Import Data" (restore from backup)
- **Clear:** Settings menu → "Clear All Data" (removes everything)

## 🎨 Theming

The app supports three theme modes:
- **Light** - Clean, bright interface
- **Dark** - Easy on the eyes for long sessions
- **System** - Follows your OS preference

Change themes via the sun/moon icon in the header.

## 🔒 Data Privacy

- **100% client-side** - All data stored in your browser
- **No server** - No data leaves your device
- **No tracking** - No analytics or cookies
- **Exportable** - Full control of your data

## 🚧 Future Enhancements

- [ ] Drag-and-drop block reordering
- [ ] Keyboard shortcuts for power users
- [ ] Template library with pre-built structures
- [ ] Snippet variables/placeholders
- [ ] Version history (undo/redo)
- [ ] Advanced search with regex
- [ ] Backend integration for cloud sync
- [ ] Collaborative editing features

## 📝 License

MIT License - feel free to use this project however you like!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Troubleshooting

### Common Issues

**Snippets not showing:**
- Check if search is active - clear the search box
- Verify you've created snippets (click "+ New")

**Can't delete a snippet:**
- Error means it's being used in prompt builder
- Remove snippet references from blocks first

**Preview is empty:**
- Add blocks to the prompt builder first
- Preview shows only what's in the builder

**Lost data:**
- Data is stored in browser localStorage
- Export regularly for backups
- Import from your last backup to restore

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the `agent.md` file for technical specifications

---

**Built with ❤️ for prompt engineers by the community**
