import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import TextInput from './components/TextInput/TextInput';
import OutputDisplay from './components/OutputDisplay/OutputDisplay';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import TTSControls from './components/TTSControls/TTSControls';
import LexicalGapExplanations from './components/LexicalGapExplanations/LexicalGapExplanations';
import FileUpload from './components/FileUpload/FileUpload';
import { simplifyText } from './services/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [lexicalGaps, setLexicalGaps] = useState([]); // Make sure this is defined
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    fontFamily: 'dyslexia-friendly',
    lineSpacing: '1.8',
    contrast: 'standard',
    ttsEnabled: false
  });

  const handleSimplify = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await simplifyText(inputText);
      console.log('🔄 App - API Response:', response); // Debug log
      setSimplifiedText(response.simplifiedText);
      setLexicalGaps(response.lexicalGaps || []); // Make sure this sets lexicalGaps
      console.log('✅ App - Set lexicalGaps:', response.lexicalGaps); // Debug log
    } catch (error) {
      console.error('Error simplifying text:', error);
      alert('Error simplifying text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (extractedText) => {
    setInputText(extractedText);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  console.log('🔍 App - Current state:', { 
    simplifiedText: simplifiedText?.substring(0, 50) + '...',
    lexicalGaps: lexicalGaps,
    lexicalGapsLength: lexicalGaps?.length 
  });

  return (
    <div className={`app ${settings.fontFamily} ${settings.contrast}`}>
      <Header />
      
      <div className="main-container">
        <div className="settings-sidebar">
          <SettingsPanel 
            settings={settings} 
            onSettingsChange={updateSettings} 
          />
          {settings.ttsEnabled && (
            <TTSControls 
              text={simplifiedText}
              settings={settings}
            />
          )}
        </div>

        <div className="content-area">
          <div className="input-section">
            <FileUpload onFileUpload={handleFileUpload} />
            <TextInput 
              value={inputText}
              onChange={setInputText}
              onSimplify={handleSimplify}
              isLoading={isLoading}
              settings={settings}
            />
          </div>

          <div className="output-section">
            <OutputDisplay 
              text={simplifiedText}
              isLoading={isLoading}
              settings={settings}
              lexicalGaps={lexicalGaps} // MAKE SURE THIS IS PASSED!
            />
            
            {lexicalGaps && lexicalGaps.length > 0 && (
              <LexicalGapExplanations 
                gaps={lexicalGaps}
                settings={settings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;