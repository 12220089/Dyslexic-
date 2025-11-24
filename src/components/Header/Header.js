import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="header-icon">📖</span>
          Dyslexia-Friendly Text Rewriter
        </h1>
        <p className="header-subtitle">
          Making complex text accessible for everyone
        </p>
      </div>
    </header>
  );
};

export default Header;