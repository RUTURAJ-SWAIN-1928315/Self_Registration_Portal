import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import './NewRegistration.css';
import rightIcon from '../../Assests/Images/rightIcon.svg';

function NewRegistration() {
  const [stream, setStream] = useState(null);
  const [canvasURL, setCanvasURL] = useState(null); // State to hold the canvas URL
  const [captured, setCaptured] = useState(false); // State to track if photo is captured
  const videoRef = useRef(null);

  useEffect(() => {
    openCamera();
    return () => closeCamera();
  }, []);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
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
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob instanceof Blob) {
          sendPhoto(blob);

          // Set the canvas URL for the image
          const url = URL.createObjectURL(blob);
          setCanvasURL(url); // Update the canvas URL state
          setCaptured(true); // Update captured state

          // Close the camera
          closeCamera();
        } else {
          console.error('Captured data is not a Blob.');
        }
      }, 'image/jpeg');
    } else {
      console.error('Video is not ready for capture.');
    }
  };

  const sendPhoto = (photoBlob) => {
    if (!(photoBlob instanceof Blob)) {
      console.error('Invalid photoBlob: not a Blob.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photoBlob, 'photo.jpg');

    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error uploading photo:", error);
    });
  };

  return (
    <div>
      <Navbar pagename={'New Registration'}/>
      <div className='capturePageBody'>
        <div className='captureContainer'>
          <div className='captureHeader'>Patient Photo</div>
          <div className='capturePhoto'>
            {canvasURL 
              ? <img src={canvasURL} alt="Captured" style={{ width: '100%' }} />
              : <video ref={videoRef} autoPlay style={{ width: '100%' }} />}
          </div>
          <div>
            <button className='capureButton' onClick={capturePhoto}>
              {captured ? 'Capture Again' : 'Capture'}
            </button>
          </div>
        </div>
        <button className='NewRegistrationSkipButton'>
          SKIP<img src={rightIcon} alt="Right Icon" />
        </button>
      </div>
    </div>
  );
}

export default NewRegistration;
