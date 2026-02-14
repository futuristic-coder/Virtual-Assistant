import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = join(__dirname, 'dist');

// Check if dist folder exists
if (!existsSync(distPath)) {
  console.error(`ERROR: dist folder not found at ${distPath}`);
  process.exit(1);
}

// Serve static files from dist folder with caching disabled
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: false
}));

// SPA fallback - all routes serve index.html
app.get('*', (req, res) => {
  console.log(`Route: ${req.path} -> serving index.html`);
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`📁 Serving from: ${distPath}`);
});
});
