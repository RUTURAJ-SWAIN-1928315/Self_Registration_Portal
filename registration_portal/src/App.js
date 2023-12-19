import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import NewRegistration from './Components/Registration/NewRegistration';
import BookAppointment from './Components/BookAppointment/BookAppointment';
import LabReport from './Components/Report/LabReport';
import RegisterPatientDetail from './Components/Registration/RegisterPatientDetail';

function App() {
  return (
    <>
     <Routes>
       <Route path='/' element={<Home/>} />
       <Route path="/NewRegistration" element={<NewRegistration/>} />
       <Route path="/RegisterPatientDetail" element={<RegisterPatientDetail/>} />
       <Route path="/BookAppointment" element={<BookAppointment/>} />
       <Route path="/LabReport" element={<LabReport/>} />

       <Route path="/PatientDetailRegister" element ={<RegisterPatientDetail/>} />

     </Routes>
    </>
  );
}

export default App;
