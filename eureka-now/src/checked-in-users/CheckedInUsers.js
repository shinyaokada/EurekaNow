import React from 'react';

function CheckedInUsers({ users, handleCheckOut }) {
  return (
    <div className="column">
      <h2>現在の住人</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => handleCheckOut(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheckedInUsers;
