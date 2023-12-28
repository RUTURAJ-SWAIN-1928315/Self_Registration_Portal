import React, { useEffect, useState } from 'react'
import './PatientCard.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";
import phoneIcon from "../../Assests/Images/phoneIcon.svg";
import emailIcon from "../../Assests/Images/emailIcon.svg";

function PatientCard() {

const newRegisteredPatientDetails = JSON.parse(localStorage.getItem('NewRegisteredPatientDetails'));
const alreadyRegisteredPatientDetails = JSON.parse(localStorage.getItem('AlreadyRegisteredPatientDetails'));

const [patientCardDetails,SetPatientCardDetails] = useState({
  photo:'',
  headerName:'',
  gender:'',
  age:'',
  registeredOn:'',
  aadharNumber:'',
  contactNo:'',
  emailId:'',
  village:'',
  city:'',
  isRural:'',
  locality:'',
  postOffice:'',
  policeStation:'',
  pincode:'',
  district:'',
  state:'',
  country:''
});

useEffect(() => {
  if(newRegisteredPatientDetails){
    const middleName = newRegisteredPatientDetails.middleName === 'NA' ? '' : newRegisteredPatientDetails.middleName;
    const creationTimeStamp = new Date(newRegisteredPatientDetails.creationTimeStamp);
    const addressList = newRegisteredPatientDetails.addressList[0];
    SetPatientCardDetails({
      //Checking NA here since Sending NA when photo is not available while Registering
      photo:newRegisteredPatientDetails.photo === 'NA' ? null:newRegisteredPatientDetails.photo,
      //Add Prefix in HeaderName
      headerName:newRegisteredPatientDetails.firstName + " " +middleName +" "+ newRegisteredPatientDetails.lastName,
      gender:newRegisteredPatientDetails.gender,
      age:newRegisteredPatientDetails.age,
      registeredOn:`${creationTimeStamp.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, ${creationTimeStamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`,
      aadharNumber:newRegisteredPatientDetails.aadhaarNumber,
      contactNo:newRegisteredPatientDetails.contactNo,
      emailId:newRegisteredPatientDetails.email,
      village:addressList.village,
      city:addressList.cityName,
      isRural:addressList.isRural,
      locality:addressList.locality,
      postOffice:addressList.postOffice,
      policeStation:addressList.policeStation,
      pincode:addressList.pin,
      district:addressList.districtName,
      state:addressList.stateName,
      country:addressList.countryName
    })

  }else if(alreadyRegisteredPatientDetails){

    SetPatientCardDetails({
      photo:'',
      headerName:'',
      gender:'',
      age:'',
      registeredOn:'',
      contactNo:'',
      emailId:'',
      village:'',
      city:'',
      locality:'',
      postOffice:'',
      policeStation:'',
      pincode:'',
      district:'',
      state:'',
      country:''
    })
  }
}, []);

console.log("newRegistrationPatientDetails",newRegisteredPatientDetails)

  return (
    <div className='mainPatientCard'>
      
      <div className='patientPhoto'>
      <div style={{border:'groove', borderColor:'#f0ffff34', height:'170px', display:'flex', alignItems:'center', justifyContent:'center' }}>
           <img className='patientImageCard' src={patientCardDetails.photo || DefaultPatient} alt="Patient" />
         </div>

      </div>

     
      <div className='PatientInfo'>

      <div style={{display:'flex', flexDirection:'row', gap:'17px'}}>  
        <div className='HeaderName'>
            {patientCardDetails.headerName}
        </div>
        <div className='genderShow'>
          <div className='genderShowround'>
          {patientCardDetails.gender}
          </div>  
        </div>
     </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Age : 
     </div>
     <div className='subtitle'>
       {patientCardDetails.age}
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Registered on :
     </div>
     <div className='subtitle'>
       {patientCardDetails.registeredOn}
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row',paddingTop:'8px'}}>
     <div className='subHeader'>
       Aadhar Number :
     </div>
     <div className='subtitle'>
        {patientCardDetails.aadharNumber}
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row', gap:'20px',paddingTop:'8px'}}>
     <div className=''>
     <img src={phoneIcon} alt="Phone" />
     </div>
     <div className='subtitle'>
       {patientCardDetails.contactNo}
     </div>
    </div>

    <div style={{display:'flex', flexDirection:'row', gap:'20px',paddingTop:'8px'}}>
     <div className=''>
     <img src={emailIcon} alt="Email" />
     </div>
     <div className='subtitle'>
      {patientCardDetails.emailId}
     </div>
    </div>


      </div>

      <div className='AddressInfo'>
        
        <div className='AdressHeader'>
         ADDRESS DETAILS
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'15px' }}>
        {patientCardDetails.isRural === true ? (
          <>
            <div className='addressSubheader'>
              Village :
            </div>
            <div className='addresstitle'>
              {patientCardDetails.village}
            </div>
            </>
        ):(
          <>
          <div className='addressSubheader'>
              City :
            </div>
            <div className='addresstitle'>
              {patientCardDetails.city}
            </div>
            </>
        )}

            <div className='addressSubheader'>
              Pin-Code :
            </div>
            <div className='addresstitle'>
              {patientCardDetails.pincode}
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Locality :
            </div>
            <div className='addresstitle'>
             {patientCardDetails.locality}
            </div>

            <div className='addressSubheader'>
            Distict :
            </div>
            <div className='addresstitle'>
           {patientCardDetails.district}
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Post Office :
            </div>
            <div className='addresstitle'>
             {patientCardDetails.postOffice}
            </div>

            <div className='addressSubheader'>
              State :
            </div>
            <div className='addresstitle'>
             {patientCardDetails.state}
            </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'22px', paddingTop:'10px' }}>
            <div className='addressSubheader'>
              Police Station :
            </div>
            <div className='addresstitle'>
              {patientCardDetails.policeStation}
            </div>

            <div className='addressSubheader'>
              Country :
            </div>
            <div className='addresstitle'>
             {patientCardDetails.country}
            </div>
        </div>



      </div>

    </div>
  )
}

export default PatientCard