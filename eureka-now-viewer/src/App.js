import React from 'react';
import CheckedInUsers from './CheckedInUsers';
import './App.css';
import SocialIcons from './SocialIcons';



function App() {
  return (
    <div>
      <div className="title">EurekaNow</div>
      <div className="container">
        <CheckedInUsers />
      </div>  
      <SocialIcons />
    </div>
    
  );
}

export default App;
