# Plan de Correction - Communication Backend-Frontend

## Problèmes identifiés
1. **Conflit de ports** : Django (5000) et Express (5000)
2. **Absence de proxy API** : Pas de redirection /api vers Django
3. **Communication API manquante** : Frontend sans configuration API
4. **CORS à vérifier** : Configuration entre services

## Plan d'action

### Étape 1: Modifier le port Django
- [x] Changer le port Django de 5000 vers 8000 dans run.py

### Étape 2: Configurer le proxy Express
- [x] Ajouter les routes proxy dans server/routes.ts
- [x] Configurer la redirection /api/* vers localhost:8000


### Étape 3: Configuration CORS
- [x] Vérifier et ajuster CORS dans Django settings
- [x] S'assurer que Express accepte les requêtes du frontend

### Étape 4: Scripts de démarrage
- [x] Modifier package.json pour les nouveaux ports
- [x] Créer un script de démarrage coordonné


### Étape 5: Configuration API Réelle
- [x] Remplacer les données mockées par de vraies API calls
- [x] Ajouter l'authentification JWT aux requêtes
- [x] Corriger la configuration des URLs API

### Étape 6: Tests
- [ ] Tester la communication API
- [ ] Vérifier l'authentification JWT
- [ ] Valider les requêtes cross-origin
