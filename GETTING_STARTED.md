# 🚀 Getting Started with Prompt Engineer Tool

## Quick Start (3 steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 First-Time User Guide

### Create Your First Snippet

1. Look at the **left panel** (Snippet Library)
2. Click the **"+ New"** button
3. Fill in:
   - **Title:** e.g., "AI Assistant Role"
   - **Content:** e.g., "You are a helpful AI assistant..."
4. Click **"Create Snippet"**

✅ Your snippet is now saved and searchable!

### Build Your First Prompt

1. Look at the **center panel** (Prompt Builder)
2. Click **"+ Add Block"**
3. Select **"Container"** as the block type
4. Enter XML tag: `system_prompt`
5. Click **"Create Block"**
6. Click the **"+"** button on your container to add a child
7. Select **"Snippet"** and choose your snippet
8. Click **"Create Block"**

✅ Your hierarchical prompt structure is now visible!

### Preview & Export

1. Look at the **right panel** (Live Preview)
2. See your formatted XML with syntax highlighting
3. Click **"Copy"** to copy to clipboard
4. Or click **"Download"** → choose .txt or .xml

✅ Your prompt is ready to use!

---

## 🎨 Customize Your Experience

### Change Theme
- Click the **sun/moon icon** in the top-right
- Choose Light, Dark, or System

### Export Your Data (Backup)
- Click the **gear icon** → "Export Data"
- Saves all snippets, categories, and prompts as JSON

### Import Data (Restore)
- Click the **gear icon** → "Import Data"
- Select your backup JSON file

---

## 📚 Example Workflow

### Scenario: Building a ChatGPT System Prompt

**Step 1: Create Snippets**
```
Snippet 1: "AI Role"
Content: "You are a helpful, harmless, and honest AI assistant."

Snippet 2: "Tone Guidelines"
Content: "Maintain a friendly, professional tone."

Snippet 3: "Safety Rules"
Content: "Never provide harmful or illegal advice."
```

**Step 2: Build Structure**
```xml
<system_prompt>
  <role>
    [Insert "AI Role" snippet]
  </role>
  <constraints>
    <tone>
      [Insert "Tone Guidelines" snippet]
    </tone>
    <safety>
      [Insert "Safety Rules" snippet]
    </safety>
  </constraints>
</system_prompt>
```

**Step 3: Export**
- Copy the formatted XML
- Use it in your AI application

---

## 🔧 Advanced Features

### Search Snippets
- Type in the search box at the top of Snippet Library
- Searches both titles and content

### Favorite Snippets
- Click the **star icon** on any snippet card
- Starred snippets get a gold star

### Collapse Sections
- Click the **chevron icon** on container blocks
- Hides children for cleaner view

### Adjust Preview Settings
- Click the **gear icon** in Live Preview
- Toggle line numbers
- Change indent size (2 or 4 spaces)

### Organize with Categories
- Create categories when making snippets
- Filter by category in the library

---

## 💾 Data & Privacy

### Where is my data stored?
- All data is stored in your **browser's localStorage**
- Nothing is sent to any server
- Data persists until you clear browser data or use "Clear All"

### How do I backup my data?
- Use **"Export Data"** regularly
- Saves a timestamped JSON file
- Store it somewhere safe (cloud drive, USB, etc.)

### How do I move to another device?
1. Export data on Device A
2. Transfer the JSON file to Device B
3. Import data on Device B

---

## 🐛 Troubleshooting

### Snippets not showing up
- **Check:** Did you create any? Click "+ New" to add one
- **Check:** Is search active? Clear the search box

### Can't delete a snippet
- **Error:** "Snippet is being used in prompt builder"
- **Solution:** Remove the snippet from all prompt blocks first

### Preview is empty
- **Check:** Did you add any blocks? Click "+ Add Block"
- **Note:** Preview only shows what's in the builder

### Lost my data
- **Prevention:** Export regularly
- **Recovery:** Import from your last backup
- **Note:** Browser's localStorage can be cleared by the OS

---

## 📖 Learn More

- **README.md** - Full documentation
- **agent.md** - Technical specification
- **PROJECT_SUMMARY.md** - Implementation details

---

## 🎉 You're Ready!

Start building amazing prompts! The interface is intuitive:
- **Left panel:** Your snippet library
- **Center panel:** Your prompt structure
- **Right panel:** Live preview

**Happy prompting! ✨**
