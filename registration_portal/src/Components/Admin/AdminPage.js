import React, { useState } from 'react';
import './AdminPage.css';

function AdminPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='AdminPage'>
      <div className='AdminContainer'>
        <div className='HeaderSignin'>
          ADMIN LOGIN
        </div>
        <div className='InputfieldContainer'>
          <div>
            <input
              className='inputBox'
              type="text"
              placeholder='User Name'
            />
          </div>
          <div style={{display:'flex', flexDirection:'column'}}>
            <input
              className='inputBox'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your Password'
            />
            <label>
              <input
                type="checkbox"
                onChange={toggleShowPassword}
              />
              Show Password
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className='SigninButton'>
              Log-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
