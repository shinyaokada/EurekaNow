import React from 'react';
import CheckedInUsers from './CheckedInUsers';
import './App.css';

function App() {
  return (
    <div>
      <div className="title">EurekaNow</div>
      <div className="container">
        <CheckedInUsers />
      </div>  
    </div>
    
  );
}

export default App;
