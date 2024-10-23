import React from 'react';

function EditUsers({users,handleCheckIn}){
    return (
        
      <div className="column">
        <h2>編集するユーザーをクリック</h2>
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
export default EditUsers;