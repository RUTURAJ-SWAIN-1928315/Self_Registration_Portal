import React, { useState, useEffect } from 'react';
import './SelfRegistrationConfirmation.css'
import Correct from '../../Assests/Images/CorrectImg.svg'
import { useNavigate } from 'react-router-dom';

function SelfRegistrationConfirmation() {

    const newRegistrationHIMSResponse = JSON.parse(localStorage.getItem('newRegistrationHIMSResponse'));
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    console.log("newRegistrationHIMSResponse", newRegistrationHIMSResponse)
    const handleUnderstoodClick = () => {
      setShowDialog(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowDialog(true);
        }, 1000); // Set the delay to 1000 milliseconds (1 second)
    
        return () => clearTimeout(timer); // Clear the timeout on component unmount
      }, []);


      const handleGoHome = () => {
        navigate('/Home');
      };  

      const handleBookAppointmenr = () => {
        navigate('/NewRegisterBookConsultation');
      }; 


  return (
    <div className='ConfirmationPage'>
        <div className='MainContainer'>
            <div className='SuccessContainer'>
                <div>
                    <img src={Correct} alt="Correct" />
                </div>
                <div className='RegistrationText'>
                    Self Registration Successful!
                </div>
                <div className='PatientTextBox'>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div className='HeadText'>
                            Patient Name :
                        </div>
                        <div className='SubText'>
                          {newRegistrationHIMSResponse.patientName}
                        </div>
                    </div>
                    {/* Changed it to reference No: and showing message on recommendation of HIS Team */}
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div className='HeadText'>
                            Reference No: 
                        </div>
                        <div className='SubText'>
                         {newRegistrationHIMSResponse.message}
                        </div>
                    </div>
                    

                </div>

            </div>
            <div className='QuestionContainer'>
                <div className='QuestionText'>
                  Do you want to proceed to book a doctor's appointment?
                </div>
                <div className='ButtonGroupBox'>
                    <button onClick={handleGoHome} className='GoHomeBtn'><span className='GoHomeBtnText'>No, Go Home</span></button>
                    <button onClick={handleBookAppointmenr} className='GoAheadBtn'><span className='GoAheadBtnText'>Yes, Book Appointment</span></button>
                </div>
            </div>
        </div>
        
        {showDialog && (
        <>
        <div className='DarkOverlay'></div>
        <div className='DialogBox'>
            <div className='DialogText'>
                <div className='NoteText'>
                   Note 
                </div>
                <div className='MsgText'>
                  Kindly pay registration charge at the billing counter <br /> to confirm your registration.
                </div>
            </div>
            <button className='GoAheadBtn' onClick={handleUnderstoodClick}>
              <span className='GoAheadBtnText'>Understood</span>
            </button>
          </div>
        </>    
      )}
    </div>
  )
}

export default SelfRegistrationConfirmation