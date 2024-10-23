import React from 'react';

function EditUsers({users}){
    return (
        
      <div className="column">
        <h2>編集するユーザーをクリック</h2>
        <ul>
          {users.map((user, index) => (
              <li key={user._id} onClick={() => {}}>
                {user.name}
              </li>
          ))}
        </ul>
      </div>
    )
}
export default EditUsers;