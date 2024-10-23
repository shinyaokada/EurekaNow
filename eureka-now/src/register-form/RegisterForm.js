import React from 'react';

function RegisterForm({handleRegister,name,setName}){
    const handleKeyDown = (event) => {
        if(event.key === 'Enter'){
            handleRegister(name,setName);
        }
    }
    return (
        
            <div className="register-column">
            <h2>Register</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
            />
              <button onClick={() => handleRegister(name,setName)}>Register</button>
            </div>
    )
}
export default RegisterForm;