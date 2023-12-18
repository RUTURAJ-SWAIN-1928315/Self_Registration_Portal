import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './BookAppointment.css';
import searchIcon from '../../Assests/Images/searchIcon.svg';
import EastIcon from '@mui/icons-material/East';
import OtpInput from "otp-input-react";
import OtpTimer from "otp-timer";

function BookAppointment() {

  const [otp, setOtp] = useState('');


  const [showOTPInputs, setShowOTPInputs] = useState(false);
  

  const handleArrowClick = () => {
    setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
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
              <div style={{display: 'flex', flexDirection:'row'}}>
                <div className='OTPsubheader'>
                An OTP has been sent to xxxxxx7272 
                </div>
                <div className='OTPTimer'>
                <OtpTimer
                seconds={3}
                text="Re-Send OTP in"
                ButtonText="Resend OTP"
                textColor={"green"}
              />
                </div>
              
              </div>
              <OtpInput
              style={{ margin: "15% 0% 15% 3%" }}
              OTPLength={4}
              value={otp}
              onChange={setOtp}
              otpType="number"
              disabled={false}
              autoFocus
            ></OtpInput>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
