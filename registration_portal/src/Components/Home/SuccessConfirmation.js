import React, { useState } from 'react'
import { useEffect } from 'react';
import './SuccessConfirmation.css';
import Correct from '../../Assests/Images/CorrectImg.svg'
import { useNavigate } from 'react-router-dom';

function SuccessConfirmation() {

const newRegistrationSuccessConfirmation = JSON.parse(localStorage.getItem('newRegistrationSuccessConfirmation'));
const alreadyRegisteredSuccessConfirmation = JSON.parse(localStorage.getItem('alreadyRegisteredSuccessConfirmation'));

const [tableData,setTableData] = useState({
    mrno:'',
    patientName:'',
    appointmentDate:'',
    doctorName:'',
    department:'',
    slotFromTime:'',
    slotToTime:'',
})

useEffect(() => {
    if(newRegistrationSuccessConfirmation){
        setTableData({
            patientName:newRegistrationSuccessConfirmation.patientName,
            appointmentDate:formatDate(newRegistrationSuccessConfirmation.appointmentDate),
            doctorName:newRegistrationSuccessConfirmation.doctorName,
            department:newRegistrationSuccessConfirmation.department,
            slotFromTime:formatSlotTime(newRegistrationSuccessConfirmation.slotFromTime),
            slotToTime:formatSlotTime(newRegistrationSuccessConfirmation.slotToTime),
        });
    }else{
        setTableData({
            mrno:alreadyRegisteredSuccessConfirmation.mrno,
            patientName:alreadyRegisteredSuccessConfirmation.patientName,
            appointmentDate:formatDate(alreadyRegisteredSuccessConfirmation.appointmentDate),
            doctorName:alreadyRegisteredSuccessConfirmation.doctorName,
            department:alreadyRegisteredSuccessConfirmation.department,
            slotFromTime:formatSlotTime(alreadyRegisteredSuccessConfirmation.slotFromTime),
            slotToTime:formatSlotTime(alreadyRegisteredSuccessConfirmation.slotToTime),
        });
    }

}, []);

const formatDate = (date) => {
    const d = new Date(date);
    const day = (`0${d.getDate()}`).slice(-2); // Add leading 0 and slice last two digits
    const month = (`0${d.getMonth() + 1}`).slice(-2); // Add leading 0 and slice last two digits
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};  

const formatSlotTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    let hours = date.getHours();
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };
  


 const navigate = useNavigate();

 useEffect(() => {
    let timeout;
  
    if (newRegistrationSuccessConfirmation) {
      timeout = setTimeout(() => {
        navigate('/Home');
  
        // Clear localStorage for all keys except 'profileData'
        for (const key in localStorage) {
          if (key !== "profileData") {
            localStorage.removeItem(key);
          }
        }
      }, 10000);
    } else {
      // If newRegistrationSuccessConfirmation is not present, navigate to another route
      timeout = setTimeout(() => {
        navigate('/BookAppointmentLanding');
      }, 10000);
    }
  
    return () => clearTimeout(timeout);
  }, [newRegistrationSuccessConfirmation, navigate]);
  





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
                        {tableData.patientName}
                        </div>
                    </div> 

                    {!newRegistrationSuccessConfirmation  && (
                    <>
                     <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            MRN :
                        </div>
                        <div className='TextInfo'>
                           {tableData.mrno}
                        </div>
                    </div>
                    </>
                    )}  

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Appointment Date :
                        </div>
                        <div className='TextInfo'>
                            {tableData.appointmentDate}
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Doctor Name :
                        </div>
                        <div className='TextInfo'>
                           {tableData.doctorName}
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Department :
                        </div>
                        <div className='TextInfo'>
                            {tableData.department}
                        </div>
                    </div> 

                    <div className='InfoLine'> 
                        <div className='TitleInfo'>
                            Slot :
                        </div>
                        <div className='TextInfo'>
                            {tableData.slotFromTime} - {tableData.slotToTime}
                        </div>
                    </div> 


            </div>
        </div>

       </div>
       
    </div>
  )
}

export default SuccessConfirmation