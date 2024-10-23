import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CheckedInUsers from './checked-in-users/CheckedInUsers';
import RegisteredUsers from './registered-users/RegisteredUsers';
import RegisterForm from './register-form/RegisterForm';
import EditContainer from './edit-container/EditContainer';


const BACKEND_URL = 'https://eureka-now-backend.vercel.app/';

function App() {
  const [checkedInUsers, setCheckedInUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [deleteMode,setDeleteMode] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState(0);//useEffect発火用

  useEffect(() => {
    // backendからデータを取得
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
  }, [trigger]);

  const handleRegister = (name,setName) => {
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


  const toggleDeleteMode = () => {
    setDeleteMode(prevMode => !prevMode);
  }

  const handleClose = () => {
    axios.put(BACKEND_URL + 'checkout-all')
      .then(response=>{
        try{
          setTrigger(prev => prev+1);
        }
        catch(error){
          console.error('Error checking out all (frontend)',error);
        }
        console.log("eureka closed success");
      })
      .catch(error => console.error('Error checking out all:',error))


  }

  return (
    <div>
      <div>
        <div className="title">EurekaNow</div>
        <div className="container">
          
       
          {deleteMode? 
            <EditContainer users={registeredUsers}/>
          :
            <div className="container">
              <CheckedInUsers users={checkedInUsers} handleCheckOut={handleCheckOut} />
              <RegisteredUsers users={registeredUsers} handleCheckIn={handleCheckIn}/>
              <div>
              <RegisterForm handleRegister={handleRegister} name={name} setName={setName}/>
                <div className="button-container">
                  <button onClick={handleClose}>本日の営業終了</button>
                  <button onClick={toggleDeleteMode} hidden>
                    {deleteMode ? "編集モードOFF":"編集モードON"}
                  </button>
                </div>
              </div>
            </div>
            
          }

          
        </div>
      </div>
     
    </div>
  );
}

export default App;
