import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./CheckedInUsers.css"

const BACKEND_URL = 'https://eureka-now-backend.vercel.app/';

function CheckedInUsers() {
  const [checkedInUsers, setCheckedInUsers] = useState([]);

  useEffect(() => {
    const fetchCheckedInUsers = async () => {
      try {
        const response = await axios.get(BACKEND_URL + 'users');
        const users = response.data.filter(user => user.isCheckedIn);
        setCheckedInUsers(users);
      } catch (error) {
        console.error('Error fetching checked-in users:', error);
      }
    };

    fetchCheckedInUsers();
  }, []);

  return (
    <div>
      <ul className="user-list">
        {checkedInUsers.length > 0 ? (
            checkedInUsers.map((user) => (
              <li className="user-item" key={user.id}>{user.name}</li>
            ))
          ) : (
            <li className="no-users">チェックインしているユーザーはいません。</li> // メッセージを表示
        )}
      </ul>
    </div>
  );
}

export default CheckedInUsers;
