import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './BookAppointment.css';
import searchIcon from '../../Assests/Images/searchIcon.svg';
import EastIcon from '@mui/icons-material/East';
import OtpInput from "otp-input-react";
import OtpTimer from "otp-timer";
import { useNavigate } from 'react-router-dom'

function BookAppointment() {

  const navigate= useNavigate();
  const [otp, setOtp] = useState('');


  const [showOTPInputs, setShowOTPInputs] = useState(false);
  

  const handleArrowClick = () => {
    setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
  };

  const handleResend = () => {
    console.log(otp);
  };

  const handleVerifyClick = () => {
    navigate('/BookAppointmentLanding');
  };

  return (
    <div>
      <Navbar pagename={'Book Appointment'} />

      <div className='BookAppointmentBody'>
        <div className='OTPcardBody'>
          {!showOTPInputs ? (
            <div className='OTPcard'>
              <div style={{ display: 'flex', alignItems: 'center' }} className='searchBarBox'>
                <img style={{ cursor: 'pointer', paddingLeft: '10px' }} src={searchIcon} alt='search' />
                <input className='searchBarInput' placeholder='Enter MRN/Mobile Number' />
              </div>

              <button className='ArrowBtn' onClick={handleArrowClick}>
                <EastIcon />
              </button>
            </div>
          ) : (
            <div className='OTPPrompt'>
              <div className='OTPheader'>
                Enter OTP
              </div>
          
                  <div className='OTPsubheader'>
                  An OTP has been sent to xxxxxx7272 
                  </div>
              
              <OtpInput
              style={{ margin: "5%", gap:'10%',justifyContent:'space-evenly'  }}
              OTPLength={4}
              value={otp}
              onChange={setOtp}
              otpType="number"
              disabled={false}
              autoFocus
            ></OtpInput>

            <div style={{display:'flex', flexDirection:'row', alignContent:'center', justifyContent:'space-around', alignItems:'center'}}>
              
              <OtpTimer
                minutes={0}
                seconds={3}
                text="Time Remaining:"
                ButtonText="Resend OTP"
                resend={handleResend}
                textColor={"green"}
                buttonColor={"green"}
                background= {"var(--Scarpa-Flow-800, #42424A)"}               
              />

             <div style={{width:'60%'}}>
              <button onClick={handleVerifyClick} className='verifyBtn'>
               VERIFY
              </button>
             </div>

            </div>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
