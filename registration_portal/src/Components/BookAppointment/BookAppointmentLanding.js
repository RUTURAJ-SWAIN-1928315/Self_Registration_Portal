import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import PatientCard from '../Navbar/PatientCard'
import './BookAppointmentLanding.css'
import opdCheckin from "../../Assests/Images/opdCheckin.svg"
import bookConsultant from "../../Assests/Images/bookConsultant.svg"
import billing from "../../Assests/Images/billing.svg"
import labReport from "../../Assests/Images/labReport1.svg"

function BookAppointmentLanding() {

   const navigate = useNavigate();

   const handleLabReportClick = () => {
      navigate('/LabReport');
  };

  const handleBillingClick = () => {
   navigate('/Billing');
};

const handleBookConsultationClick = () => {
   navigate('/BookAppointment');
};




  return (
    <>
    <div style={{background:'#EFF2F7', height:'100vh'}}>    
     <Navbar pagename={'Already Registered'}/>
     <PatientCard/>

     <div className='landingContentBox'>
      <div className='blockContent'>
         <div>
          <img src={opdCheckin} alt="OPD CheckIn" />
         </div>
         <div className='imgTitle'>
         OPD Check-in
         </div>
         <div className='imgSubTitle'>
         for pre-booked appointments
         </div>
      </div>

      <div className='blockContent' onClick={handleBookConsultationClick}>
      <div>
          <img src={bookConsultant} alt="bookConsultant" />
         </div>
         <div className='imgTitle'>
         Book Consultation
         </div>
         <div className='imgSubTitle'>
         Book new appointment with doctor
         </div>
      </div>

      <div className='blockContent' onClick={handleLabReportClick} >
      <div>
          <img src={labReport} alt="labReport" />
         </div>
         <div className='imgTitle'>
         Lab Reports
         </div>
         <div className='imgSubTitle'>
         Get your lab test report
         </div>
      </div>

      <div className='blockContent' onClick={handleBillingClick}>
      <div>
          <img src={billing} alt="billing" />
         </div>
         <div className='imgTitle'>
         Billing
         </div>
         <div className='imgSubTitle'>
         Pay your Bills & generate invoice
         </div>
      </div>

     </div>

     </div>

    </>
  )
}

export default BookAppointmentLanding