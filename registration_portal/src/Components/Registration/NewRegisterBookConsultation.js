import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar'
import PatientCard from '../Navbar/PatientCard'
import './NewRegisterBookConsultation.css';
import DateLeftArrow from "../../Assests/Images/dateArrowLeft.svg";
import DateRightArrow from "../../Assests/Images/dateArrowRight.svg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchIcon from "../../Assests/Images/searchIcon.svg";
import rightIcon from '../../Assests/Images/rightIcon.svg';

function NewRegisterBookConsultation() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [department,setDepartment] = useState({
    selectedDepartment: ''
});
const profileData = JSON.parse(localStorage.getItem('profileData'));

const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
const navigate = useNavigate();
const [doctor,setDoctor] = useState({
  selectedDoctor: ''
});

const [departmentsData, setDepartmentsData] = useState([]);
const [doctorsData, setDoctorsData] = useState([]);
const [searchInput, setSearchInput] = useState('');



// Fetch departments data from the API
useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getDepartmentsMaster?siteId=${profileData.siteId}`);
      setDepartmentsData(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  fetchDepartments();
}, []);

 // Function to fetch doctors based on the selected department
 const fetchDoctors = async (departmentName) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/kiosk/getDoctorsMaster?siteId=${profileData.siteId}&departmentName=${departmentName}`);
    setDoctorsData(response.data.data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};
console.log("doctorsData",doctorsData)


  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  }
  
  const handleDepartmentChange = (event) =>{
    const {value} = event.target;
    setDepartment(prevState => ({
      ...prevState,
      selectedDepartment:value
    }))
     // Fetch doctors for the selected department
     fetchDoctors(value);
  }
  
  const handleDoctorChange = (event) =>{
    const {value} = event.target;
    setDoctor(prevState => ({
      ...prevState,
      selectedDoctor:value
    }))
  }

  const doctorRefs = useRef({});
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);
  
    // Filter departments based on search input
    const filteredDepartments = departmentsData.filter(dept => 
      dept.deptName.toLowerCase().includes(value.toLowerCase())
    );
  
    // If a department is found, select it and fetch its doctors
    if (filteredDepartments.length > 0) {
      setDepartment({ selectedDepartment: filteredDepartments[0].deptName });
      fetchDoctors(filteredDepartments[0].deptName);
  
      // Scroll to the first matched department
      if (doctorRefs.current[filteredDepartments[0].deptId]) {
        doctorRefs.current[filteredDepartments[0].deptId].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // If no department found, try filtering doctors directly
      const filteredDoctors = doctorsData.filter(dtr => 
        dtr.doctorName.toLowerCase().includes(value.toLowerCase())
      );
      if (filteredDoctors.length > 0) {
        setDoctor({ selectedDoctor: filteredDoctors[0].doctorName });
        setDepartment({ selectedDepartment: filteredDoctors[0].departmentName });
  
        // Scroll to the first matched doctor
        if (doctorRefs.current[filteredDoctors[0].doctorId]) {
          doctorRefs.current[filteredDoctors[0].doctorId].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };
  console.log("doctorRefs",doctorRefs)
  



  return (
    <div style={{background:'#EFF2F7', height:'100vh'}}>
      <Navbar pagename={'New Registration'} NewRegisterBookConsultationIsCalled={true}/>
      <PatientCard/>

    <div className='AppointmentContent'>

      {/* Date Container  */}
      <div style={{display:'flex'}}>
       <div className='DateContainer'>
         <div className='AppointmentDateHeader'>
            Appointment Date

            <div className="datepicker-container">
              <button className="datepicker-arrow" onClick={handlePrevDay}><img src={DateLeftArrow} alt=""  /></button>
              <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} dateFormat="dd / MM / yyyy"className="datepicker-input"/>
              <button className="datepicker-arrow" onClick={handleNextDay}><img src={DateRightArrow} alt=""  /></button>
            </div>

         </div>
       </div>

       <div className='DtrDeptSearchContainer'>
       <img style={{cursor:"pointer"}} src={searchIcon} alt="searchIcon"/>
        <input className='DtrDeptSearchInput' type="text" placeholder='Search Doctor/Department'  value={searchInput}
  onChange={handleSearchChange} />
       </div>
       </div>

     {/* Department Container  */}
        
        <div className='DepartmentContainer'>
        {departmentsData.map((dept) => (
          <React.Fragment key={dept.deptId}>
            <div style={{display:"flex"}} ref={el => doctorRefs.current[dept.deptId] = el}>
            <input
              type='radio'
              id={dept.deptCode}
              value={dept.deptName}
              className='dept-radio'
              checked={department.selectedDepartment === dept.deptName}
              onChange={handleDepartmentChange}
            />
            <label htmlFor={dept.deptCode} className={`dept-label ${department.selectedDepartment === dept.deptName ? 'selected' : ''}`}>
              {dept.deptName}
            </label>
            </div>
          </React.Fragment>
        ))}
      </div>


       {/* Doctor Container  */}
       <div className='DoctorContainer'>
        {doctorsData.map((dtr) => (
          <React.Fragment key={dtr.doctorId}>
            <div style={{ display: 'flex' }} ref={el => doctorRefs.current[dtr.doctorId] = el}>
              <input
                type='radio'
                id={dtr.id}
                value={dtr.doctorName}
                className='doctor-radio'
                checked={doctor.selectedDoctor === dtr.doctorName}
                onChange={handleDoctorChange}
              />
                <label htmlFor={dtr.id} className={`doctor-label ${doctor.selectedDoctor === dtr.doctorName ? 'selected' : ''}`}>
                  <div style={{display:'flex',flexDirection:"column", gap:"10px", alignItems:'flex-start'}}>
                     <div>{dtr.doctorPrefix} {dtr.doctorName}</div>
                     <div className='doctorDeptSubtitle'>{dtr.departmentName}</div>
                  </div>
                </label>
            </div>
          </React.Fragment>
        ))}
      </div>


     {/*
       <div>
        Slots
       </div> */}
       
      </div>

      <button onClick={() => {
              navigate('/');
            }} 
            className='NewRegistrationSkipButton'
            style={{height:'54px',width:'270px'}}>
              DON'T BOOK CONSULTATION<img src={rightIcon} alt="Right Icon" />
            </button>


    </div>
  )
}

export default NewRegisterBookConsultation