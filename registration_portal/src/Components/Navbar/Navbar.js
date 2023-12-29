import React from 'react'
import './Navbar.css'
import HomeIcon from "../../Assests/Images/HomeIcon.svg"
import RightArrow from "../../Assests/Images/right.svg"
import LeftArrow from "../../Assests/Images/left.svg"
// import BackButton from "../../Assests/Images/backButton.svg"
import { useNavigate } from 'react-router-dom'
import navBarPatientDetail from "../../Assests/Images/navBarPatientDetail.svg";
import NewRegisterBookConsultation from "../../Assests/Images/navBarNewRegisterBookConsultation.svg";


function Navbar(props) {

  const navigate = useNavigate()
  // console.log("pageName", props.pagename)

  const handleBackNavigate = () =>{
    const BackShowOTPInputs = props.showOTPInputs;
    //localStorage.setItem('BackShowOTPInputs', BackShowOTPInputs.toString()); // Convert the boolean to a string
    if(props.showOTPInputs){
      navigate(`/NewRegistrationAadhar`);
    }

  }

  const handleBackButton = ()=>{
    window.history.back();
  }

  const handleCloseSession = ()=>{
    navigate(`/Home`);
  }
  
  return (
    <div className='NavbarContainer'>

     <div style={{gap:'10px', display:'flex', flexDirection:'row', alignItems: 'center'}}>

     {!props.bookAppointmentIsCalled && !props.allPatientsIsCalled && !props.opdCheckinIsCalled && !props.billingIsCalled &&
     !props.labReportIsCalled && !props.bookConsultationIsCalled && (
      <>
      <div> <img src={HomeIcon} alt="Home" onClick={() => navigate('/Home')} /> </div>
      <div> <img src={RightArrow} alt="rightArrow" /> </div>
      </>
      )} 
      


      {!props.registerPatientDetailIsCalled && !props.NewRegisterBookConsultationIsCalled && !props.BookAppointmentLandingIsCalled && ( 
      <>
      <div className='BackBtn' onClick={handleBackButton}>
        <img src={LeftArrow} alt="" />
        <button className='insideBtn'>Back</button>
      </div>
      </>
      )}

      <div className='PageNameContainer'> {props.pagename} </div>
      {props.registerPatientDetailIsCalled && (
        <div style={{marginLeft:'200px'}}> <img src={navBarPatientDetail} alt="navBarPatientDetail" /> </div>
      )}
      {props.NewRegisterBookConsultationIsCalled && (
        <div style={{marginLeft:'200px'}}> <img src={NewRegisterBookConsultation} alt="NewRegisterBookConsultation" /> </div>
      )}
     </div>
      
      
    {!props.newRegistrationAadharIsCalled && !props.newRegistrationCaptureIsCalled && !props.registerPatientDetailIsCalled &&
    !props.NewRegisterBookConsultationIsCalled && !props.bookAppointmentIsCalled && !props.allPatientsIsCalled &&( 
     <div className='CloseBtn' onClick={handleCloseSession}>
        <button className='insideCancelBtn'>Close Session</button>
      </div>
    )}


    </div>
  )
}

export default Navbar