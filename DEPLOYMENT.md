# 🚀 Deployment Guide - GitHub Pages

This guide will help you deploy your Prompt Engineer Tool to GitHub Pages using GitHub Actions.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Repository created on GitHub

## 🎯 Quick Deployment (5 Minutes)

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Prompt Engineer Tool"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
5. Click **Save**

### Step 3: Trigger Deployment

The deployment will start automatically! You can:

**Option A: Wait for automatic deployment**
- The workflow runs automatically on push to `main`

**Option B: Trigger manually**
1. Go to **Actions** tab
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### Step 4: Access Your Site

After deployment completes (2-3 minutes):

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**For organization repositories:**
```
https://YOUR_ORG.github.io/YOUR_REPO_NAME/
```

**For user/org main site:**
```
https://YOUR_USERNAME.github.io/
```
(Only if repo is named `YOUR_USERNAME.github.io`)

---

## 🔧 Configuration Details

### Workflow Files

We've created two GitHub Actions workflows:

#### 1. `deploy.yml` - Production Deployment
- **Triggers:** Push to `main` branch or manual trigger
- **Actions:**
  - ✅ Checks out code
  - ✅ Sets up Node.js 20
  - ✅ Caches dependencies
  - ✅ Installs dependencies
  - ✅ Builds the static site
  - ✅ Deploys to GitHub Pages

#### 2. `test.yml` - Pull Request Tests
- **Triggers:** Pull requests to `main` branch
- **Actions:**
  - ✅ Tests on Node.js 18 & 20
  - ✅ Type checking
  - ✅ Build verification
  - ✅ Ensures no breaking changes

### Next.js Configuration

The `next.config.js` is automatically configured to work with GitHub Pages:

```js
// Automatically handles basePath for GitHub Pages
basePath: process.env.NEXT_PUBLIC_BASE_PATH || ''
```

The GitHub Actions workflow automatically injects the correct `basePath` based on your repository name.

### Important Files

- **`.nojekyll`** - Tells GitHub Pages not to use Jekyll processing
- **`public/.nojekyll`** - Copied to output directory during build
- **`.github/workflows/deploy.yml`** - Main deployment workflow
- **`.github/workflows/test.yml`** - Testing workflow for PRs

---

## 🎨 Custom Domain (Optional)

### Using a Custom Domain

1. **Add CNAME file:**
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS:**
   Add these records to your DNS provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```

3. **Configure in GitHub:**
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

4. **Wait for DNS propagation** (up to 24 hours)

### Using a Subdomain

For `subdomain.yourdomain.com`:

1. **Add CNAME file:**
   ```bash
   echo "subdomain.yourdomain.com" > public/CNAME
   ```

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: subdomain
   Value: YOUR_USERNAME.github.io
   ```

---

## 🔍 Monitoring Deployments

### View Deployment Status

1. Go to **Actions** tab in your repository
2. See all workflow runs
3. Click on any run to see detailed logs

### Deployment Badge

Add this to your `README.md`:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/deploy.yml/badge.svg)
```

---

## 🐛 Troubleshooting

### Build Fails

**Check the workflow logs:**
1. Go to Actions tab
2. Click the failed workflow run
3. Expand the failed step to see error details

**Common issues:**
- **Missing dependencies:** Run `npm install` locally first
- **TypeScript errors:** Run `npm run build` locally to check
- **Out of memory:** The free tier should be sufficient for this app

### 404 Error on Deployment

**Issue:** Site shows 404 after deployment

**Solutions:**
1. **Check Pages settings:**
   - Settings → Pages
   - Verify "Source" is set to "GitHub Actions"

2. **Check workflow permissions:**
   - Settings → Actions → General
   - Scroll to "Workflow permissions"
   - Enable "Read and write permissions"

3. **Verify deployment:**
   - Go to Actions → Deploy workflow
   - Check if deployment step succeeded

### Assets Not Loading

**Issue:** CSS/JS files return 404

**Solution:**
This is automatically handled by the workflow's `actions/configure-pages` step, which injects the correct `basePath`.

If still having issues:
1. Check the `next.config.js` file
2. Verify `basePath` is set correctly
3. Rebuild and redeploy

### Cache Issues

**Clear build cache:**

1. Go to Actions tab
2. Click "Caches" in the left sidebar
3. Delete all caches
4. Re-run the workflow

---

## 🔄 Updating Your Site

### After Making Changes

```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

The site will automatically redeploy in 2-3 minutes!

### Rolling Back

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push origin main --force
```

---

## 🚦 Deployment Checklist

Before first deployment:

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Workflow permissions set (Read and write)
- [ ] `.nojekyll` file present
- [ ] First workflow run successful

After first deployment:

- [ ] Site accessible at GitHub Pages URL
- [ ] Theme switching works
- [ ] Snippets can be created
- [ ] Prompt builder functional
- [ ] Live preview working
- [ ] Export/Import functional

---

## 📊 Performance Tips

### Build Optimization

The workflow includes:
- ✅ **Dependency caching** - Faster subsequent builds
- ✅ **Next.js cache** - Reuses unchanged pages
- ✅ **Parallel jobs** - Build and deploy separately

### Cost

- **GitHub Actions:** Free for public repositories
- **GitHub Pages:** Free (100 GB bandwidth/month)
- **No server costs:** Static site, no backend needed

---

## 🔐 Security Best Practices

### Secrets Management

This app doesn't need any secrets, but if you add API keys:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add your secret
4. Reference in workflow: `${{ secrets.YOUR_SECRET }}`

### Permissions

The workflow uses minimal permissions:
- `contents: read` - Read repository contents
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - Authenticate with GitHub Pages

---

## 📞 Support

### GitHub Pages Documentation
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Next.js Deployment
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

### Community
- [GitHub Community Forum](https://github.community)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)

---

## ✅ Success!

Once deployed, your Prompt Engineer Tool will be:
- 🌐 Publicly accessible
- 🔄 Automatically updated on every push
- 💾 Using browser localStorage (no backend needed)
- 🚀 Fast and responsive
- 🆓 Completely free to host

**Enjoy your deployed app! 🎉**
