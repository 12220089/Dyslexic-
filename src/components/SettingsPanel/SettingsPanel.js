import React from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({ settings, onSettingsChange }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="settings-panel">
      <h3>Accessibility Settings</h3>
      
      <div className="setting-group">
        <label htmlFor="fontSize">Font Size</label>
        <select
          id="fontSize"
          value={settings.fontSize}
          onChange={(e) => handleSettingChange('fontSize', e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="fontFamily">Font Family</label>
        <select
          id="fontFamily"
          value={settings.fontFamily}
          onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
        >
          <option value="dyslexia-friendly">Dyslexia-Friendly</option>
          <option value="standard">Standard</option>
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="lineSpacing">Line Spacing</label>
        <select
          id="lineSpacing"
          value={settings.lineSpacing}
          onChange={(e) => handleSettingChange('lineSpacing', e.target.value)}
        >
          <option value="1.5">Tight</option>
          <option value="1.8">Normal</option>
          <option value="2.0">Wide</option>
          <option value="2.2">Extra Wide</option>
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="contrast">Color Contrast</label>
        <select
          id="contrast"
          value={settings.contrast}
          onChange={(e) => handleSettingChange('contrast', e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>

      

      <div className="settings-info">
        <h4>Tips for Better Reading:</h4>
        <ul>
          <li>Use dyslexia-friendly font for easier letter recognition</li>
          <li>Increase line spacing to reduce crowding</li>
          <li>Use high contrast mode in bright environments</li>
          <li>Larger fonts can help with word decoding</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPanel;