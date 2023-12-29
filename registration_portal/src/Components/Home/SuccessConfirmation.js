import React from 'react'
import { useEffect } from 'react';
import './SuccessConfirmation.css';
import Correct from '../../Assests/Images/CorrectImg.svg'
import { useNavigate } from 'react-router-dom';

function SuccessConfirmation() {

 const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/Home');

      for (const key in localStorage) {
        if (key !== "profileData") {
          localStorage.removeItem(key);
        }
      }
      
    }, 7000); 

    return () => clearTimeout(timeout);
  }, [navigate]);





  return (
    <div className='SuccessConfirmationPage'>
       <div className='ConfirmBox'>
        <div>
          <div className='ImgMsgBox'>
            <img src={Correct} alt="Correct" />
          </div>
          <div className='SuccessMsg'>
            Consultation Booked Successfully!
          </div>
          
        </div>
        <div className='DetailMsgBox'>
            <div className='HeaderMsgText'> 
                 Appointment Details
            </div>
            <div className='InformationBox'>

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Patient Name :
                        </div>
                        <div className='TextInfo'>
                            Adhishika Dash
                        </div>
                    </div> 

                    {/* <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            MRN :
                        </div>
                        <div className='TextInfo'>
                            KIMS2019415251
                        </div>
                    </div>  */}

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Appointment Date :
                        </div>
                        <div className='TextInfo'>
                            23-11-2023
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Doctor Name :
                        </div>
                        <div className='TextInfo'>
                            Amresh Misra
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Department :
                        </div>
                        <div className='TextInfo'>
                            Cardiology
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Slot :
                        </div>
                        <div className='TextInfo'>
                            10:00 AM - 10:29 AM
                        </div>
                    </div> 


            </div>
        </div>

       </div>
       
    </div>
  )
}

export default SuccessConfirmation