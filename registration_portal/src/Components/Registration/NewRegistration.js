import React from 'react'
import Navbar from '../Navbar/Navbar'
import './NewRegistration.css'


function NewRegistration() {
  return (
    <div>
       <Navbar pagename={'New Registration'}/>

      <div className='capturePageBody'>
        <div className='captureContainer'>
          <div className='captureHeader'>Patient Photo</div>
          <div className='capturePhoto'></div>
          <div> <button className='capureButton'>Capture</button></div>
        </div>

        
      </div>

    </div>
  )
}

export default NewRegistration