# SportsIQ Website — GitHub Pages Hosting Guide

## Your File Structure
Upload these files exactly as-is to your GitHub repo:

```
/
├── index.html       ← Home page
├── about.html       ← About page
├── services.html    ← Services / CourtIQ platform page
├── contact.html     ← Contact / Demo request page
├── styles.css       ← Shared stylesheet (all pages use this)
├── main.js          ← Shared JavaScript (nav behavior)
└── logo.png         ← YOUR LOGO — rename your logo file to exactly "logo.png"
```

> ⚠️ IMPORTANT: Rename your SportsIQ logo image file to **logo.png** and place it in the same folder before uploading.

---

## Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** icon → **New repository**
3. Name it exactly: `sportsiqus.com` (or your domain name — doesn't have to match but keeps it organized)
4. Set it to **Public**
5. Do NOT check "Add a README" — leave it empty
6. Click **Create repository**

---

## Step 2 — Upload Your Files

### Option A: Upload via browser (easiest)
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL files (index.html, about.html, services.html, contact.html, styles.css, main.js, logo.png)
3. Scroll down, write a commit message like "Initial site upload"
4. Click **Commit changes**

### Option B: Using Git (command line)
```bash
git init
git add .
git commit -m "Initial site upload"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages

1. In your repo, click **Settings** (top menu)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Branch: **main** / Folder: **/ (root)**
5. Click **Save**
6. GitHub will show a URL like: `https://yourusername.github.io/repo-name/`

Your site is now live at that URL. Test it before connecting your domain.

---

## Step 4 — Connect Your Squarespace Domain

### In GitHub:
1. Go to **Settings → Pages**
2. Under **Custom domain**, type your domain (e.g. `www.sportsiqus.com`)
3. Click **Save**
4. GitHub will create a file called `CNAME` in your repo automatically

### In Squarespace (DNS Settings):
1. Log into Squarespace → go to **Domains**
2. Click your domain → **DNS Settings**
3. Delete any existing A records or CNAME records pointing to Squarespace servers
4. Add these **4 A records** (pointing to GitHub's IPs):

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

5. Add this **CNAME record** (for www):

| Type | Host | Value |
|------|------|-------|
| CNAME | www | yourusername.github.io |

6. Save all records

### Wait for DNS to propagate:
DNS changes take **15 minutes to 48 hours** to fully propagate. Your site will be live at your domain once it does.

---

## Step 5 — Enable HTTPS (Free SSL)

1. After your custom domain is connected and DNS has propagated:
2. Go to **GitHub → Settings → Pages**
3. Check the box: **Enforce HTTPS**
4. Done — your site will load as `https://www.sportsiqus.com`

---

## Updating Your Website

To make changes after launch:
1. Edit the HTML/CSS files on your computer
2. Go to your GitHub repo
3. Click the file you want to update → click the **pencil icon** to edit
4. Or re-upload files via the upload button
5. Changes go live within ~30 seconds after committing

---

## Notes

- The **contact form** uses a mailto: link — when someone submits it, it opens the visitor's email client pre-filled and addressed to support@sportsiqus.com. This works without any backend or paid service.
- If you want a true form submission (no email client popup), consider connecting [Formspree.io](https://formspree.io) — free plan available, easy to add.
- All pages are fully responsive and mobile-friendly.
- Replace "2025" in the footer copyright with the current year when needed.
