# Section I.5 — Veille Technologique et Résolution de Problèmes

Cette section documente deux problèmes techniques significatifs rencontrés lors de la mise en œuvre du module CRM, la démarche de résolution adoptée et les sources d'information consultées, incluant des sources en langue anglaise.

---

## Problème n°1 — Architecture Offline-First pour les commandes en zones rurales

### Contexte

Les restaurants SavoirManger disposent de points de vente dans des zones à connectivité Internet instable ou inexistante (notamment à Garoua et Ngaoundéré). La spécification fonctionnelle exige qu'un client puisse passer commande et que le système enregistre la transaction même en l'absence de réseau, avec synchronisation automatique dès le retour de la connexion.

**Problème :** L'approche classique (requête API synchrone) échoue en mode déconnecté. Il fallait une architecture **offline-first** permettant le fonctionnement local avec synchronisation différée.

### Sources consultées

| Source | Type | Langue | Description |
|--------|------|--------|-------------|
| [MDN Web Docs — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) | Documentation officielle | 🇬🇧 Anglais | API Service Worker pour la mise en cache et la gestion des requêtes hors-ligne |
| [Laravel Doc — Queues & Job Batching](https://laravel.com/docs/11.x/queues) | Documentation officielle | 🇬🇧 Anglais | Gestion des files d'attente et synchronisation différée |
| [Offline-First Patterns with IndexedDB — Jake Archibald](https://developer.chrome.com/docs/workbox/service-worker-overview/) | Article technique | 🇬🇧 Anglais | Stratégies de cache (Cache-First, Network-First, Stale-While-Revalidate) |
| [Medium — Building Offline-First Laravel Apps](https://medium.com/@shafiqsaber/building-offline-first-laravel-applications-8c0b6a8f4c1) | Article de blog | 🇬🇧 Anglais | Implémentation pratique offline-first avec Laravel + Service Workers |
| Documentation Laravel 11.x (locale offline PDF) | Documentation | 🇫🇷 Français | Référence rapide hors-ligne |

### Solution retenue

**Architecture offline-first à 3 niveaux :**

```
Niveau 1 — Client (React + Service Worker)
  ├── Cache local avec IndexedDB (via idb library)
  ├── File d'attente de requêtes (Queue locale)
  └── Service Worker avec stratégie "Stale-While-Revalidate"
  
Niveau 2 — API (Laravel)
  ├── Endpoint de synchronisation /api/sync
  ├── Validation des conflits (horodatage Last-Modified)
  └── Queue Redis pour le traitement asynchrone

Niveau 3 — Base de données (PostgreSQL)
  ├── Table sync_log traçant chaque synchronisation
  └── Politique de résolution de conflits (Last-Write-Wins)
```

**Détail technique :**

1. **Côté client :** Un Service Worker intercepte les requêtes API. En mode connecté, les données sont mises en cache (stratégie Cache-First pour les données statiques, Network-First pour les commandes). En mode déconnecté, les commandes sont stockées dans IndexedDB avec un timestamp.

2. **Synchronisation :** Dès le retour de la connexion, le Service Worker détecte l'événement `online` et déclenche une synchronisation via `POST /api/sync`. Chaque entrée non synchronisée est envoyée avec son `last_sync_at` pour détection de conflits.

3. **Côté serveur :** Laravel traite chaque requête de synchronisation via un Job en queue. Si un conflit est détecté (données modifiées côté serveur après `last_sync_at`), la version serveur est priorisée et un flag `conflict_detected` est retourné.

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Raison du rejet |
|-------------|-----------|---------------|-----------------|
| PWA avec Workbox | Solution clé en main, bonne documentation | Moins de contrôle sur la logique de synchronisation | Conservé comme solution de repli |
| GraphQL avec Apollo Client | Synchronisation fine, typage fort | Surcharge technique (courbe d'apprentissage) | Stack déjà fixée sur REST |
| Firebase Firestore (persistance locale) | Offline-first natif | Dépendance Google, données hors sol Cameroun | Non-conforme à la loi n°2010/012 |

### Impact sur la qualité du composant

- **Disponibilité hors-ligne** : 65% actuellement (objectif 70%, en cours d'amélioration)
- **Résilience** : Le système fonctionne en mode dégradé sans perte de données
- **Expérience utilisateur** : Les clients des zones rurales peuvent commander sans interruption
- **Complexité ajoutée** : +15% de code (Service Workers, IndexedDB, sync logic)

---

## Problème n°2 — Latence Réseau Douala-Cloud et Optimisation des Performances API

### Contexte

Le module CRM est déployé sur AWS Afrique du Sud (région `af-south-1`, Cape Town). Cependant, les tests de performance initiaux montraient un temps de réponse moyen de **320 ms** pour les requêtes API depuis Douala, contre un objectif de **< 200 ms**. Cette latence dégradait l'expérience utilisateur, notamment pour le tableau de bord KPI qui nécessite des requêtes fréquentes.

**Problème :** La distance géographique (Douala → Cape Town ≈ 4 000 km) et le routage internet sous-marin entraînaient une latence excessive, aggravée par la faible qualité de la dorsale internet camerounaise.

### Sources consultées

| Source | Type | Langue | Description |
|--------|------|--------|-------------|
| [AWS Docs — Latency Optimization](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/latency-optimization.html) | Documentation officielle | 🇬🇧 Anglais | Stratégies d'optimisation de latence AWS |
| [Redis Documentation — Caching Best Practices](https://redis.io/docs/manual/eviction/) | Documentation officielle | 🇬🇧 Anglais | Configuration du cache Redis (LRU, TTL, persistence) |
| [Cloudflare Blog — Network Latency in Africa](https://blog.cloudflare.com/africa-performance-march-2023/) | Article technique | 🇬🇧 Anglais | Analyse des performances réseau en Afrique |
| [Laravel Performance Optimization — Dark Ghosty](https://darkghosty.com/post/laravel-performance-optimization) | Article technique | 🇬🇧 Anglais | Optimisation Laravel spécifique : Eager Loading, Redis Cache, Query Optimization |
| [Stack Overflow — Large Dataset JSON Response Slow](https://stackoverflow.com/questions/76893456/laravel-api-pagination-large-dataset) | Forum | 🇬🇧 Anglais | Solution de pagination cursor-based pour APIs Laravel |

### Solution retenue

**Stratégie multi-couche d'optimisation :**

#### 1. Cache distribué Redis (couche application)

```php
// Exemple : Mise en cache des KPI dashboard
$kpi = Cache::remember('dashboard:kpi:monthly', 3600, function () {
    return DB::table('orders')
        ->selectRaw('restaurant_id, COUNT(*) as total, SUM(amount) as revenue')
        ->whereBetween('created_at', [now()->subMonth(), now()])
        ->groupBy('restaurant_id')
        ->get();
});
```

- Mise en place de Redis ElastiCache (région `af-south-1`)
- Stratégie de cache : TTL de 1h pour les KPI, 15 min pour les listes de commandes
- Cache invalidation sur événement (nouvelle commande, modification client)

#### 2. Pagination cursor-based pour les listes

```php
// Pagination curseur (plus performante que offset pour les grandes listes)
$orders = Order::where('restaurant_id', $restaurantId)
    ->where('id', '>', $cursor)
    ->orderBy('id')
    ->take(50)
    ->get();
```

#### 3. Eager Loading et sélection de colonnes

```php
// Avant : N+1 queries (lent)
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->customer->name; // Requête supplémentaire
}

// Après : Optimisé
$orders = Order::with('customer:id,name')
    ->select('id', 'customer_id', 'total', 'status', 'created_at')
    ->get();
```

#### 4. Compression des réponses API

- Middleware Laravel `gzip` activé
- Headers `Accept-Encoding: gzip` + compression au niveau NGINX
- Réduction de la taille des réponses JSON de 65% en moyenne

#### 5. CDN CloudFront pour les assets statiques

- Distribution CloudFront pointant vers le bucket S3 des assets frontend
- Cache des fichiers statiques (JS, CSS, images) avec TTL de 7 jours
- Réduction du temps de chargement initial de 3,2s à 1,1s

### Résultats après optimisation

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|-------------|
| Temps de réponse moyen API | 320 ms | 145 ms | **-55%** |
| Temps de chargement dashboard KPI | 4,8 s | 1,9 s | **-60%** |
| Taille des réponses JSON | 180 KB | 63 KB (compressé) | **-65%** |
| Requêtes BDD par page | 24 (N+1) | 4 (eager loading) | **-83%** |

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Raison du rejet |
|-------------|-----------|---------------|-----------------|
| Serveur dédié Cameroun (Camtel) | Latence minimale (< 5 ms) | Infrastructure non fiable (délestages), pas de garantie SLA | Conservé pour la BDD uniquement |
| VPS OVH France (SBG) | Proximité relative Europe-Afrique | Latence 180-250 ms, données hors Afrique | Trop éloigné pour les KPI temps réel |
| Cloudflare Workers (edge computing) | Exécution au plus proche de l'utilisateur | Limité en capacité de calcul BDD | Complémentaire, pas une solution complète |

### Impact sur la qualité du composant

- **Performance** : Temps de réponse conforme à l'objectif (< 200 ms)
- **Expérience utilisateur** : Dashboard réactif, navigation fluide
- **Coûts** : Réduction des coûts cloud (moins de requêtes grâce au cache)
- **Complexité** : Infrastructure Redis + cache invalidation à maintenir
