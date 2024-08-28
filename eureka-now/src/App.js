import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = 'https://eureka-now-backend.vercel.app/';

function App() {
  const [checkedInUsers, setCheckedInUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    // MongoDBからデータを取得
    axios.get(BACKEND_URL + 'users')
      .then(response => {
        const users = response.data;
        // ユーザーオブジェクトを適切に取得
        const checkedIn = users.filter(user => user.isCheckedIn);
        const registered = users.filter(user => !user.isCheckedIn);
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
    if (registeredUsers.some(u => u.name === name) || checkedInUsers.some(u => u.name === name)) {
      console.log('User is already registered or checked in.');
      return;
    }
  
    axios.post(BACKEND_URL + 'users', { name })
      .then(response => {
        setRegisteredUsers([...registeredUsers, response.data]); // ユーザーオブジェクトを追加
        setName('');
      })
      .catch(error => console.error('Error registering user:', error));
  };
  
  const handleCheckIn = (user) => {
    axios.put(`${BACKEND_URL}users/${user._id}`)
      .then(response => {
        setCheckedInUsers([...checkedInUsers, response.data]); // チェックインしたユーザーオブジェクトを追加
        setRegisteredUsers(registeredUsers.filter(u => u._id !== user._id)); // 登録ユーザーリストから削除
      })
      .catch(error => console.error('Error checking in user:', error));
  };

  const handleCheckOut = (user) => {
    axios.put(BACKEND_URL + `users/${user._id}`)
      .then(response => {
        setRegisteredUsers([...registeredUsers, response.data]); // チェックアウトしたユーザーオブジェクトを追加
        setCheckedInUsers(checkedInUsers.filter(u => u._id !== user._id)); // チェックインユーザーリストから削除
      })
      .catch(error => console.error('Error checking out user:', error));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div>
      <div className="title">EurekaNow</div>
      <div className="container">
        <div className="column">
          <h2>Checked-in Users</h2>
          <ul>
            {checkedInUsers.map((user, index) => (
              <li key={user._id} onClick={() => handleCheckOut(user)}>
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h2>Registered Users</h2>
          <ul>
            {registeredUsers.map((user, index) => (
              <li key={user._id} onClick={() => handleCheckIn(user)}>
                {user.name}
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
    </div>
  );
}

export default App;
