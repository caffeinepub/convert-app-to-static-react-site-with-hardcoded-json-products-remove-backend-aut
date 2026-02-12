import { UI_TEXTS_RAW, UI_TEXTS_FILENAME } from '../texts/uiTextsSource';

/**
 * Triggers a browser download of the UI translations plain-text file
 */
export function downloadUiTexts(): void {
  // Create a Blob with UTF-8 encoding
  const blob = new Blob([UI_TEXTS_RAW], { type: 'text/plain;charset=utf-8' });
  
  // Create a temporary object URL
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = UI_TEXTS_FILENAME;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
