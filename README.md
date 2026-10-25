# Orbitfolio — Sadab Sazzad Alif

A responsive, space-themed CV/portfolio website designed for static hosting on **Netlify** or **GitHub Pages**. No build step, framework install, API key, or backend is required.

## Run locally
1. Extract this ZIP.
2. Open `index.html` in a browser, or use VS Code's Live Server extension for a local server.

## Deploy to Netlify via GitHub
1. Create a new GitHub repository (for example, `orbitfolio`).
2. Upload all files and folders from this ZIP to the repository root. Ensure `index.html` is at the root.
3. In Netlify, choose **Add new site → Import an existing project**.
4. Connect GitHub and select the repository.
5. Build command: leave blank. Publish directory: `.` (the repository root).
6. Deploy. Future commits to the connected branch will trigger a new deployment.

## Included features
- Animated starfield canvas and orbital planet illustration
- Responsive navigation and mobile menu
- Scroll progress indicator and reveal-on-scroll animations
- Filterable project cards
- Keyboard command palette: press `⌘K` on Mac or `Ctrl+K` on Windows/Linux
- Copy-email action and direct email/LinkedIn links
- Downloadable PDF CV in `assets/`

## Personalise before publishing
- The email and LinkedIn links are populated from the supplied CV.
- Add real GitHub/demo URLs to project cards if you want them clickable.
- Review the CV's personal details and work/project descriptions before making the site public.
- Google Fonts are loaded online; system font fallbacks are provided.
- The site uses the supplied CV as source material. Some CV entries are presented as visual project summaries, not claims of public repositories.

## Files
- `index.html` — page structure and content
- `styles.css` — layout, theme, animations and responsive rules
- `script.js` — starfield, navigation, filters, command palette, and interactions
- `assets/Sadab_Sazzad_Alif_CV.pdf` — supplied CV for download
