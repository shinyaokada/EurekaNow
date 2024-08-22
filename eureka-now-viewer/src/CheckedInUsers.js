import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckedInUsers() {
  const [checkedInUsers, setCheckedInUsers] = useState([]);

  useEffect(() => {
    const fetchCheckedInUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
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
      <ul>
        {checkedInUsers.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CheckedInUsers;
