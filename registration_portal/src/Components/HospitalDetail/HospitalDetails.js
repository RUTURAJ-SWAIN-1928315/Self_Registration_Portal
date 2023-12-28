import React, { useEffect, useState } from 'react';
import './HospitalDetails.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import AboutKims from '../../Assests/Images/AboutKIMS.svg';
import Instagram from '../../Assests/Images/instagram.svg';
import Twitter from '../../Assests/Images/twitter.svg';

function HospitalDetails() {
const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const [hospitalData, setHospitalData] = useState(null);

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get(`${BACKEND_URL}/kiosk/getAboutHospital?siteId=2468`)
      .then(response => {
        // Assuming response.data contains the API response
        setHospitalData(response.data.data[0]);
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching hospital data:', error);
      });

  }, []); // Empty dependency array ensures useEffect runs only once
 console.log("response",hospitalData)


 function extractUsernameTwitter(url) {
    // Assuming the username is the last part of the URL after the last "/"
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  function extractUsernameInsta(url) {
    // Assuming the username is the last part of the URL after the last "/"
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
  
  
  return (
    <div className='hospitalDetail'>
      <Navbar pagename={"About Hospital"}/>
      <div className='detailBody'>
        <div style={{padding:'5px'}}>
          <img className='imgShape' src={AboutKims} alt="AboutKims" />
        </div>
        <div className='detailTextArea'>
          {hospitalData && (
            <>
              <div className='HospitalName'>
                {hospitalData.branchName}
              </div>
              <div className='LocName'>
                {hospitalData.location}
              </div>
              <div className='InfoContain'>
                {hospitalData.hospitalInfo}
              </div>
              <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <div style={{display:'flex', gap:'8px'}}>
                  <img src={Instagram} alt="" />
                  <span>{extractUsernameInsta(hospitalData.instagramLink)}</span>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  <img src={Twitter} alt="" />
                  <span>{extractUsernameTwitter(hospitalData.twitterLink)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HospitalDetails;
