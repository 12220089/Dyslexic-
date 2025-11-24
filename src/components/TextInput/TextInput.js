import React from 'react';
import './TextInput.css';

const TextInput = ({ value, onChange, onSimplify, isLoading, settings }) => {
  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onSimplify();
    }
  };

  return (
    <div className="text-input-container">
      <div className="text-input-header">
        <h2>Input Text</h2>
        <div className="text-input-actions">
          <button 
            className="clear-btn"
            onClick={() => onChange('')}
            disabled={isLoading}
          >
            Clear
          </button>
          <button 
            className="simplify-btn"
            onClick={onSimplify}
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? 'Simplifying...' : 'Simplify Text'}
          </button>
        </div>
      </div>
      
      <div className="textarea-wrapper">
        <div className="textarea-container">
          <textarea
            className="text-input"
            value={value}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder="Paste or type your complex text here..."
            disabled={isLoading}
            style={{
              fontSize: settings.fontSize === 'small' ? '14px' : 
                       settings.fontSize === 'medium' ? '16px' :
                       settings.fontSize === 'large' ? '18px' : '20px',
              lineHeight: settings.lineSpacing,
              fontFamily: settings.fontFamily === 'dyslexia-friendly' ? 
                         'Comic Sans MS, Chalkboard SE, Comic Neue, sans-serif' : 
                         'Arial, sans-serif'
            }}
          />
        </div>
        
        {/* <div className="text-input-example">
          <p><strong>Example:</strong> 'The quintessential manifestation of cognitive dissonance in contemporary society is ubiquitous.'</p>
        </div> */}
        
        <div className="text-input-footer">
          <span className="char-count">{value.length} characters</span>
          {/* <span className="shortcut-hint">Ctrl + Enter to simplify</span> */}
        </div>
      </div>
    </div>
  );
};

export default TextInput;