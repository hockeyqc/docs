# Documentation de Hockey Québec

Site statique publié avec GitHub Pages à
[docs.hockey.qc.ca](https://docs.hockey.qc.ca).

## Structure

```text
/
├── index.html                Page d'accueil
├── CNAME                     Domaine personnalisé GitHub Pages
├── assets/
│   ├── app.js                Affichage et recherche dans le catalogue
│   ├── documents.js          Métadonnées des documents
│   ├── styles.css            Styles de la page d'accueil
│   └── logo-hockey-quebec.webp
└── docs/
    └── meep-2026.html        Document HTML autonome
```

## Ajouter un document

1. Déposer le fichier HTML autonome dans `docs/` avec un nom court, descriptif
   et sans espace.
2. Ajouter son entrée dans `assets/documents.js`.
3. Vérifier localement le site en lançant `python -m http.server 8000` à la
   racine du dépôt, puis en ouvrant `http://localhost:8000`.

La page d'accueil, les cartes et la recherche sont générées automatiquement à
partir du tableau `window.HOCKEY_QUEBEC_DOCUMENTS`. Il n'est pas nécessaire de
modifier `index.html` ou `assets/app.js` pour publier un nouveau document.

Chaque entrée du catalogue doit fournir :

- `title` : titre public du document;
- `description` : résumé court affiché sur la carte;
- `href` : chemin relatif vers le fichier;
- `type` : type de document, par exemple `Guide`, `Politique` ou `Procédure`;
- `edition` : édition, saison ou année;
- `publishedAt` : date au format `AAAA-MM-JJ`, utilisée pour le tri;
- `keywords` : termes supplémentaires utilisés par la recherche.
