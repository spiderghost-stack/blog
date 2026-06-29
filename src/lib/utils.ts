export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// src/lib/utils.ts

/**
 * Nettoie et convertit les URLs brutes (Google Drive, redirections Google)
 * en liens directs exploitables par une balise <img />
 */
export function cleanImageUrl(url: string): string {
  if (!url) return "";

  // 1. Si c'est un lien de redirection Google Search
  if (url.includes("google.com/url?")) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const actualUrl = urlParams.get('url');
      if (actualUrl) {
        url = decodeURIComponent(actualUrl);
      }
    } catch (e) {
      console.error("Erreur lors du décodage de l'URL Google :", e);
    }
  }

  // 2. Si c'est un lien de partage Google Drive standard
  if (url.includes("drive.google.com/file/d/")) {
    // Cette regex extrait l'ID unique du fichier entre /d/ et /view
    const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matches && matches[1]) {
      const fileId = matches[1];
      // On retourne le lien direct d'image via l'hébergement Google
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    }
  }

  return url;
}