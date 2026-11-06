# Run and publish Yash's portfolio

## Run locally

1. Install Node.js 20.19 or newer.
2. Install the packages:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Update your details

- Edit page text and account links in `index.html`.
- Edit project descriptions, stacks, source links, and demos in `src/projects.js`.
- Replace `public/Yash_Goel_Resume.pdf` when your resume changes.
- Edit colors and responsive layouts in `src/style.css`.

To rebuild the portrait and sharing image, install Pillow and run `python scripts/prepare_assets.py`. The script preserves `yash.jpg`.

## Check the production site

```sh
npx playwright install chromium firefox webkit
npm run verify
```

`npm run verify` checks formatting, builds the production site, and runs tests in Chromium, Firefox, and WebKit. The tests cover project filters, dialogs, downloads, themes, contact controls, local assets, mobile navigation, and restricted browser permissions. Axe checks contrast and accessibility in Chromium. Screenshots and failure traces are saved in `test-results/`.

To check external profile and project links, run `npm run check:links`. Some sites block automated requests. The script reports those URLs for manual review instead of claiming they work.

To format source files, run `npm run format`.

## Publish

1. Run `npm run build`.
2. Upload `dist/` to a static host, or import this folder into Vercel or Netlify.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. After you have a public domain, add a canonical URL and change `og:image` in `index.html` to the absolute URL of `social-card.jpg`.

On Vercel, `vercel.json` sets security headers and long-lived caching for content-hashed assets. GitHub Actions runs the verification suite on pushes to `main` and on pull requests.

No backend or private credentials are required. Contact buttons open an email application. Project previews are illustrations, not application screenshots. Fonts are hosted with the site, and their licenses are in `public/font-licenses/`.

The SyncSave demo is linked. The old Amazon Clone Vercel deployment returns `451 DEPLOYMENT_DISABLED`, so the portfolio offers its source code instead.

See [design decisions](docs/design.md) for content sources and architecture.
