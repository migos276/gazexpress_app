#!/usr/bin/env node

/**
 * Script pour vérifier que tous les services nécessaires sont démarrés
 * avant de lancer l'application
 */

const http = require('http');

const SERVICES = [
  {
    name: 'Express Proxy Server',
    port: 5000,
    path: '/health',
    url: 'http://localhost:5000/health'
  },
  {
    name: 'Django Backend',
    port: 8000,
    path: '/api/auth/test/',
    url: 'http://localhost:8000/api/auth/test/'
  }
];

/**
 * Test la connectivité d'un service
 */
function testService(service) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: service.port,
      path: service.path,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`✅ ${service.name} (port ${service.port}) - OK`);
        resolve(true);
      } else {
        console.log(`⚠️  ${service.name} (port ${service.port}) - Status ${res.statusCode}`);
        resolve(false);
      }
      res.destroy();
    });

    req.on('error', (err) => {
      console.log(`❌ ${service.name} (port ${service.port}) - Échec: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ ${service.name} (port ${service.port}) - Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Fonction principale
 */
async function checkAllServices() {
  console.log('🔍 Vérification des services...\n');
  
  const results = await Promise.all(SERVICES.map(testService));
  const allRunning = results.every(result => result === true);
  
  console.log('\n' + '='.repeat(50));
  
  if (allRunning) {
    console.log('🎉 Tous les services sont opérationnels !');
    console.log('✅ Vous pouvez maintenant lancer l\'application');
    process.exit(0);
  } else {
    console.log('❌ Certains services ne sont pas disponibles :');
    console.log('\n📋 Services requis :');
    console.log('1. Backend Django (port 8000)');
    console.log('2. Serveur Express proxy (port 5000)');
    console.log('\n🚀 Commandes pour démarrer les services :');
    console.log('Backend: cd ../backend && python run.py');
    console.log('Express: npm run server:dev');
    console.log('Ou tout ensemble: npm run dev:full');
    process.exit(1);
  }
}

// Lancer la vérification
checkAllServices().catch(error => {
  console.error('Erreur lors de la vérification:', error);
  process.exit(1);
});
