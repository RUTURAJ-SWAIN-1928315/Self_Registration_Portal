import React from 'react'
import './Navbar.css'
import HomeIcon from "../../Assests/Images/HomeIcon.svg"
import RightArrow from "../../Assests/Images/right.svg"


function Navbar(props) {

  console.log("pageName", props.pagename)

  
  return (
    <div className='NavbarContainer'>

     <div style={{gap:'10px', display:'flex', flexDirection:'row', alignItems: 'center'}}>
      <div> <img src={HomeIcon} alt="Home" /> </div>
      <div> <img src={RightArrow} alt="rightArrow" /> </div>

      <div className='PageNameContainer'> {props.pagename} </div>
     </div>
      
      


    </div>
  )
}

export default Navbar