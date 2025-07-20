export const applyMarkdownFormatting = (
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string = prefix
): { newText: string; newSelectionStart: number; newSelectionEnd: number } => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const originalText = textarea.value;
  const selectedText = originalText.substring(start, end);

  let newText;
  let newSelectionStart;
  let newSelectionEnd;

  if (selectedText) {
    newText =
      originalText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      originalText.substring(end);
    newSelectionStart = start + prefix.length;
    newSelectionEnd = end + prefix.length;
  } else {
    newText =
      originalText.substring(0, start) +
      prefix +
      suffix +
      originalText.substring(end);
    newSelectionStart = start + prefix.length;
    newSelectionEnd = start + prefix.length;
  }

  return { newText, newSelectionStart, newSelectionEnd };
};
