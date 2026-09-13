# Rituel — Checklist quotidienne

App statique (pas de build, pas de dépendances) qui affiche une checklist
santé du jour, se réinitialise chaque matin, garde un historique local et
peut s'installer comme une app sur ton téléphone (PWA).

Tient en 3 fichiers :
- `index.html` — tout le code (structure, style, logique, liste des items)
- `manifest.json` — config PWA, icônes incluses en base64
- `sw.js` — service worker (doit rester un fichier à part, obligatoire pour le mode hors-ligne)

## Déployer sur Vercel

**Option la plus rapide (sans Git) :**
1. Va sur https://vercel.com/new
2. Choisis "Deploy" puis glisse-dépose le dossier `daily-checklist` complet
3. Vercel détecte un site statique automatiquement, aucune config nécessaire

**Option avec Git (recommandée pour pouvoir mettre à jour facilement) :**
```bash
cd daily-checklist
git init
git add .
git commit -m "Rituel — première version"
```
Puis pousse ce dépôt sur GitHub et importe-le depuis https://vercel.com/new
(Framework Preset : "Other", pas de build command, output = racine).

## Installer sur ton téléphone

Une fois l'URL Vercel obtenue (ex: `rituel.vercel.app`) :
- **Android (Chrome)** : ouvre le lien → menu ⋮ → "Ajouter à l'écran d'accueil"
- **iPhone (Safari)** : ouvre le lien → bouton Partager → "Sur l'écran d'accueil"

L'app s'ouvrira ensuite comme une vraie app, sans barre d'adresse.

## Personnaliser la checklist

Ouvre `index.html`, cherche le bloc `CHECKLIST_CATEGORIES` en haut du
`<script>` : ajoute, retire ou reformule des items librement. Évite juste
de changer l'`id` d'un item existant une fois que tu as commencé à cocher
des jours — l'historique s'appuie dessus.

## Où vivent tes données

Tout est stocké en local sur l'appareil (`localStorage`), rien n'est envoyé
sur un serveur. Deux conséquences :
- Si tu changes de téléphone/navigateur, tu ne retrouveras pas ton
  historique automatiquement
- Utilise le bouton **Exporter** (onglet Historique) régulièrement pour
  télécharger une sauvegarde JSON, et **Importer** pour la restaurer

Si un jour tu veux une sync automatique entre appareils, il faudra ajouter
un petit backend (Vercel KV, Supabase, ou le système de Gist que tu utilises
déjà sur FlowBoard) — dis-le-moi et on l'ajoutera.
