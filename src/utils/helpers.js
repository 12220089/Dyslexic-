// Utility functions for text processing and accessibility

export const calculateReadabilityScore = (text) => {
  if (!text) return 0;
  
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const characters = text.replace(/\s/g, '').length;
  
  if (words === 0 || sentences === 0) return 0;
  
  const averageWordsPerSentence = words / sentences;
  const averageSyllablesPerWord = estimateSyllables(text) / words;
  
  // Simple Flesch Reading Ease approximation
  const score = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
  return Math.max(0, Math.min(100, score));
};

export const estimateSyllables = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => total + countSyllablesInWord(word), 0);
};

export const countSyllablesInWord = (word) => {
  word = word.replace(/'/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/e$/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

export const formatTextForDisplay = (text, settings) => {
  if (!text) return '';
  
  let formattedText = text;
  
  // Apply formatting based on settings
  if (settings.fontFamily === 'dyslexia-friendly') {
    // Ensure proper spacing for dyslexia-friendly display
    formattedText = formattedText.replace(/\s+/g, ' ');
  }
  
  return formattedText;
};

export const exportText = (text, format = 'txt') => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `simplified-text.${format}`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};