import React from 'react';
import './App.css';
import { Routes, Route,Navigate } from 'react-router-dom';
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
import OpdCheckin from './Components/BookAppointment/OPD_CheckIn/OpdCheckin';
import AllPatients from './Components/BookAppointment/AllPatients';
import AdminPage from './Components/Admin/AdminPage';
import Faqs from './Components/Faqs/Faqs';
import HospitalDetails from './Components/HospitalDetail/HospitalDetails';
// import WorkInProgress from './Components/WorkInProgress';
import SuccessConfirmation from './Components/Home/SuccessConfirmation';
import CloseSession from './Components/Home/CloseSession';
import SelfRegistrationConfirmation from './Components/Registration/SelfRegistrationConfirmation';
import { useAuth, AuthProvider } from './Components/AuthContext';

 
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
  
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  
    return children;
  };
  const App = () => {
  return (
    <AuthProvider>
    <div>
     <Routes>
      <Route path='/' element={<AdminPage/>}/>

       <Route path='/Home' element={<ProtectedRoute><Home/></ProtectedRoute>} />
       <Route path="/NewRegistrationAadhar" element={<ProtectedRoute><NewRegistrationAadhar/></ProtectedRoute>} />
       <Route path="/NewRegistration" element={<ProtectedRoute><NewRegistration/></ProtectedRoute>} />
       <Route path="/RegisterPatientDetail" element={<ProtectedRoute><RegisterPatientDetail/></ProtectedRoute>} />
       <Route path="/BookAppointment" element={<ProtectedRoute><BookAppointment/></ProtectedRoute>} />
       <Route path="/BookAppointmentLanding" element={<ProtectedRoute><BookAppointmentLanding/></ProtectedRoute>} />
       <Route path="/LabReport" element={<ProtectedRoute><LabReport/></ProtectedRoute>} />
       <Route path="/Billing" element={<ProtectedRoute><Billing/></ProtectedRoute>}/>
       <Route path="/BookConsultation" element={<ProtectedRoute><BookConsultation/></ProtectedRoute>}/>
       <Route path="/OpdCheckin" element={<ProtectedRoute><OpdCheckin/></ProtectedRoute>}/>
       <Route path="/PatientDetailRegister" element ={<ProtectedRoute><RegisterPatientDetail/></ProtectedRoute>} />
       <Route path="/NewRegisterBookConsultation" element ={<ProtectedRoute><NewRegistrationBookConsultation/></ProtectedRoute>} />
       <Route path="/AllPatients" element ={<ProtectedRoute><AllPatients/></ProtectedRoute>} />
       <Route path="/faqs" element={<ProtectedRoute><Faqs/></ProtectedRoute>}/>
       <Route path="/hospitalDetails" element={<ProtectedRoute><HospitalDetails/></ProtectedRoute>}/>
       {/* <Route path="/WorkInProgress" element={<WorkInProgress/>}/> */}
       <Route path="/SuccessConfirmation" element={<ProtectedRoute><SuccessConfirmation/></ProtectedRoute>}/>
       <Route path="/SessionClose" element={<ProtectedRoute><CloseSession/></ProtectedRoute>}/>
       <Route path="/SelfConfirmation" element={<ProtectedRoute><SelfRegistrationConfirmation/></ProtectedRoute>}/>

     </Routes>
     </div>
    </AuthProvider>
  );
}

export default App;
