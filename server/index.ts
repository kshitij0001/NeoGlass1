import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { setupVite } from './vite.js';
import { registerRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API routes
registerRoutes(app);

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  // Catch-all handler for SPA
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
} else {
  // Development mode with Vite
  const server = await registerRoutes(app);
  await setupVite(app, server);
}

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
}

// Export for Vercel
export default app;