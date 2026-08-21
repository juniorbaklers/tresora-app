# Brief design — Trésora

> Prompt autonome. Copiez tout ce qui suit dans Claude (ou tout autre outil de design)
> pour travailler l'interface sans avoir à réexpliquer le projet.

---

Tu es directeur artistique sur **Trésora**, une plateforme de gestion financière
multi-espace déjà en production. Je ne pars pas de zéro : une identité visuelle
existe et fonctionne. Ton travail est de la **pousser plus loin**, pas de la
remplacer.

## Le produit

Trésora permet à une église, un groupe, une association ou une personne seule de
gérer sa trésorerie : cotisations, recettes, dépenses, événements, membres,
rapports. Le concept central est l'**espace** : chaque organisation est une
trésorerie indépendante, et un même utilisateur peut en gérer plusieurs sans que
les données se mélangent jamais.

Le seul canal financier entre deux espaces est la **contribution inter-espace** :
l'église demande une somme à un groupe, voit ce qui est versé, mais ne voit
jamais comment le groupe a réuni l'argent.

- **Utilisateurs** : trésoriers d'églises et de groupes, souvent bénévoles, pas
  experts en informatique. Abidjan, Côte d'Ivoire.
- **Terrain** : beaucoup consultent sur un téléphone Android d'entrée de gamme,
  parfois en connexion faible. Le mobile n'est pas un cas secondaire.
- **Langue** : français intégral. Devise : FCFA (XOF).
- **Ce que l'app remplace** : des cahiers manuscrits et des fichiers Excel.

## L'identité actuelle

Elle est ancrée dans le **tissage ouest-africain** — c'est ce qui la distingue
d'une fintech générique. À conserver et à approfondir.

**Palette (mode clair)**
| Rôle | Hex |
|---|---|
| Fond (coton écru) | `#F6F1E7` |
| Carte | `#FFFCF6` |
| Texte (encre indigo) | `#1B2338` |
| Texte secondaire | `#6E6555` |
| Indigo profond (aplats) | `#16203A` |
| Safran / or (accent) | `#C88A2E` |
| Vert palme (recettes) | `#16694F` |
| Terre de Korhogo (dépenses) | `#B34A24` |
| Bordure | `#E2D9C8` |

**Mode sombre** : fond `#101827`, carte `#17223A`, texte `#F0E8DA`, or `#E0A33E`,
palme `#3E9C7A`, terre `#D2703F`.

Règle : **aucun gris pur**. Tous les neutres sont teintés chaud.

**Typographie**
- Titres : **Fraunces** (serif variable, axe `WONK` à 1, `SOFT` à 0)
- Interface : **Plus Jakarta Sans**
- Chiffres et tableaux : **IBM Plex Mono**, `font-variant-numeric: tabular-nums`

**Motifs** — bibliothèque maison dans `src/components/brand/motif.tsx` :
- `BandeTissee` : bande horizontale de segments de largeurs **inégales** (comme
  les duites d'un pagne), déclinée en tonalités or / palme / terre / indigo / mixte
- `LisiereVerticale` : la même, pivotée
- `TrameLosange` et `TrameChevron` : textures SVG pour les aplats sombres

**Signature** : la pile de « carnets » sur l'écran de connexion — chaque espace
est un livret de compte empilé et légèrement pivoté. C'est la métaphore du
produit : des trésoreries distinctes qui coexistent sans se mélanger.

## Contraintes non négociables

1. **Pas de symboles adinkra.** Ils portent des significations précises ; les
   employer en décor serait négligent. La géométrie tissée reste abstraite.
2. **Les chiffres priment.** C'est de l'argent réel géré par des bénévoles qui
   rendent des comptes. Aucun effet ne doit gêner la lecture d'un montant.
3. **Accessibilité WCAG AA** : contraste ≥ 4.5:1 sur le texte courant. La palette
   actuelle est vérifiée (texte 13.9:1, terre 4.8:1, palme 5.9:1) — ne la
   dégradez pas.
4. **Mobile d'abord**, sans débordement horizontal, cibles tactiles ≥ 44px.
5. **Sobriété assumée.** Le cahier des charges initial demande d'éviter une
   esthétique trop religieuse ou trop décorative. L'identité doit dire :
   confiance, transparence, sécurité, organisation.

## Ce qu'il ne faut surtout pas faire

Ce sont les réflexes qui trahissent une interface générée automatiquement :

- Dégradés violet-bleu ou cyan-violet
- Glassmorphism, effets de verre dépoli
- Néon acide sur fond très sombre
- Texte en dégradé sur les indicateurs chiffrés
- Ombres portées molles sur des rectangles arrondis, partout, sans intention
- Six cartes de poids identique alignées en grille : c'est plat, rien ne ressort

## Pile technique

Next.js 16 (App Router, export statique), React, TypeScript, Tailwind CSS v4
avec tokens en variables CSS, shadcn/ui (base Radix), Recharts, lucide-react.
Les propositions doivent être réalisables avec cette pile — pas de dépendance
lourde supplémentaire.

## Écrans existants

Connexion, inscription, vérification par code, mot de passe oublié, compte et
sécurité · Onboarding en 4 étapes (type d'espace, nom, modules, invitations) ·
Sélection d'espaces · Tableau de bord (une version église, une version groupe) ·
Trésorerie (vue d'ensemble, recettes, dépenses, clôture du dimanche) ·
Cotisations (liste, détail avec suivi des paiements) · Événements · Contributions
inter-espaces · Membres · Rapports avec filtres et exports · Rôles et
permissions · Journal d'audit · Paramètres.

## Ta mission

Choisis **un** écran ou un moment précis du parcours et propose une direction qui
le rend mémorable, sans casser le système existant.

Pour chaque proposition, donne-moi :

1. **Le diagnostic** — qu'est-ce qui est tiède aujourd'hui, et pourquoi
2. **Le parti pris** — une phrase, défendable
3. **Le détail d'exécution** — typographie (tailles, graisses, interlignage),
   couleurs prises dans la palette, espacements, motifs mobilisés
4. **Le moment signature** — l'élément qu'on retiendra de cet écran
5. **Ce que tu as volontairement laissé calme** — parce que tout ne peut pas
   crier en même temps
6. **Le code** — composants React + Tailwind utilisant les tokens existants
   (`bg-card`, `text-muted-foreground`, `var(--gold)`…), jamais de hex en dur

Prends **un vrai risque esthétique** et justifie-le. Si ta proposition
ressemble à ce qu'on obtiendrait pour n'importe quelle app de finance,
recommence.
