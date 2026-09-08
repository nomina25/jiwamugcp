/**
 * Universal clipboard utility with multi-level fallback
 * Works across modern browsers, Brave Browser, iframes, and non-secure contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern navigator.clipboard API if available
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Handled by fallback below (e.g. Brave Shields or iframe permissions)
    }
  }

  // 2. Universal fallback: create hidden textarea and execute copy command
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("readonly", "");
    textArea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.warn("Fallback execCommand copy failed:", err);
  }

  // 3. Last fallback: prompt dialog
  try {
    window.prompt("Salin tautan ini:", text);
    return true;
  } catch {
    return false;
  }
}
