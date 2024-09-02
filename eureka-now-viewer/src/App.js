import React from 'react';
import CheckedInUsers from './CheckedInUsers/CheckedInUsers';
import './App.css';
import SocialIcons from './SocialIcons/SocialIcons';
import Schedule from './schedule/schedule';


function App() {
  return (
    <div>
      <div className="title">EurekaNow</div>
      <div className="container">
        <div className="container-title">eureka現在の住人</div>
        <CheckedInUsers />
      </div>  
      <Schedule />
      <SocialIcons />
    </div>
    
  );
}

export default App;
