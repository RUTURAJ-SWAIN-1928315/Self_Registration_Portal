import React from 'react'
import './Home.css'
import NewRegistrationImage from '../../Assests/Images/NewRegistration.svg';
import BookAppointment from '../../Assests/Images/BookAppointment.svg'
import LabReport from '../../Assests/Images/LabReport.svg'
import AboutKims from '../../Assests/Images/AboutKIMS.svg'
import MyLocation from '../../Assests/Images/MyLocation.svg'
import feedback from '../../Assests/Images/feedback.svg'
import faq from '../../Assests/Images/faq.svg'


function Home() {

    const handleCardClick = (cardName) => {
        alert(`Clicked on ${cardName} card!`);
    };



    return (
    
    <div className='HomeContainer'>
        <div className='HomeContainerBody'>
            <div className='HomeContainerRow'>

                <div className='cardBody' onClick={() => handleCardClick('New Registration')}>
                    <div><img src={NewRegistrationImage} alt="registion" /> </div>
                    <div className='cardBodyHeader'>New Registration</div>
                    <div className='cardBodyTxt'>for patients not registered yet</div>
                </div>
                <div className='cardBody'>
                    <div><img src={BookAppointment} alt="BookAppointment" /> </div>
                    <div className='cardBodyHeader'>Book Appointment</div>
                    <div className='cardBodyTxt'>for patients already registered</div>
                </div>
                <div className='cardBody'>
                    <div><img src={LabReport} alt="LabReport" /> </div>
                    <div className='cardBodyHeader'>Lab Reports</div>
                    <div className='cardBodyTxt'>for patients done lab test</div>
                </div>

            </div>

            <div className='HomeContainerRow'>

                <div className='cardBody2'>
                    <div><img src={AboutKims} alt="AboutKims" /> </div>
                    <div className='cardBodyHeader2'>About KIMS</div>
                </div>
                <div className='cardBody2'>
                    <div><img src={MyLocation} alt="MyLocation" /> </div>
                    <div className='cardBodyHeader2'>My Location</div>
                </div>
                <div className='cardBody2'>
                    <div><img src={feedback} alt="feedback" /> </div>
                    <div className='cardBodyHeader2'> Feedback </div>
                </div>
                <div className='cardBody2'>
                    <div><img src={faq} alt="faq" /> </div>
                    <div className='cardBodyHeader2'>FAQs</div>
                </div>

            </div>

        </div>

    </div>
    )
  }

  export default Home;