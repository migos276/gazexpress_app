
import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(app: Express): Promise<Server> {

  // Route de santé pour vérifier que le serveur Express fonctionne
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Express Proxy Server is running',
      timestamp: new Date().toISOString()
    });
  });

  // Route pour vérifier la connectivité vers Django
  app.get('/health/backend', async (req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:8000/health', {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        res.status(200).json({ 
          status: 'ok', 
          message: 'Backend Django is accessible',
          backendStatus: response.status 
        });
      } else {
        res.status(503).json({ 
          status: 'error', 
          message: 'Backend Django is not responding properly',
          backendStatus: response.status 
        });
      }
    } catch (error) {
      res.status(503).json({ 
        status: 'error', 
        message: 'Backend Django is not reachable',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });


  // Proxy API routes to Django backend with improved error handling
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api', // Redirige /api/* vers /api/* sur Django
    },
    // Note: Les callbacks d'erreur sont gérés dans le serveur principal
  }));

  // Route pour les assets statiques si nécessaire
  app.use('/static', (req, res) => {
    res.status(404).json({ error: 'Static files not configured' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
