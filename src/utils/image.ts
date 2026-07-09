/**
 * Utility functions for handling and resolving image URLs,
 * especially for Unsplash page URLs to direct image download links.
 */

export function getUnsplashDirectUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If it's already a direct images.unsplash.com URL, return it
  if (trimmed.includes("images.unsplash.com")) {
    return trimmed;
  }

  // If it's an Unsplash photos page URL, e.g.
  // https://unsplash.com/photos/man-in-uniform-rests-with-brooms-at-night-qqyOW9CRZbE
  // or https://unsplash.com/photos/qqyOW9CRZbE
  if (trimmed.includes("unsplash.com/photos/") || trimmed.includes("unsplash.com/photo/")) {
    try {
      // Split by 'photos/' or 'photo/' to capture the section containing the ID
      const parts = trimmed.split(/\/(?:photos|photo)\//);
      if (parts.length > 1) {
        // Remove any query parameters
        const afterPhotos = parts[1].split("?")[0];
        // Split by '/' to handle any extra segments
        const segments = afterPhotos.split("/");
        const lastSegment = segments[segments.length - 1];

        // Extract the ID which is the last hyphen-separated part
        const lastSegmentParts = lastSegment.split("-");
        const photoId = lastSegmentParts[lastSegmentParts.length - 1];
        if (photoId && photoId.trim()) {
          return `https://unsplash.com/photos/${photoId.trim()}/download?force=true`;
        }
      }
    } catch (e) {
      console.error("Error parsing Unsplash URL:", e);
    }
  }

  return trimmed;
}
