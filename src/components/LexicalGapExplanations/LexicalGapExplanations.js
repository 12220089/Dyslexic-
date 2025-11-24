import React, { useState } from 'react';
import './LexicalGapExplanations.css';

const LexicalGapExplanations = ({ gaps, settings }) => {
  const [expandedGaps, setExpandedGaps] = useState({});

  const toggleGap = (gapId) => {
    setExpandedGaps(prev => ({
      ...prev,
      [gapId]: !prev[gapId]
    }));
  };

  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="lexical-gaps">
      <h3>Word Explanations</h3>
      <p className="gaps-intro">
        These words didn't have simple synonyms, so we've provided explanations:
      </p>
      
      <div className="gaps-list">
        {gaps.map((gap, index) => (
          <div key={index} className="gap-item">
            <button 
              className="gap-header"
              onClick={() => toggleGap(index)}
            >
              <span className="gap-word">{gap.word}</span>
              <span className="gap-toggle">
                {expandedGaps[index] ? '−' : '+'}
              </span>
            </button>
            
            {expandedGaps[index] && (
              <div className="gap-content">
                <div className="gap-definition">
                  <strong>Definition:</strong> {gap.definition}
                </div>
                {gap.examples && gap.examples.length > 0 && (
                  <div className="gap-examples">
                    <strong>Examples:</strong>
                    <ul>
                      {gap.examples.map((example, exIndex) => (
                        <li key={exIndex}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {gap.alternatives && gap.alternatives.length > 0 && (
                  <div className="gap-alternatives">
                    <strong>Similar words:</strong> {gap.alternatives.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LexicalGapExplanations;