# Diagnostic des Erreurs Réseau

## Problème identifié
**Erreur** : `Network request failed` dans les logs de connexion

## Causes possibles

### 1. Services non démarrés
- Django backend (port 8000) peut ne pas être démarré
- Express proxy server (port 5000) peut ne pas être démarré

### 2. Configuration des URLs
- Le frontend utilise `localhost:5000` pour les API calls
- Express doit être démarré pour proxifier vers Django

### 3. CORS et authentification
- Configuration JWT potentiellement incorrecte
- Headers d'authentification mal configurés

## Solution requise
1. **Vérifier que tous les services sont démarrés**
2. **Tester la connectivité réseau**
3. **Valider la configuration des tokens JWT**
4. **Vérifier les logs côté serveur**
