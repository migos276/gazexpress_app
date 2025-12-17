# Plan de Correction - Erreur Réseau

## Diagnostic de l'erreur `Network request failed`

### Problème identifié
L'erreur `Login error: [TypeError: Network request failed]` indique que le frontend ne peut pas se connecter au serveur Express proxy sur le port 5000.

### Structure actuelle du projet
- **Frontend** : React Native/Expo (appelle `localhost:5000`)
- **Proxy** : Express server (port 5000, redirige vers Django)
- **Backend** : Django (port 8000)

### Causes probables
1. **Serveur Express non démarré** (port 5000)
2. **Backend Django non démarré** (port 8000) 
3. **Configuration d'URL incorrecte en développement**
4. **Proxy middleware mal configuré**

## Plan de correction

### Étape 1 : Vérifier et corriger la configuration réseau
- [ ] Vérifier que tous les services sont configurés correctement
- [ ] Corriger la configuration du proxy Express
- [ ] Valider les URLs en mode développement

### Étape 2 : Améliorer la gestion d'erreur
- [ ] Ajouter des timeouts configurables
- [ ] Implémenter une logique de retry
- [ ] Améliorer les messages d'erreur utilisateur

### Étape 3 : Optimiser les scripts de démarrage
- [ ] Créer un script unifié pour démarrer tous les services
- [ ] Ajouter la vérification des ports avant démarrage
- [ ] Implémenter un système de monitoring

### Étape 4 : Tests et validation
- [ ] Tester la connectivité entre tous les services
- [ ] Valider le flux d'authentification complet
- [ ] Vérifier les logs de chaque service

## Scripts à créer/modifier
1. `scripts/start-all.js` - Script de démarrage unifié
2. `scripts/check-ports.js` - Vérification des ports
3. Mise à jour de `package.json` pour les nouveaux scripts
4. Amélioration de `query-client.ts` pour la gestion d'erreur
