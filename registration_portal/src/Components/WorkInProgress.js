import React from 'react'
import Navbar from '../Components/Navbar/Navbar';
import WorkProgress from "../Assests/Images/WorkInProgress.svg";
 

export default function WorkInProgress() {
  return (
    <div>
      <div><Navbar WorkInProgressIsCalled={true}/></div>

        <div style={{height:'80vh'}}>
            <div style={{width:'100%', height:'100%',display:'flex',justifyContent:'center'}}>
            <img style={{width:'100%'}} src={WorkProgress} alt=" " />
            </div>
        </div>
    </div>
  )
}
