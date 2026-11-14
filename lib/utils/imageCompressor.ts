/**
 * Utilitaire de compression d'images côté client via l'API Canvas.
 * Aucun service externe — tout se passe dans le navigateur.
 */

export interface CompressOptions {
  /** Largeur maximale en pixels (l'image est redimensionnée proportionnellement) */
  maxWidth: number
  /** Hauteur maximale en pixels */
  maxHeight: number
  /** Qualité JPEG/WebP (0.0–1.0) */
  quality: number
  /** Type MIME de sortie */
  outputType: 'image/webp' | 'image/jpeg'
  /** Taille maximale acceptable en octets (après compression) */
  maxBytes: number
}

export const SCREENSHOT_OPTIONS: CompressOptions = {
  maxWidth: 1280,
  maxHeight: 960,
  quality: 0.75,
  outputType: 'image/webp',
  maxBytes: 100 * 1024, // 100 Ko
}

export const AVATAR_OPTIONS: CompressOptions = {
  maxWidth: 96,
  maxHeight: 96,
  quality: 0.80,
  outputType: 'image/webp',
  maxBytes: 10 * 1024, // 10 Ko
}

/**
 * Charge un File dans une balise <img> et renvoie l'élément prêt.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Impossible de lire l\'image.'))
    }
    img.src = url
  })
}

/**
 * Compresse une image côté client.
 * @returns La chaîne base64 (data URL) ou une erreur en français.
 */
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<{ dataUrl: string; sizeKb: number } | { error: string }> {
  // Vérification du type
  if (!file.type.startsWith('image/')) {
    return { error: 'Seules les images sont acceptées (PNG, JPG, WebP…).' }
  }

  let img: HTMLImageElement
  try {
    img = await loadImage(file)
  } catch {
    return { error: 'Impossible de lire le fichier image.' }
  }

  // Calcul des dimensions cibles (ratio préservé)
  let { width, height } = img
  if (width > options.maxWidth || height > options.maxHeight) {
    const ratio = Math.min(options.maxWidth / width, options.maxHeight / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  // Dessin sur canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return { error: 'Votre navigateur ne supporte pas le Canvas.' }
  ctx.drawImage(img, 0, 0, width, height)

  // Conversion en base64
  const dataUrl = canvas.toDataURL(options.outputType, options.quality)

  // Vérification de la taille finale
  // La chaîne base64 fait environ 4/3 de la taille réelle
  const base64Data = dataUrl.split(',')[1] ?? ''
  const sizeBytes = Math.round((base64Data.length * 3) / 4)
  const sizeKb = Math.round(sizeBytes / 1024)

  if (sizeBytes > options.maxBytes) {
    const limitKb = Math.round(options.maxBytes / 1024)
    return {
      error: `L'image est trop lourde après compression (${sizeKb} Ko). Limite : ${limitKb} Ko. Choisissez une image plus petite.`,
    }
  }

  return { dataUrl, sizeKb }
}
