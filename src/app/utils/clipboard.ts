/**
 * Copy text to clipboard with fallback support
 * 
 * This function tries multiple methods to copy text:
 * 1. Modern Clipboard API (navigator.clipboard.writeText)
 * 2. Legacy execCommand('copy') method
 * 3. Alert dialog as last resort
 * 
 * @param text - The text to copy
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for when clipboard API is blocked
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    
    document.body.removeChild(textArea);
    
    if (success) {
      return true;
    }
    
    // If all else fails, show the text in an alert
    alert(`Copy this text:\n\n${text}`);
    return false;
  } catch (err) {
    console.error("Failed to copy:", err);
    // Last resort: show the text in an alert
    alert(`Copy this text:\n\n${text}`);
    return false;
  }
}

// Export alias for backward compatibility
export const safeCopyToClipboard = copyToClipboard;