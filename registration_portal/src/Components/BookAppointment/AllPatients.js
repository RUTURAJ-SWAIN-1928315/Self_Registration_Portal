import React, { useState } from 'react';
import './AllPatient.css';
import Navbar from '../Navbar/Navbar';
import malesign from '../../Assests/Images/malesign.svg';
import femalesign from '../../Assests/Images/femalesign.svg';
import defaultPatient from '../../Assests/Images/defaultPatient.svg';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { LinearProgress, Box } from '@mui/material';
import axios from 'axios';

function AllPatients() {
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const storedData = localStorage.getItem('AlreadyRegisteredPatientDetails');
  const alreadyRegisteredPatientDetails = storedData ? JSON.parse(storedData) : { data: [] };
  const patientLoginOTP = localStorage.getItem('patientLoginOTP');
  const [isLoading,setIsLoading] = useState(false);
  const navigate= useNavigate();
 // const alreadyRegisteredPatientDetails = JSON.parse(localStorage.getItem('AlreadyRegisteredPatientDetails'));

  console.log("alreadyRegisteredPatientDetails", alreadyRegisteredPatientDetails);

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (index) => {
    setSelectedCard(index === selectedCard ? null : index);
   
   localStorage.setItem("selectedPatientMRNO",alreadyRegisteredPatientDetails[index].mrno);
    patientLogin(alreadyRegisteredPatientDetails[index].mrno,patientLoginOTP,alreadyRegisteredPatientDetails[index].contactNo);
    // fetchPatientDetails(alreadyRegisteredPatientDetails[index].mrno)
  };

  function patientLogin(mrno,otp,contactNo){
    setIsLoading(true);
    axios
    .post(`${BACKEND_URL}/kiosk/patient/login?mrno=${mrno}&otp=${otp}&mobileNo=${contactNo}`)
    .then((response) => {
      setIsLoading(false);
      if(response.data.status === 'success') {
         fetchPatientDetails(mrno)
         localStorage.removeItem('patientLoginOTP');
        }
    })
    .catch((error) => {
      if(error.response.status === 400){
        toast.error("Invalid Input!!!!", {
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

  function fetchPatientDetails(mrno){
    setIsLoading(true);
    axios
    .get(`${BACKEND_URL}/kiosk/fetchPatientDetails?input=${mrno}`)
    .then((response) => {
      setIsLoading(false);
      if(response.data.status === 'success') {
        localStorage.setItem("AlreadyRegisteredPatientDetails",JSON.stringify(response.data.data[0]))
        navigate('/BookAppointmentLanding');
        }
    })
    .catch((error) => {
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

  return (
    <div className='AllPatientPage'>
      <Navbar pagename={"Already Registration"} allPatientsIsCalled = {true}/>
      <div className='detailBox'>
        <div className='detailboxContainer'>
          <div className='cardHeader'>
            <div className='cardHeaderBoldText'>
              Select Patient Profile
            </div>
            {isLoading ? (
            <div className='cardHeadersubText'>
              We found multiple patients registered with this mobile number
              <LinearProgress />
            </div>
            ):(
               <> 
              <div className='cardHeadersubText'>
              We found multiple patients registered with this mobile number
            </div>        
              </> 
            )}
          </div>

            <div className='Patientcard'>
            {alreadyRegisteredPatientDetails && alreadyRegisteredPatientDetails.map((patient, index) => (
                    <div
                   key={index}
                    className={`innerPatientCard  ${selectedCard === index ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(index)}
                    >
                    <div style={{display:'flex', width:'100%',gap:'20px'}}>
                        <div style={{width:'80px'}}>
                           <img style={{height:'77px',width:'77px', borderRadius:'50%'}} src={ patient.photo || defaultPatient} alt="" />
                        </div>
                        <div className='innerPatientCardBox'>
                           <div className='innerPatientCardBoxNameRow'>
                           <div className='innerPatientCardBoxName'>{`${patient.patientName}`}</div>
                           <div className='genderbox'>
                            <span><img src={patient.gender === 'MALE' ? malesign : femalesign} alt="" /></span>
                            <span className='genderRound'>{patient.gender}</span>
                          </div>
                           </div>
                           <div>
                              <span>Age : </span>
                              <span>{`${patient.ageStr}(${patient.dob})`}</span>
                            </div>
                        </div>
                    </div>
                </div>
          ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default AllPatients;
