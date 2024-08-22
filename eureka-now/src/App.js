import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [checkedInUsers, setCheckedInUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    // MongoDBからデータを取得
    axios.get('http://localhost:5000/users')
      .then(response => {
        const users = response.data;
        const checkedIn = users.filter(user => user.isCheckedIn).map(user => user.name);
        const registered = users.filter(user => !user.isCheckedIn).map(user => user.name);
        setCheckedInUsers(checkedIn);
        setRegisteredUsers(registered);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleRegister = () => {
    if (!name) {
      console.log('Please enter a name.');
      return;
    }
    if (registeredUsers.includes(name) || checkedInUsers.includes(name)) {
      console.log('User is already registered or checked in.');
      return;
    }
  
    axios.post('http://localhost:5000/users', { name })
      .then(response => {
        setRegisteredUsers([...registeredUsers, response.data.name]);
        setName('');
      })
      .catch(error => console.error('Error registering user:', error));
  };
  
  const handleCheckIn = (user) => {
    const userId = registeredUsers.find(u => u === user);
    axios.put(`http://localhost:5000/users/${userId}`)
      .then(response => {
        setCheckedInUsers([...checkedInUsers, response.data.name]);
        setRegisteredUsers(registeredUsers.filter(u => u !== response.data.name));
      })
      .catch(error => console.error('Error checking in user:', error));
  };

  const handleCheckOut = (user) => {
    const userId = checkedInUsers.find(u => u === user);
    axios.put(`http://localhost:5000/users/${userId}`)
      .then(response => {
        setRegisteredUsers([...registeredUsers, response.data.name]);
        setCheckedInUsers(checkedInUsers.filter(u => u !== response.data.name));
      })
      .catch(error => console.error('Error checking out user:', error));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <div className="column">
        <h2>Checked-in Users</h2>
        <ul>
          {checkedInUsers.map((user, index) => (
            <li key={index} onClick={() => handleCheckOut(user)}>
              {user}
            </li>
          ))}
        </ul>
      </div>

      <div className="column">
        <h2>Registered Users</h2>
        <ul>
          {registeredUsers.map((user, index) => (
            <li key={index} onClick={() => handleCheckIn(user)}>
              {user}
            </li>
          ))}
        </ul>
      </div>

      <div className="register-column">
        <h2>Register</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your name"
        />
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default App;
