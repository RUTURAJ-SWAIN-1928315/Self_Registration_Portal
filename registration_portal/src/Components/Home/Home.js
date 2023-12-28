import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Home.css'
import NewRegistrationImage from '../../Assests/Images/NewRegistration.svg';
import BookAppointment from '../../Assests/Images/BookAppointment.svg'
import AboutKims from '../../Assests/Images/AboutKIMS.svg'
import MyLocation from '../../Assests/Images/MyLocation.svg'
import feedback from '../../Assests/Images/feedback.svg'
import faq from '../../Assests/Images/faq.svg'
import axios from 'axios';
import poweredBySoulCare from '../../Assests/Images/poweredBySoulCare.svg';
import hospitaLogo from '../../Assests/Images/hospitalLogo.svg';

function Home() {
    localStorage.removeItem('aadharData');
    //localStorage.removeItem('capturedPhoto');
    const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
    const loginUserName = process.env.REACT_APP_USERNAME;
    const loginPassword = process.env.REACT_APP_PASSWORD;
    

    //For logging into Kiosk
    useEffect(() => {
        axios
          .get(`${BACKEND_URL}/kiosk/login?userName=${loginUserName}&password=${loginPassword}`)
          .then((response) => {
            if(response.data) {
                console.log("response.data.profile",JSON.stringify(response.data.profile));
                // Store 'siteId' in localStorage
                localStorage.setItem('profileData', JSON.stringify(response.data.profile));
              }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
        }, [BACKEND_URL,loginUserName,loginPassword]);

    const navigate = useNavigate();

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
        alert(`Clicked on handlefeedbackCardClick`);
    };

    const handlefaqCardClick = () => {
        navigate('/faqs');
    };


    return (
    
    <div className='HomeContainer'>
        <div className='HomeContainerBody'>
        {/* <div className='poweredBySoulCareImageDiv'>
        <img src={poweredBySoulCare} alt="poweredBySoulCare" className='poweredBySoulCareImage'/> 
        </div> */}

        <div className='logoHeaderBox'>
        <div><img src={hospitaLogo} alt="" className='hospitalLogoImage'/></div>
        <div><img src={poweredBySoulCare} alt="" className='poweredBySoulCareImage'/> </div>

        </div>
            <div className='HomeContainerRow'>

                <div className='cardBody' onClick={handleRegisterCardClick}>
                    <div><img src={NewRegistrationImage} alt="registion" /> </div>
                    <div className='cardBodyHeader'>New Registration</div>
                    <div className='cardBodyTxt'>Registration & appointment booking</div>
                </div>
                <div className='cardBody' onClick={handleBookAppointmentCardClick}>
                    <div><img src={BookAppointment} alt="BookAppointment"/> </div>
                    <div className='cardBodyHeader'>Already Registered</div>
                    <div className='cardBodyTxt'>check-in, appointment booking, lab reports, bills</div>
                </div>
                {/* <div className='cardBody' onClick={handleLabReportCardClick} >
                    <div><img src={LabReport} alt="LabReport" /> </div>
                    <div className='cardBodyHeader'>Lab Reports</div>
                    <div className='cardBodyTxt'>for patients done lab test</div>
                </div> */}

            </div>

            <div className='HomeContainerRow'>

                <div className='cardBody2' onClick={handleAboutKimsCardClick}>
                    <div><img src={AboutKims} alt="AboutHos" /> </div>
                    <div className='cardBodyHeader2'>About Hospital</div>
                </div>
                {/* <div className='cardBody2' onClick={handleMyLocationCardClick}>
                    <div><img src={MyLocation} alt="MyLocation" /> </div>
                    <div className='cardBodyHeader2'>My Location</div>
                </div> */}
                <div className='cardBody2'onClick={handlefeedbackCardClick}>
                    <div><img src={feedback} alt="feedback" /> </div>
                    <div className='cardBodyHeader2'> Feedback </div>
                </div>
                <div className='cardBody2' onClick={handlefaqCardClick}>
                    <div><img src={faq} alt="faq" /> </div>
                    <div className='cardBodyHeader2'>FAQs</div>
                </div>

            </div>

        </div>

    </div>
    )
  }

  export default Home;