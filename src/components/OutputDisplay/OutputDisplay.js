import React from 'react';
import './OutputDisplay.css';

const OutputDisplay = ({ text, isLoading, settings, lexicalGaps }) => {
  console.log('🔍 OutputDisplay - Props received:', {
    text: text?.substring(0, 50) + '...',
    lexicalGaps: lexicalGaps,
    hasLexicalGaps: !!lexicalGaps,
    lexicalGapsLength: lexicalGaps?.length
  });

  // Function to render text with highlighted complex words
  const renderTextWithHighlights = (content, gaps) => {
    if (!content || !gaps || gaps.length === 0) {
      console.log('❌ No gaps to highlight');
      return content;
    }

    const gapWords = gaps.map(gap => gap.word);
    console.log('🎯 Looking for these words:', gapWords);

    // Simple word-by-word check
    const words = content.split(/(\s+)/);
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const isComplex = gapWords.some(gapWord => 
        gapWord.toLowerCase() === cleanWord.toLowerCase()
      );

      if (isComplex && cleanWord.length > 0) {
        console.log('✅ HIGHLIGHTING:', cleanWord);
        return (
          <span key={index} className="complex-word-highlight">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  if (isLoading) {
    return (
      <div className="output-display loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Simplifying your text...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="output-display">
      <div className="output-header">
        <h2>Simplified Text</h2>
        {text && (
          <div className="output-actions">
            <button 
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              Copy Text
            </button>
          </div>
        )}
      </div>
      
      <div 
        className="output-content"
        style={{
          fontSize: settings.fontSize === 'small' ? '14px' : 
                   settings.fontSize === 'medium' ? '16px' :
                   settings.fontSize === 'large' ? '18px' : '20px',
          lineHeight: settings.lineSpacing,
          fontFamily: settings.fontFamily === 'dyslexia-friendly' ? 
                     'Comic Sans MS, Chalkboard SE, Comic Neue, sans-serif' : 
                     'Arial, sans-serif'
        }}
      >
        {text ? (
          <div className="simplified-text">
            {text.split('\n').map((paragraph, index) => (
              <p key={index}>
                {renderTextWithHighlights(paragraph, lexicalGaps || [])}
              </p>
            ))}
            
            <div className="debug-info">
              <p><strong>Debug Info:</strong></p>
              <p>Text Length: {text.length}</p>
              <p>Lexical Gaps: {lexicalGaps ? lexicalGaps.length : 0}</p>
              <p>Lexical Gaps Words: {lexicalGaps ? lexicalGaps.map(gap => gap.word).join(', ') : 'None'}</p>
            </div>
          </div>
        ) : (
          <div className="output-placeholder">
            <p>Your simplified text will appear here...</p>
            <p>Try pasting some complex text and clicking "Simplify Text"!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;