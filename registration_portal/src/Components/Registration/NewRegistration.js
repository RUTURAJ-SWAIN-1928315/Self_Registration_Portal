//Author @Ruturaj Swain
import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './NewRegistration.css';
import rightIcon from '../../Assests/Images/rightIcon.svg';
import { useNavigate } from 'react-router-dom';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function NewRegistration() {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [canvasURL, setCanvasURL] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [showCaptureAgain, setShowCaptureAgain] = useState(false);
  const videoRef = useRef(null);


  useEffect(() => {
    const initializeCamera = async () => {
      await openCamera();
    };
  
    initializeCamera();
  
    return () => closeCamera();
  }, []); 

  const openCamera = async () => {
    try {
      const videoElement = videoRef.current;
      if (!videoElement || !videoRef.current) {
        console.error("Video element not found");
        return;
      }
  
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      // Check if the component is still mounted before updating state
    if (videoRef.current) {
      videoElement.srcObject = mediaStream;
      videoElement.addEventListener('loadedmetadata', () => {
        setStream(mediaStream);
      });
    }
  } catch (err) {
    console.error("Error opening camera:", err);
  }
  };
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    // Clear previous image in localStorage, if any
    localStorage.removeItem('capturedPhoto');
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob instanceof Blob) {
          // Set the canvas URL for the image
          const url = URL.createObjectURL(blob);
          setCanvasURL(url);
          setCaptured(true);
          setShowCaptureAgain(true);
          closeCamera(); // Close the camera here after capturing
        } else {
          console.error('Captured data is not a Blob.');
        }
      }, 'image/jpeg');
    } else {
      console.error('Video is not ready for capture.');
    }
  };
  

  const handleRegisterClick = () => {

    // Save the captured photo to local storage as base64
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = canvasURL;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const base64Image = canvas.toDataURL('image/jpeg');
      localStorage.setItem('capturedPhoto', base64Image);
      closeCamera();
      navigate('/PatientDetailRegister');
    };
    
  };

  // const handleCaptureAgainClick = async () => {
  //   console.log("Capture Again Clicked");
  //   setCaptured(false);
  //   setShowCaptureAgain(false);
  
  //   // Reset canvas and video stream
  //   const video = videoRef.current;
  //   const canvas = document.createElement('canvas');
  
  //   video.addEventListener('loadedmetadata', () => {
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  
  //     const context = canvas.getContext('2d');
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  //     canvas.toBlob(blob => {
  //       if (blob instanceof Blob) {
  //         const url = URL.createObjectURL(blob);
  //         setCanvasURL(url);
  //         setCaptured(true);
  //         setShowCaptureAgain(true);
  //       } else {
  //         console.error('Captured data is not a Blob.');
  //       }
  //     }, 'image/jpeg');
  //   });
  // };

  // Since Facing issue on capture Again so for time being using windows reload 
  //on capture again
  const handleCaptureAgainClick = () =>{
    // Clear previous image in localStorage, if any
    localStorage.removeItem('capturedPhoto');
    window.location.reload();
  }

  return (
    <div>
      <Navbar pagename={'New Registration'} />
      <div className='capturePageBody'>
        <div className='captureContainer'>
          <div className='captureHeader'>Patient Photo</div>
          <div className='capturePhoto'>
            {canvasURL 
              ? <img src={canvasURL} alt="Captured" style={{ width: '100%' }} />
              : <video ref={videoRef} autoPlay style={{ width: '100%' }} />}
          </div>
          <div>
            {showCaptureAgain ? (
              <div style={{display:'flex',gap:'10px', padding:'10px'}}>
                <button className='capureButton' onClick={handleCaptureAgainClick}>
                <ReplayIcon/>
                </button>
                <button className='capureButton' onClick={handleRegisterClick}>
                 <ArrowForwardIcon/>
                </button>
              </div>
            ) : (
              <button className='capureButton' onClick={capturePhoto}>
                {captured ? 'Capture Again' : 'Capture'}
              </button>
            )}
          </div>
        </div>
        <button onClick={() => {
              closeCamera();
              // Clear previous image in localStorage, if any
              localStorage.removeItem('capturedPhoto');
              // Navigate to PatientDetailRegister
              navigate('/PatientDetailRegister');
            }} className='NewRegistrationSkipButton'>
              SKIP<img src={rightIcon} alt="Right Icon" />
            </button>
      </div>
    </div>
  );
}

export default NewRegistration;
