import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'
import PatientCard from '../Navbar/PatientCard'
import './NewRegisterBookConsultation.css';
import DateLeftArrow from "../../Assests/Images/dateArrowLeft.svg";
import DateRightArrow from "../../Assests/Images/dateArrowRight.svg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function NewRegisterBookConsultation() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [department,setDepartment] = useState({
    selectedDepartment: ''
});
const [doctor,setDoctor] = useState({
  selectedDoctor: ''
});

const [departmentsData, setDepartmentsData] = useState([]);
const [doctorsData, setDoctorsData] = useState([]);


// Fetch departments data from the API
useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:9929/soul/kiosk/getDepartmentsMaster?siteId=2468');
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
    const response = await axios.get(`http://localhost:9929/soul/kiosk/getDoctorsMaster?siteId=2468&departmentName=${departmentName}`);
    setDoctorsData(response.data.data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};



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



  return (
    <div style={{background:'#EFF2F7', height:'100vh'}}>
      <Navbar pagename={'New Registration'}/>
      <PatientCard/>

    <div className='AppointmentContent'>

      {/* Date Container  */}
    
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

     {/* Department Container  */}
        
        <div className='DepartmentContainer'>
        {departmentsData.map((dept) => (
          <React.Fragment key={dept.deptId}>
            <div style={{display:"flex"}}>
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
        {doctorsData.map((doctor) => (
          <React.Fragment key={doctor.doctorId}>
            <div style={{ display: 'flex' }}>
              <input
                type='radio'
                id={doctor.id}
                value={doctor.doctorName}
                className='doctor-radio'
                checked={doctor.selectedDoctor === doctor.doctorName}
                onChange={handleDoctorChange}
              />
                <label htmlFor={doctor.id} className={`doctor-label ${doctor.selectedDoctor === doctor.doctorName ? 'selected' : ''}`}>
                  <div style={{display:'flex',flexDirection:"column", gap:"10px", alignItems:'flex-start'}}>
                     <div>{doctor.doctorName}</div>
                     <div className='doctorDeptSubtitle'>{doctor.departmentName}</div>
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




    </div>
  )
}

export default NewRegisterBookConsultation