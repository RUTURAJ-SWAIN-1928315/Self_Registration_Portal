import {React,useState,useRef,useEffect} from 'react'
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
// import AxiosInterceptor from '../AxiosInterceptor';

function NewRegistrationAadhar() {
    
    const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
    const adminToken = localStorage.getItem('adminToken');
    const [otp, setOtp] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const navigate = useNavigate();
    // const aadharData = JSON.parse(localStorage.getItem('aadharData'));
    const [isLoading,setIsLoading] = useState(false);
    const [otpInputKey, setOtpInputKey] = useState(0); // Initial key
    const aadharInputRef = useRef(null); // Create a ref for the input

    useEffect(() => {
      // Set focus on the MRN/Mobile Number input when the component mounts
      aadharInputRef.current?.focus();
    }, []);

    const resetOtpAndRefreshInput = () => {
      setOtp('');
      // Change the key to force remount the OtpInput component
      setOtpInputKey(prevKey => prevKey + 1);
    };



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
        .get(`${BACKEND_URL}/kiosk/validateAadhaar?aadhaarNo=${formattedAadharNumber}`,{
          headers:{
            'Authorization': `Bearer ${adminToken}`
          }
        })
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
            }else{
            toast.error("Aadhaar Server Down!!!!", {
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
    const [clientId,setClientId] = useState('');
    function getAadharOTP(){
        const formattedAadharNumber = aadharNumber.replace(/\s/g, ''); // Remove spaces
        axios
        .get(`${BACKEND_URL}/kiosk/getOtp?aadhaarNo=${formattedAadharNumber}`,{
          headers:{
            'Authorization': `Bearer ${adminToken}`
          }
        })
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
            }else{
            toast.error("Aadhaar Server Down!!!!", {
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

    function verifyAadharOTP(){
      setIsLoading(true);
        axios
        .get(`${BACKEND_URL}/kiosk/verifyAadhaarOtp?otp=${otp}&clientId=${clientId}`,{
          headers:{
            'Authorization': `Bearer ${adminToken}`
          }
        })
        .then((response) => {
          setIsLoading(false);
          if(response.data.status === 'success') {
           const aadharData = response.data.data;
           localStorage.setItem('aadharData',JSON.stringify(aadharData));
           navigate('/RegisterPatientDetail');
            setShowOTPInputs(true); // Set showOTPInputs state to true on arrow button click
            }
        })
        .catch((error) => {
          setIsLoading(false);
          if(error.response.status === 400){
            resetOtpAndRefreshInput();
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
          }else{
          toast.error("Aadhaar Server Down!!!!", {
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

    useEffect(() => {
      if (otp.length === 6) {
        verifyAadharOTP();
      }
    }, [otp]);
  
    const handleResend = () => {
        getAadharOTP();
    };
    // Function to mask Aadhar number except last 4 digits
    const maskAadharNumber = (number) => {
        return 'XXXX XXXX ' + number.slice(-4);
    };
  
  return (
    <div> 
    <Navbar pagename={'New Registration'} newRegistrationAadharIsCalled = {true} showOTPInputs={true}/>
    <div className='BookAppointmentBody'>
    {/* <AxiosInterceptor/> */}
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
                     onKeyDown={handleKeyPress}
                     ref={aadharInputRef}
                 />
              </div>

            {isLoading ? (
              <div className='ArrowBtn' style={{ width: '60%',background:'transparent' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress />
                    </Box>
                  </div>
            ):(
              <button className='ArrowBtn' onClick={handleArrowClick} disabled={isLoading}>
                  <EastIcon />
              </button>
            )}
             
        <button onClick={() => navigate('/NewRegistration')} className='NewRegistrationSkipButton'>
           Continue Without Aadhar
              <img src={rightIcon} alt="Right Icon" />
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
              key={otpInputKey}
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
              <div style={{width:'60%'}}>
              <button className='verifyBtn' disabled={isLoading}>
              VERIFYING.....
              </button>
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