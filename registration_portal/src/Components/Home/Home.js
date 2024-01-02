import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Home.css';
import NewRegistrationImage from '../../Assests/Images/NewRegistration.svg';
import BookAppointment from '../../Assests/Images/BookAppointment.svg'
import hospitalPic from '../../Assests/Images/AboutKIMS.svg'
import feedback from '../../Assests/Images/feedback.svg'
import faq from '../../Assests/Images/faq.svg'
import poweredBySOUL from '../../Assests/Images/poweredBySOUL.svg'

function Home() {

    const navigate = useNavigate();
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    localStorage.removeItem('aadharData');

    const handleRegisterCardClick = () => {
        navigate('/NewRegistrationAadhar');
    };
   

    const handleBookAppointmentCardClick = () => {
        navigate('/BookAppointment');
    };

    const handleAboutKimsCardClick = () => {
        navigate('/hospitalDetails');
    };

    // const handleMyLocationCardClick = () => {
    //     alert(`Clicked on handleMyLocationCardClick`);
    // };

    const handlefeedbackCardClick = () => {
        navigate(`/WorkInProgress`);
    };

    const handlefaqCardClick = () => {
        navigate('/faqs');
    };

// console.log("aadharData",localStorage.getItem('aadharData'),"alreadyRegistered:",localStorage.getItem('AlreadyRegisteredPatientDetails'),"profileData",localStorage.getItem('profileData'))

    return (
    
        <div className='HomePage'>

        <div className='NavBarContainerBox'>
            <div className='HospitalNamediv'>
                <div>
                    <img style={{height:'90px', width:'90px', borderRadius:'50%' }} src={hospitalPic} alt="Hospital" />
                </div>
                <div className='HospitalName'>
                    <div>
                       {profileData.siteName}
                    </div>
                    <div className='HospitalLoc'>
                        {profileData.serviceCenterName}
                    </div>
                </div> 
            </div>
            <div>
                <img src={poweredBySOUL} alt="" />
            </div>
        </div>

        <div className='HomeContainerBox'>
            <div className='FirstRowBox'>
               <div className='ModuleContainer' onClick={handleRegisterCardClick} >
                  <div>
                    <img src={NewRegistrationImage} alt="registion" />
                  </div>
                  <div className='ModuleHeader'>
                    New Registration
                  </div>
                  <div className='ModuleSubTitle'>
                    Registration & appointment booking
                  </div>
               </div>
               <div className='ModuleContainer' onClick={handleBookAppointmentCardClick} > 
                  <div>
                    <img src={BookAppointment} alt="BookAppointment"/>    
                  </div>
                  <div className='ModuleHeader'>
                     Already Registered
                  </div>
                  <div className='ModuleSubTitle'>
                  check-in, appointment booking, lab reports, bills
                  </div>
               </div>
            </div>
            <div className='SecondRowBox'>
            <div className='ModuleContainer' onClick={handleAboutKimsCardClick} >
                  <div>
                    <img src={hospitalPic} alt="AboutHos"/>
                  </div>
                  <div className='ModuleSubTitleSecond'>
                     About Hospital
                  </div>
               </div>
               <div className='ModuleContainer' onClick={handlefeedbackCardClick}>
                  <div>
                     <img src={feedback} alt="feedback" /> 
                  </div>
                  <div className='ModuleSubTitleSecond'>
                       Feedback
                  </div>
               </div>
               <div className='ModuleContainer' onClick={handlefaqCardClick}>
                  <div>
                    <img src={faq} alt="faq" />
                  </div>
                  <div className='ModuleSubTitleSecond'>
                    FAQs
                  </div>
               </div>
            </div>

        </div>


    </div>
  )
}

export default Home