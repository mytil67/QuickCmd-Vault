# QuickCmd Vault Pro

Extension Chrome / Edge Manifest V3 pour mémoriser, organiser et copier rapidement tes lignes de commande.

## Nouveautés V2
- favoris
- catégories
- filtres projet + catégorie
- base préchargée orientée Windows / PowerShell
- commandes prêtes pour BRIX, ZAPI, Vox-Cloud, Git, npm, Firebase, Claude, Gemini

## Installation
1. Dézipper l’archive.
2. Ouvrir `chrome://extensions/` ou `edge://extensions/`
3. Activer le mode développeur
4. Cliquer sur **Charger l’extension non empaquetée**
5. Sélectionner le dossier `quickcmd-extension-v2`

## Ce qui est préchargé
- Git : status, add+commit, pull
- npm : install, dev, build, typecheck
- Firebase : hosting / functions / prod
- Vercel : deploy prod
- Windows / PowerShell : policy, lecteur F, debug
- Claude / Gemini : dossiers skills

## Conseil
Tu peux exporter en JSON avant une grosse modif pour garder une sauvegarde.


## Correctif V2.1
- popup élargie
- suppression des doubles ascenseurs
- zone de résultats scrollable uniquement quand nécessaire


## Correctif V2.2
- hauteur fixe de popup
- structure flex verticale
- un seul conteneur scrollable réel
- suppression du scroll sur html, body et conteneur principal


## V3 — Popup repensée
- plus de liste longue dans la popup
- affichage compact limité à 6 commandes
- focus sur favoris / récents
- commande affichée sur une ligne tronquée
- ouverture de la page de gestion pour la bibliothèque complète


## V3.1 — Navigation sans scroll
- 4 commandes visibles par page
- navigation précédent / suivant
- zéro ascenseur vertical dans la popup


## V3.2 — Lisibilité popup
- cartes un peu plus hautes
- colonne actions stabilisée
- titres tronqués proprement sans se faire couper par les boutons
- meilleure gestion du min-width dans la grille


## V3.3 — Espace vertical
- 3 commandes par page au lieu de 4
- pager et footer plus compacts
- cartes toujours lisibles jusqu'en bas


## V4 — Synchronisation cloud Chrome
- stockage principal dans chrome.storage.sync
- migration automatique des anciennes données locales vers le cloud Chrome
- mêmes commandes récupérables sur n'importe quel Chrome connecté au même compte
- import/export JSON conservé comme sauvegarde
