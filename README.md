# MindLog

MindLog est une application web moderne de blog personnel construite avec Next.js 16, TypeScript, Tailwind CSS, Firebase et une expérience UI inspirée de Medium, Hashnode, Notion et Ghost.

## Fonctionnalités principales

- Page d’accueil élégante et responsive
- Blog avec liste d’articles, recherche et filtres
- Article détaillé avec commentaires et interactions
- Dashboard auteur pour gérer ses contenus
- Catégories et recherche instantanée
- Mode sombre
- SEO et métadonnées dynamiques
- Architecture modulaire et prête pour la production

## Stack technique

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Firebase Authentication / Firestore / Storage
- next-themes

## Installation

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env.local` avec vos variables Firebase
4. Lancez le projet : `npm run dev`

## Variables d’environnement

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Déploiement Vercel

1. Connectez votre dépôt à Vercel
2. Ajoutez les variables d’environnement
3. Déployez

## Firebase rules (exemple)

### Firestore

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
    }
  }
}
```
# blog
