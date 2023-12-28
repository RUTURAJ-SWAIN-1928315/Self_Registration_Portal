import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './BookAppointment.css';
import searchIcon from '../../Assests/Images/searchIcon.svg';
import EastIcon from '@mui/icons-material/East';
import OtpInput from "otp-input-react";
import OtpTimer from "otp-timer";
import { useNavigate } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';


function BookAppointment() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const [MRNMobileNumber,setMRNMobileNumber] = useState('');
  const [OTPresponse,setOTPResponse] = useState([]);

  const [isLoading,setIsLoading] = useState(false);
  const navigate= useNavigate();
  const [otp, setOtp] = useState('');


  const [showOTPInputs, setShowOTPInputs] = useState(false);

  const handleMRNMobileNumberChange = (e) =>{
    setMRNMobileNumber(e.target.value);
  }
  console.log("MRNMobileNumber",MRNMobileNumber)
  
  function isAlphanumeric(str) {
    // Use a regular expression to check if the string contains only alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
  }

  const handleArrowClick = () => {
    if (/^\d+$/.test(MRNMobileNumber)) {
      // If MRNMobileNumber contains only numbers
      validateMobileNumber();
    } else if (isAlphanumeric(MRNMobileNumber)) {
      // If MRNMobileNumber contains alphanumeric input
      validateMRN();
    } else {
      // Handle invalid input (neither alphanumeric nor numeric)
      toast.error("Invalid MRN/Mobile Number Entered.", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  function validateMRN(){
    setIsLoading(true);
      axios
      .post(`${BACKEND_URL}/kiosk/generateOTP?mrno=${MRNMobileNumber}`)
      .then((response) => {
        setIsLoading(false);
        if(response.data.status === 'success') {
          setOTPResponse(response.data);
          setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
          }
          else{
              toast.info("This MRN is not Registered to our System. Kindly Check the number or Apply for New Registration", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              return;
          }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Something Went Wrong!!!!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error('Error fetching data:', error);
      return;
        
      });
      
  }
  function validateMobileNumber(){
    setIsLoading(true);
      axios
      .post(`${BACKEND_URL}/kiosk/generateOTP?mobileNo=${MRNMobileNumber}`)
      .then((response) => {
        setIsLoading(false);
        console.log("response",response)
        if(response.data.status === 'success') {
          setOTPResponse(response.data);
          setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
          }
          else{
              toast.info("This Mobile Number is not Registered to our System. Kindly Check the number or Apply for New Registration.", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              return;
          }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Something Went Wrong!!!!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error('Error fetching data:', error);
      return;
        
      });
      
  }

  const handleResend = () => {
    handleArrowClick();
  };

  // const handleVerifyClick = () => {
  //   navigate('/BookAppointmentLanding');
  // };

  const handleVerifyClick = () => {
    if (/^\d+$/.test(MRNMobileNumber)) {
      // If MRNMobileNumber contains only numbers
      verifyMobileOTP();
    } else if (isAlphanumeric(MRNMobileNumber)) {
      // If MRNMobileNumber contains alphanumeric input
      verifyMRNOTP();
    } else {
      // Handle invalid input (neither alphanumeric nor numeric)
      toast.error("Invalid MRN/Mobile Number Entered.", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    //setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
  };


  function verifyMRNOTP(){
    setIsLoading(true);
      axios
      .post(`${BACKEND_URL}/kiosk/verifyOTP?mrno=${MRNMobileNumber}&otp=${otp}`)
      .then((response) => {
        setIsLoading(false);
        if(response.data.status === 'success') {
          loadPatientDetails();
          }
          else{
              toast.error("Invalid OTP Entered.", {
                  position: "top-right",
                  autoClose: 800,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              return;
          }
      })
      .catch((error) => {
        setIsLoading(false);
        if(error.response.status === 400){
          toast.error("Invalid OTP Entered.", {
            position: "top-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        return;
        }else{
        toast.error("Something Went Wrong!!!!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error('Error fetching data:', error);
      return;
      }
      });
      
  }
  function verifyMobileOTP(){
    setIsLoading(true);
      axios
      .post(`${BACKEND_URL}/kiosk/verifyOTP?mobileNo=${MRNMobileNumber}&otp=${otp}`)
      .then((response) => {
        setIsLoading(false);
        if(response.data.status === 'success') {
          loadPatientDetails();
          }
          else{
              toast.error("Invalid OTP Entered.", {
                  position: "top-right",
                  autoClose: 800,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              return;
          }
      })
      .catch((error) => {
        setIsLoading(false);
        if(error.response.status === 400){
          toast.error("Invalid OTP Entered.", {
            position: "top-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        return;
        }else{
        toast.error("Something Went Wrong!!!!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error('Error fetching data:', error);
      return;
      }
      });
      
  }
  
  function loadPatientDetails(){
    setIsLoading(true);
    axios
    .get(`${BACKEND_URL}/kiosk/fetchPatientDetails?input=${MRNMobileNumber}`)
    .then((response) => {
      setIsLoading(false);
      if(response.data.status === 'success') {
        localStorage.setItem("AlreadyRegisteredPatientDetails",JSON.stringify(response.data.data))
        navigate('/AllPatients');
        }
    })
    .catch((error) => {
      setIsLoading(false);
      toast.error("Something Went Wrong!!!!", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error fetching data:', error);
    return;
    });
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleArrowClick();
    }
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
                <input className='searchBarInput' placeholder='Enter MRN/Mobile Number' value={MRNMobileNumber} onChange={handleMRNMobileNumberChange}/>
              </div>

              {isLoading ? (
              <div className='ArrowBtn' style={{ width: '60%',background:'transparent' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress />
                    </Box>
                  </div>
            ):(
              <button className='ArrowBtn' onClick={handleArrowClick} onInput={handleKeyPress} disabled={isLoading}>
                  <EastIcon />
              </button>
            )}
            </div>
          ) : (
            <div className='OTPPrompt'>
              <div className='OTPheader'>
                Enter OTP
              </div>
          
                  <div className='OTPsubheader'>
                  An OTP has been sent to {OTPresponse.mobileNo} 
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
                minutes={3}
                seconds={0}
                text="Time Remaining:"
                ButtonText="Resend OTP"
                resend={handleResend}
                textColor={"var(--Jade-500, #1ACD81)"}
                buttonColor={"var(--Jade-500, #1ACD81)"}
                background= {"var(--Scarpa-Flow-800, #42424A)"}               
              />

              {isLoading ? (
              <div className='ArrowBtn' style={{ width: '60%',background:'transparent' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress />
                    </Box>
                  </div>
            ):(
             <div style={{width:'60%'}}>
              <button className='verifyBtn' onClick={handleVerifyClick}>
               VERIFY
              </button>
             </div>
          )}

            </div>


            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
}

export default BookAppointment;
