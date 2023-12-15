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
       <Route path="/new-registration" element={<NewRegistration/>} />
       <Route path="/RegisterPatientDetail" element={<RegisterPatientDetail/>} />
       <Route path="/book-appointment" element={<BookAppointment/>} />
       <Route path="/lab-report" element={<LabReport/>} />

     </Routes>
    </>
  );
}

export default App;
