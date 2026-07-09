import React from "react";

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
  // or https://unsplash.com/photos/qqyOW9CRZbE/download?force=true
  if (trimmed.includes("unsplash.com/photos/") || trimmed.includes("unsplash.com/photo/")) {
    try {
      // Split by 'photos/' or 'photo/' to capture the section containing the ID
      const parts = trimmed.split(/\/(?:photos|photo)\//);
      if (parts.length > 1) {
        // Remove any query parameters
        const afterPhotos = parts[1].split("?")[0];
        // Split by '/' to handle any extra segments like /download
        const segments = afterPhotos.split("/");
        // The ID segment is always the first one after the photos/ split
        const idSegment = segments[0];

        // Extract the ID which is the last hyphen-separated part
        const lastSegmentParts = idSegment.split("-");
        const photoId = lastSegmentParts[lastSegmentParts.length - 1];
        if (photoId && photoId.trim()) {
          return `https://unsplash.com/photos/${photoId.trim()}/download`;
        }
      }
    } catch (e) {
      console.error("Error parsing Unsplash URL:", e);
    }
  }

  return trimmed;
}

/**
 * Robust fallback image handler if the primary image URL fails to load.
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, seed?: string) {
  const target = e.currentTarget;
  const cleanSeed = seed ? encodeURIComponent(seed) : "jiwamu-mental-health";
  if (!target.src.includes("picsum.photos")) {
    target.src = `https://picsum.photos/seed/${cleanSeed}/800/600`;
  }
}

