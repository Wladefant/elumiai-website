# elumi ai — website

Marketing site for **Elumi AI**, an AI product studio. Flagship product: [heylolo](https://heylolo.com).

Static single-page site (HTML + CSS + vanilla JS, no build step), served by nginx and deployed on Dokploy via the included `Dockerfile`.

## Local preview

```bash
python -m http.server 5173
# open http://localhost:5173
```

## Deploy

Docker build (nginx serves on port 80):

```bash
docker build -t elumiai-website .
docker run -p 8080:80 elumiai-website
```

On Dokploy: Application → GitHub provider (`Wladefant/elumiai-website`, branch `main`), build type **Dockerfile**, container port **80**.

### Cloudflare Pages (target static hosting)

- Output directory: `.` (repo root)
- Build command: none (pure static HTML/CSS/JS)
- Headers: `_headers`
- Redirects: `_redirects`

Direct deploy command:
```bash
npx wrangler pages deploy . --project-name elumiai-website
```

## Structure

```
index.html      # page markup
styles.css      # design system + animations
script.js       # scroll reveal, parallax, magnetic buttons, counters
favicon.svg     # brand orb
assets/         # heylolo product shots, mascot, compliance badges, og image
Dockerfile      # nginx:alpine static image
nginx.conf      # gzip, caching, security headers
```

Assets are sourced from the heylolo brand and optimized to WebP.
