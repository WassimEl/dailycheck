# Rituel — Checklist quotidienne

App PWA : checklist santé du jour, réinitialisée chaque matin, historique
local avec statistiques, jauge d'hydratation, info-bulles, thèmes de
couleur, catégories réordonnables/masquables, et vraies notifications de
rappel via OneSignal (fonctionnent même app fermée).

Tient en 4 fichiers :
- `index.html` — tout le code de l'app (structure, style, logique)
- `manifest.json` — config PWA, icônes incluses en base64
- `sw.js` — service worker de l'app (cache hors-ligne)
- `OneSignalSDKWorker.js` — service worker dédié requis par OneSignal
  (une seule ligne — leur système ne permet pas de le fusionner avec `sw.js`
  sans casser leurs mises à jour automatiques)

## Configurer OneSignal (rappel du soir, gratuit)

1. **Crée un compte** sur https://onesignal.com (gratuit) — fait ✅
2. **Crée une App** dans le dashboard → "Web Push" → nom + URL du site —
   fait ✅, App ID déjà intégré dans `index.html`
3. Déploie (ou redéploie) le dossier complet sur Vercel — les 4 fichiers
   doivent être à la racine
4. Ouvre l'app sur ton téléphone, va dans Réglages (⚙) et active
   "Rappel en soirée" — accepte la permission de notification. **Répète
   cette étape sur l'appareil de la deuxième personne**, chacun doit
   l'activer depuis son propre téléphone
5. Dans le dashboard OneSignal, va dans **Journeys** (ou **Automated
   Messages** selon la version) → crée un nouveau message :
   - Déclencheur : programmé chaque jour à 20:00
   - Filtre (Data Tags) : `reminder_opt_in` = `true` ET `completed_today`
     différent de `true`
   - Texte : ce que tu veux, par exemple "Ta checklist du jour t'attend 👋"
6. C'est tout — teste avec le bouton "Send test message" du dashboard, ou
   attends 20h avec une checklist incomplète

L'app envoie automatiquement les tags `reminder_opt_in` et
`completed_today` à OneSignal à chaque changement, dès que le rappel est
activé — tu n'as rien d'autre à coder.

## Déployer sur Vercel

**Sans Git :**
1. https://vercel.com/new → glisse-dépose le dossier `daily-checklist`
2. Vercel détecte un site statique automatiquement

**Avec Git (recommandé) :**
```bash
cd daily-checklist
git init
git add .
git commit -m "Rituel"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/rituel-checklist.git
git push -u origin main
```
Puis importe le dépôt depuis https://vercel.com/new (Framework Preset :
"Other", pas de build command).

## Installer sur ton téléphone

- **Android (Chrome)** : ouvre l'URL → menu ⋮ → "Ajouter à l'écran d'accueil"
- **iPhone (Safari)** : ouvre l'URL → bouton Partager → "Sur l'écran
  d'accueil". Pour les notifications, iOS exige que l'app soit installée
  ainsi (pas juste ouverte dans Safari), et iOS 16.4 minimum.

## Personnaliser la checklist

Ouvre `index.html`, cherche `CHECKLIST_CATEGORIES` en haut du `<script>`.
Chaque item accepte `id`, `text`, `info` (optionnel) et `type: "water"`
(réservé à l'item hydratation).

## Où vivent tes données

Tout est en local (`localStorage`), rien n'est envoyé sur un serveur — sauf
les deux tags OneSignal (`reminder_opt_in`, `completed_today`) si tu actives
le rappel, envoyés à OneSignal pour cibler la notification. Utilise le
bouton **Exporter** (onglet Statistiques) régulièrement, et **Importer**
pour restaurer une sauvegarde sur un autre appareil (réglages inclus).
