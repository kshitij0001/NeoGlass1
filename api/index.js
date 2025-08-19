
// Vercel serverless function entry point
import('../dist/index.js').then(module => {
  module.default || module;
}).catch(err => {
  console.error('Failed to load server module:', err);
});

// For immediate export, we'll use a dynamic import wrapper
export default async (req, res) => {
  try {
    const { default: app } = await import('../dist/index.js');
    return app(req, res);
  } catch (error) {
    console.error('Error loading app:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
