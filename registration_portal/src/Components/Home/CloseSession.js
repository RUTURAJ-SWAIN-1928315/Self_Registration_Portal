import React from 'react'
import './CloseSession.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CloseSession() {


    const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/Home');

      for (const key in localStorage) {
        if (key !== "profileData" && key !=='adminToken') {
          localStorage.removeItem(key);
        }
      }
      
    }, 4000); 

    return () => clearTimeout(timeout);
  }, [navigate]);


  return (
    <div className='CloseSessionPage'>
         <div className='SessionConfirmBox'>
            <div className='MainLine'>
               Your Session Ended
            </div>
            <div className='SubLine'>
            Thank You for choosing us...
            </div>

         </div>
    </div>
  )
}

export default CloseSession