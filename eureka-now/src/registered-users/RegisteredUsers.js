import React from 'react';

function RegisteredUsers({users,handleCheckIn}){
    return (
        
      <div className="column">
        <h2>登録済み住人</h2>
        <ul>
          {users.map((user, index) => (
            <div>
              <li key={user._id} onClick={() => handleCheckIn(user)}>
                {user.name}
              </li>
            </div>
          ))}
        </ul>
      </div>
    )
}
export default RegisteredUsers;