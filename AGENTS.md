# Splitter

Splitter is a single-page receipt splitting app. The MVP is static vanilla HTML, CSS, and JavaScript in `index.html`.

## Product Rules

- Receipt images must not be uploaded to a server.
- OCR runs client-side with Tesseract.js.
- No auth, accounts, ads, or persistent user-data storage.
- Summary links may include final split data, but never the receipt image.

## Local Development

Open `index.html` directly in a browser or serve the directory with any static server.

## Optional Worker

`workers/splitter-worker.js` is an optional Cloudflare Worker for storing share summaries in KV. Configure the `SPLITS` KV namespace in `wrangler.toml` before deploying.
