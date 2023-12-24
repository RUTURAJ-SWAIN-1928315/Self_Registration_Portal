import React from 'react'
import './PatientCard.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";
import phoneIcon from "../../Assests/Images/phoneIcon.svg";
import emailIcon from "../../Assests/Images/emailIcon.svg";

function PatientCard() {

const capturedPhoto = localStorage.getItem('capturedPhoto');
  const patientImage = capturedPhoto;

  return (
    <div className='mainPatientCard'>
      
      <div className='patientPhoto'>
      <div style={{border:'groove', borderColor:'#f0ffff34', height:'170px', display:'flex', alignItems:'center', justifyContent:'center' }}>
           <img className='patientImageCard' src={patientImage || DefaultPatient} alt="Patient" />
         </div>

      </div>

     
      <div className='PatientInfo'>

      <div style={{display:'flex', flexDirection:'row', gap:'17px'}}>  
        <div className='HeaderName'>
            Miss Sikha Pradhan
        </div>
        <div className='genderShow'>
          <div className='genderShowround'>
             Female
          </div>  
        </div>
     </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Age : 
     </div>
     <div className='subtitle'>
        40 Years 4 Months (01 Feb 1983)
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Registered on :
     </div>
     <div className='subtitle'>
        01 Feb 2022, 21:25
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Aadhar Number :
     </div>
     <div className='subtitle'>
        454523231878
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row', gap:'20px',paddingTop:'8px'}}>
     <div className=''>
     <img src={phoneIcon} alt="Phone" />
     </div>
     <div className='subtitle'>
        (+91) 9878765621
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row', gap:'20px',paddingTop:'8px'}}>
     <div className=''>
     <img src={emailIcon} alt="Email" />
     </div>
     <div className='subtitle'>
        classic350@gmail.com
     </div>
    </div>





      </div>

      <div className='AddressInfo'>
        
        <div className='AdressHeader'>
         ADDRESS DETAILS
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'15px' }}>
            <div className='addressSubheader'>
              Village :
            </div>
            <div className='addresstitle'>
              Radhakrishnapur
            </div>

            <div className='addressSubheader'>
              Pin-Code :
            </div>
            <div className='addresstitle'>
              751024
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Locality :
            </div>
            <div className='addresstitle'>
              Srikhera
            </div>

            <div className='addressSubheader'>
            Distict :
            </div>
            <div className='addresstitle'>
            Khorda
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Post Office :
            </div>
            <div className='addresstitle'>
              Raghunathpur
            </div>

            <div className='addressSubheader'>
              State :
            </div>
            <div className='addresstitle'>
              Odisha
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Police Station :
            </div>
            <div className='addresstitle'>
              Radhakrishnapur
            </div>

            <div className='addressSubheader'>
              Country :
            </div>
            <div className='addresstitle'>
              India
            </div>
        </div>



      </div>

    </div>
  )
}

export default PatientCard