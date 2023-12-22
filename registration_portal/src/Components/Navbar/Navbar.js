import React from 'react'
import './Navbar.css'
import HomeIcon from "../../Assests/Images/HomeIcon.svg"
import RightArrow from "../../Assests/Images/right.svg"
import BackButton from "../../Assests/Images/backButton.svg"
import { useNavigate } from 'react-router-dom'
import navBarPatientDetail from "../../Assests/Images/navBarPatientDetail.svg";


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

  
  return (
    <div className='NavbarContainer'>

     <div style={{gap:'10px', display:'flex', flexDirection:'row', alignItems: 'center'}}>
      <div> <img src={HomeIcon} alt="Home" onClick={() => navigate('/')} /> </div>
      {/* <div> <img src={BackButton} alt="BackButton" onClick={handleBackNavigate} /> </div> */}
      <div> <img src={RightArrow} alt="rightArrow" /> </div>

      <div className='PageNameContainer'> {props.pagename} </div>
      {props.registerPatientDetailIsCalled && (
        <div style={{marginLeft:'200px'}}> <img src={navBarPatientDetail} alt="navBarPatientDetail" /> </div>
      )}
     </div>
      
      


    </div>
  )
}

export default Navbar