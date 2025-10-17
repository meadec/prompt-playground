# ⚡ GitHub Pages - 5 Minute Deployment

## 🎯 Prerequisites
- GitHub account
- Git installed locally

---

## 🚀 Deploy in 5 Steps

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `prompt-engineer-tool`)
3. Choose **Public** (required for free GitHub Pages)
4. **Do NOT** initialize with README
5. Click **Create repository**

---

### Step 2: Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Prompt Engineer Tool"

# Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push
git push -u origin main
```

---

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab (top menu)
3. Click **Pages** in left sidebar
4. Under "Build and deployment":
   - **Source:** Select **"GitHub Actions"** (not "Deploy from a branch")
5. Done! (it will save automatically)

---

### Step 4: Configure Workflow Permissions

1. Still in **Settings**
2. Click **Actions** → **General** (left sidebar)
3. Scroll to **"Workflow permissions"**
4. Select **"Read and write permissions"**
5. Check ✅ **"Allow GitHub Actions to create and approve pull requests"**
6. Click **Save**

---

### Step 5: Trigger Deployment

**Option A: Automatic (Recommended)**
- The workflow triggers automatically on push to `main`
- Go to **Actions** tab to watch progress

**Option B: Manual Trigger**
1. Go to **Actions** tab
2. Click **"Deploy to GitHub Pages"** (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Click **"Run workflow"** again (in dropdown)

---

## ⏱️ Wait for Deployment

1. Go to **Actions** tab
2. Watch the workflow run (takes 2-3 minutes)
3. Green checkmark ✅ = Success!

---

## 🌐 Access Your Site

Your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Examples:**
- `https://johndoe.github.io/prompt-engineer-tool/`
- `https://mycompany.github.io/prompt-tool/`

**For user/org site (`username.github.io` repo):**
```
https://YOUR_USERNAME.github.io/
```

---

## ✅ Verify It Works

Once deployed, test these features:

- [ ] Site loads correctly
- [ ] Theme toggle (sun/moon icon) works
- [ ] Create a snippet (left panel)
- [ ] Build a prompt (center panel)
- [ ] See preview (right panel)
- [ ] Copy to clipboard works
- [ ] Export/Import data works

---

## 🔄 Update Your Site

Every time you push to `main`, the site auto-updates!

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Site redeploys automatically in 2-3 minutes!
```

---

## 🐛 Troubleshooting

### Build Failed ❌

**Check the error:**
1. Go to **Actions** tab
2. Click the failed run (red ❌)
3. Click on the failed job
4. Expand the failed step
5. Read the error message

**Common fixes:**
```bash
# Test locally first
npm install
npm run build

# If local build works, the CI will too
```

---

### Site Shows 404 ❌

**Fix checklist:**

1. **Verify Pages source:**
   - Settings → Pages
   - Source should be **"GitHub Actions"** (not "Deploy from a branch")

2. **Check workflow permissions:**
   - Settings → Actions → General
   - Enable "Read and write permissions"

3. **Check workflow ran:**
   - Actions tab should show successful run (green ✅)

4. **Check deployment:**
   - Actions → Latest workflow run
   - Should see "Deploy to GitHub Pages" step succeeded

5. **Wait a few minutes:**
   - First deployment can take 5-10 minutes
   - Subsequent deployments take 2-3 minutes

---

### Assets Not Loading ❌

**Symptoms:** Site loads but looks broken (no CSS/JS)

**Fix:**
1. Verify the workflow completed successfully
2. Check browser console for 404 errors
3. The `actions/configure-pages` step should auto-configure the basePath
4. If still broken, check the `next.config.js` file is correct

---

## 📊 Monitoring

### View Build Logs
1. **Actions** tab
2. Click any workflow run
3. Expand steps to see detailed logs

### Deployment History
- **Actions** tab shows all past deployments
- Click any run to see what changed
- Each commit triggers a new deployment

### Add Status Badge

Add to your `README.md`:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/deploy.yml/badge.svg)
```

Shows: ![Deploy Status](https://img.shields.io/badge/deploy-passing-brightgreen)

---

## 🎉 Success!

You should now have:
- ✅ Live site on GitHub Pages
- ✅ Automatic deployments on push
- ✅ Free hosting forever
- ✅ HTTPS enabled
- ✅ Fast, global CDN

**Your URL:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## 📚 Next Steps

- **Share your site!** Send the URL to others
- **Add a custom domain** (see [DEPLOYMENT.md](./DEPLOYMENT.md))
- **Star the repo** so you can find it later
- **Create snippets** and start building prompts!

---

## 🆘 Need Help?

- **Check** [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- **Read** [GitHub Pages Docs](https://docs.github.com/en/pages)
- **Ask** in GitHub Discussions or Issues

---

**Happy deploying! 🚀**
