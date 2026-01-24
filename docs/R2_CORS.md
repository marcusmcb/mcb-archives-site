# Cloudflare R2 CORS (Images + Audio)

## Do you need CORS?

- **Not strictly required** for basic `<img>` and `<audio>` playback in most browsers.
- **Recommended** if you plan to:
  - later add waveforms (e.g. WebAudio/WaveSurfer),
  - fetch media from JavaScript,
  - or just want predictable behavior across browsers and tools.

## Where to configure

Cloudflare Dashboard → **R2** → select your bucket → **Settings** → **CORS policy**.

## Suggested CORS policy (safe defaults)

Paste a policy like this (edit origins):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": [
      "Accept-Ranges",
      "Content-Range",
      "Content-Length",
      "ETag",
      "Last-Modified"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

Notes:
- If you’re currently using an R2.dev public dev URL, your site origin is still `http://localhost:3000` during local dev.
- When you later deploy to Vercel, add that production origin (e.g. `https://mcb-archives.vercel.app`) if you keep using the R2.dev host.
- If you ever use a truly public “allow all” setup, you *can* set `AllowedOrigins` to `"*"`, but it’s better to keep a short allowlist.

## Confirm it works

- Open an image URL directly in the browser.
- Open an MP3 URL directly in the browser and try seeking.
- Optional: verify CORS headers exist by checking DevTools → Network → request headers/response headers.

If you run into a specific error message (CORS blocked / 206 partial content / range requests), send it and I’ll pinpoint the exact setting causing it.
