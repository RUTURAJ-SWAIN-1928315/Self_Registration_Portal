import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import NewRegistration from './Components/Registration/NewRegistration';
import BookAppointment from './Components/BookAppointment/BookAppointment';
import NewRegistrationAadhar from './Components/Registration/NewRegistrationAadhar';
import LabReport from './Components/BookAppointment/LabReport/LabReport';
import RegisterPatientDetail from './Components/Registration/RegisterPatientDetail';
import BookAppointmentLanding from './Components/BookAppointment/BookAppointmentLanding';
import NewRegistrationBookConsultation from './Components/Registration/NewRegisterBookConsultation';
import Billing from './Components/BookAppointment/Billing/Billing';
import BookConsultation from './Components/BookAppointment/BookConsultation/BookConsultation';

function App() {
  return (
    <>
     <Routes>
       <Route path='/' element={<Home/>} />
       <Route path="/NewRegistrationAadhar" element={<NewRegistrationAadhar/>} />
       <Route path="/NewRegistration" element={<NewRegistration/>} />
       <Route path="/RegisterPatientDetail" element={<RegisterPatientDetail/>} />
       <Route path="/BookAppointment" element={<BookAppointment/>} />
       <Route path="/BookAppointmentLanding" element={<BookAppointmentLanding/>} />
       <Route path="/LabReport" element={<LabReport/>} />
       <Route path="/Billing" element={<Billing/>}/>
       <Route path="/BookConsultation" element={<BookConsultation/>}/>
       <Route path="/PatientDetailRegister" element ={<RegisterPatientDetail/>} />
       <Route path="/NewRegisterBookConsultation" element ={<NewRegistrationBookConsultation/>} />


     </Routes>
    </>
  );
}

export default App;
