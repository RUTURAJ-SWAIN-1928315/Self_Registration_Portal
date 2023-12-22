import {React,useState} from 'react'
import Navbar from '../Navbar/Navbar';
import searchIcon from '../../Assests/Images/searchIcon.svg';
import EastIcon from '@mui/icons-material/East';
import OtpInput from "otp-input-react";
import OtpTimer from "otp-timer";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,useSearchParams  } from 'react-router-dom';
import rightIcon from '../../Assests/Images/rightIcon.svg';
import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';

function NewRegistrationAadhar() {
    
    const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
    const [otp, setOtp] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const navigate = useNavigate();
    // const aadharData = JSON.parse(localStorage.getItem('aadharData'));
    const [isLoading,setIsLoading] = useState(false);



    const [showOTPInputs, setShowOTPInputs] = useState(false);

    const [searchParams] = useSearchParams();
    //const BackShowOTPInputs = localStorage.getItem('BackShowOTPInputs');
    
    const handleAadharChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Removes non-digit characters
        if (value.length <= 12) {
            setAadharNumber(value.replace(/(.{4})/g, '$1 ').trim()); // Formats in groups of 4 digits
        }
    };
    
    const handleArrowClick = () => {

        if (aadharNumber.replace(/\s/g, '').length === 0){
            toast.info("Please enter Aadhar Number.", {
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
        if (aadharNumber.replace(/\s/g, '').length !== 12) {
            toast.error("Invalid Aadhar number.", {
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
        setIsLoading(true);
        validateAadhar()
      
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleArrowClick();
        }
    };
 
    function validateAadhar(){
        const formattedAadharNumber = aadharNumber.replace(/\s/g, ''); // Remove spaces
        axios
        .get(`${BACKEND_URL}/kiosk/validateAadhaar?aadhaarNo=${formattedAadharNumber}`)
        .then((response) => {
            setIsLoading(false);
          if(response.data.status === 'success') {
            getAadharOTP();
            setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
            }
        })
        .catch((error) => {
          setIsLoading(false);
            if(error.response.status === 400){
                toast.error("Invalid Aadhar number.", {
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
    const [clientId,setClientId] = useState('');
    function getAadharOTP(){
        const formattedAadharNumber = aadharNumber.replace(/\s/g, ''); // Remove spaces
        axios
        .get(`${BACKEND_URL}/kiosk/getOtp?aadhaarNo=${formattedAadharNumber}`)
        .then((response) => {
          if(response.data.status === 'success') {
            setClientId(response.data.client_id);
           
            setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
            }
        })
        .catch((error) => {
            if(error.response.status === 400){
                toast.error("Invalid Aadhar number.", {
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
    console.log("OTP",otp)
    function verifyAadharOTP(){
      setIsLoading(true);
        axios
        .get(`${BACKEND_URL}/kiosk/verifyAadhaarOtp?otp=${otp}&clientId=${clientId}`)
        .then((response) => {
          setIsLoading(false);
          if(response.data.status === 'success') {
           const aadharData = response.data.data;
           localStorage.setItem('aadharData',JSON.stringify(aadharData));
           navigate('/RegisterPatientDetail');
            setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
            }
            else{
                toast.error("Invalid OTP entered.", {
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
        getAadharOTP();
    };
    // Function to mask Aadhar number except last 4 digits
    const maskAadharNumber = (number) => {
        return 'XXXX XXXX ' + number.slice(-4);
    };
  
  return (
    <div> 
    <Navbar pagename={'New Registration'} showOTPInputs={true}/>
    <div className='BookAppointmentBody'>
        <div className='OTPcardBody' style={{width:'45%'}}>
          {!showOTPInputs ? (
            <div className='OTPcard'>
              <div style={{ display: 'flex', alignItems: 'center' }} className='searchBarBox'>
                <img style={{ cursor: 'pointer', paddingLeft: '10px' }} src={searchIcon} alt='search' />
                <input
                 type="tel" 
                     className='searchBarInput'
                     placeholder='Enter Patient Aadhar Number'
                     value={aadharNumber}
                     onChange={handleAadharChange}
                 />
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
             
              <button onClick={() => navigate('/NewRegistration')} className='NewRegistrationSkipButton'>
          SKIP<img src={rightIcon} alt="Right Icon" />
        </button>
            </div>
          ) : (
            <div className='OTPPrompt'>
              <div className='OTPheader'>
                Enter OTP
              </div>
          
                  <div className='OTPsubheader'>
                  An OTP has been sent to mobile number linked with aadhar {maskAadharNumber(aadharNumber)}
                  </div>
              
              <OtpInput
              style={{ margin: "5%", gap:'10%',justifyContent:'space-evenly'  }}
              OTPLength={6}
              value={otp}
              onChange={setOtp}
              otpType="number"
              disabled={false}
              autoFocus
            ></OtpInput>

            <div style={{display:'flex', flexDirection:'row', alignContent:'center', justifyContent:'space-around', alignItems:'center'}}>
              
              <OtpTimer
                minutes={10}
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
              <button className='verifyBtn' onClick={verifyAadharOTP}>
               VERIFY
              </button>
             </div>
          )}

            </div>


            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
    
  )
}

export default NewRegistrationAadhar