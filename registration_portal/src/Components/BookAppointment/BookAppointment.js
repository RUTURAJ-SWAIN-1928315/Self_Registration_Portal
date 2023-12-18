import React from 'react'
import Navbar from '../Navbar/Navbar'
import './BookAppointment.css'
import searchIcon from '../../Assests/Images/searchIcon.svg'

function BookAppointment() {
  return (
    <div>
      <Navbar pagename={'Book Appointment'}/>

    <div className='BookAppointmentBody'>
      <div className='OTPcardBody'>
        <div className='OTPcard'>
            <div style={{ display: 'flex', alignItems: 'center' }} className='searchBarBox'>
            <img style={{ cursor: "pointer" }} src={searchIcon} alt="search" />
             <input className='searchBarInput' placeholder='Enter MRN/Mobile Number'/>
            </div>
        </div>
      </div>


    </div>

    </div>
  )
}

export default BookAppointment