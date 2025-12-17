#!/usr/bin/env node

/**
 * Script de démarrage unifié pour tous les services
 * Vérifie les ports et démarre les services dans l'ordre approprié
 */

const { spawn } = require('child_process');
const http = require('http');

const SERVICES = {
  backend: {
    name: 'Django Backend',
    port: 8000,
    healthPath: '/health/',
    command: 'python',
    args: ['run.py'],
    cwd: '../backend',
    description: 'Serveur Django API (port 8000)'
  },
  express: {
    name: 'Express Proxy',
    port: 5000,
    healthPath: '/health',
    command: 'npm',
    args: ['run', 'server:dev'],
    cwd: '.',
    description: 'Serveur Express proxy (port 5000)'
  }
};

let runningServices = new Set();

/**
 * Vérifie si un port est libre
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.listen(port, (err) => {
      if (err) {
        resolve(false);
      } else {
        server.close(() => resolve(true));
      }
    });
    
    server.on('error', () => resolve(false));
  });
}

/**
 * Vérifie la santé d'un service
 */
async function checkServiceHealth(service) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`http://localhost:${service.port}${service.healthPath}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Démarre un service
 */
function startService(service) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Démarrage de ${service.name}...`);
    
    const child = spawn(service.command, service.args, {
      cwd: service.cwd,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('spawn', () => {
      console.log(`✅ ${service.name} démarré`);
      runningServices.add(service.name);
      resolve(child);
    });
    
    child.on('error', (error) => {
      console.error(`❌ Erreur lors du démarrage de ${service.name}:`, error);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ ${service.name} s'est arrêté avec le code ${code}`);
        runningServices.delete(service.name);
      }
    });
  });
}

/**
 * Attendre qu'un service soit prêt
 */
async function waitForService(service, maxAttempts = 30) {
  console.log(`⏳ Attente de ${service.name}...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (await checkServiceHealth(service)) {
      console.log(`🎉 ${service.name} est prêt !`);
      return true;
    }
    
    console.log(`   Tentative ${attempt}/${maxAttempts}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error(`${service.name} n'a pas démarré à temps`);
}

/**
 * Gestionnaire de signal pour arrêter proprement les services
 */
function setupGracefulShutdown() {
  const shutdown = () => {
    console.log('\n🛑 Arrêt des services...');
    runningServices.forEach(serviceName => {
      console.log(`   Arrêt de ${serviceName}...`);
    });
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🏁 Démarrage de tous les services GazExpress\n');
  
  // Vérifier les ports
  console.log('🔍 Vérification des ports...');
  
  const backendPort = await checkPort(SERVICES.backend.port);
  const expressPort = await checkPort(SERVICES.express.port);
  
  if (!backendPort) {
    console.log(`⚠️  Port ${SERVICES.backend.port} déjà utilisé (Django)`);
  }
  
  if (!expressPort) {
    console.log(`⚠️  Port ${SERVICES.express.port} déjà utilisé (Express)`);
  }
  
  console.log('');
  
  try {
    // Démarrer le backend Django en premier
    await startService(SERVICES.backend);
    await waitForService(SERVICES.backend);
    
    // Démarrer le serveur Express
    await startService(SERVICES.express);
    await waitForService(SERVICES.express);
    
    console.log('\n🎉 Tous les services sont démarrés et opérationnels !');
    console.log('\n📋 Services disponibles :');
    console.log(`   - Django API: http://localhost:${SERVICES.backend.port}`);
    console.log(`   - Express Proxy: http://localhost:${SERVICES.express.port}`);
    console.log('\n🚀 L\'application est prête !');
    console.log('   Vous pouvez maintenant lancer : npm run expo:dev');
    console.log('\n⏹️  Appuyez sur Ctrl+C pour arrêter tous les services');
    
    setupGracefulShutdown();
    
  } catch (error) {
    console.error('\n❌ Erreur lors du démarrage:', error.message);
    console.log('\n🔧 Vérifiez que :');
    console.log('   - Python et Django sont installés');
    console.log('   - Node.js et npm sont installés');
    console.log('   - Les dépendances sont installées (npm install)');
    process.exit(1);
  }
}

// Lancer le script
if (require.main === module) {
  main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { main, SERVICES };
