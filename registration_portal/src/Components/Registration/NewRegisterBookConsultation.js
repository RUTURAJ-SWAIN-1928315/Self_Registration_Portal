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
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewRegisterBookConsultation() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading,setIsLoading] = useState(false);
  const [department,setDepartment] = useState({
    selectedDepartmentId:'',
    selectedDepartment: ''
});
const profileData = JSON.parse(localStorage.getItem('profileData'));

const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
const navigate = useNavigate();
const [doctor,setDoctor] = useState({
  selectedDoctorId:'',
  selectedDoctor: ''
});

const [departmentsData, setDepartmentsData] = useState([]);
const [doctorsData, setDoctorsData] = useState([]);
const [searchInput, setSearchInput] = useState('');
const [doctorSlots, setDoctorSlots] = useState([]);



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

// Helper function to format date as YYYYMMDD
const formatDateAsYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2); // Add leading 0 and slice last two digits
  const day = (`0${d.getDate()}`).slice(-2); // Add leading 0 and slice last two digits
  return `${year}${month}${day}`;
};  


//To fetch doctor Slots
const fetchDoctorSlots = async (value,doctorId) => {
  const formattedDate = formatDateAsYYYYMMDD(selectedDate); // Format the date
  console.log("selectedDate",formattedDate,"SelectedDeptId",department.selectedDepartmentId)

  try {
    const response = await axios.get(`${BACKEND_URL}/kiosk/getDoctorSlots?deptId=${department.selectedDepartmentId}&employeeId=${doctorId}&date=${formattedDate}`);
    if (response.data.status === "Success") {
      setDoctorSlots(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching doctor slots:', error);
  }
};

// Call fetchDoctorSlots whenever the selected department or date changes
useEffect(() => {
  if (department.selectedDepartment && selectedDate) {
    fetchDoctorSlots();
  } else {
    setDoctorSlots([]);
  }
}, [department.selectedDepartment, selectedDate]);
 

const [disablePrevDayButton,setDisablePrevDayButton] = useState(true);
const handlePrevDay = () => {
  const newDate = new Date(selectedDate);
  newDate.setDate(newDate.getDate() - 1);
  
  // Get today's date with the time set to 00:00:00 for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only set the new date if it is not before today
  if (newDate >= today) {
    setDisablePrevDayButton(false);
    setSelectedDate(newDate);
  }else{
    setDisablePrevDayButton(true);
  }
};

  const handleNextDay = () => {
    setDisablePrevDayButton(false);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  }
  
  const handleDepartmentChange = (event,departmentId) =>{
    const {value} = event.target;
    setDepartment(prevState => ({
      ...prevState,
      selectedDepartment:value,
      selectedDepartmentId:departmentId
    }))
     // Fetch doctors for the selected department
     fetchDoctors(value);
  }
  
  const handleDoctorChange = (event, doctorId) => {
    const { value } = event.target;
    console.log('doctorValue',value,"doctorId",doctorId);
    setDoctor({
      selectedDoctor: value,
      selectedDoctorId: doctorId
    });
    // Fetch slots for the selected doctor
    fetchDoctorSlots(value,doctorId);
  };

  const doctorRefs = useRef({});
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);
  
    // Clear current slots and doctor selection
    setDoctorSlots([]);
    setDoctor({ selectedDoctorId: '', selectedDoctor: '' });
  
    // Match departments
    const matchingDepartment = departmentsData.find(dept =>
      dept.deptName.toLowerCase().includes(value.toLowerCase())
    );
  
    if (matchingDepartment) {
      setDepartment({
        selectedDepartment: matchingDepartment.deptName,
        selectedDepartmentId: matchingDepartment.deptId
      });
      fetchDoctors(matchingDepartment.deptName);
      scrollToElement(matchingDepartment.deptId);
    } else {
      // If no department matches, reset the department selection
      setDepartment({ selectedDepartment: '', selectedDepartmentId: '' });
    }
  };
  
  // Helper function to scroll to the department element
  const scrollToElement = (elementId) => {
    const elementRef = doctorRefs.current[elementId];
    if (elementRef) {
      elementRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  

  const [selectedSlotId, setSelectedSlotId] = useState(null);

  
// Function to handle selecting a slot
const selectSlot = (selectedSlotIndex) => {
  // Find the slot by index
  const slot = doctorSlots[selectedSlotIndex];
  if (slot && slot.isBooked) {
    alert("This slot is already booked.");
    return;
  }
  // Set the selected slot index
  setSelectedSlotId(selectedSlotIndex);
};

// Helper function to format date string for display
const formatSlotTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  let hours = date.getHours();
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

const handleSaveAppointment = () => {
   
  const saveAppointmentRequestBody = {

      mrno: "KIMS102312210001",// For the time being no information regarding mrno so hardcoding it for testing
      eventDate: "22-12-2023 10:30",
      empno: profileData.empno,
      empId: Number(profileData.employeeId),
      departmentId: Number(department.selectedDepartmentId),
      siteId: Number(profileData.siteId),
      userId: Number(profileData.userId)
  }
  
}
  

console.log("doctorSlots",doctorSlots)

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
              <button className="datepicker-arrow" onClick={handlePrevDay} disabled={disablePrevDayButton}><img src={DateLeftArrow} alt="" className='datepicker-arrow-image'/></button>
              <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} dateFormat="dd / MM / yyyy"className="datepicker-input"/>
              <button className="datepicker-arrow" onClick={handleNextDay}><img src={DateRightArrow} alt=""  /></button>
            </div>

         </div>
       </div>

       <div className='DtrDeptSearchContainer'>
       <img style={{cursor:"pointer"}} src={searchIcon} alt="searchIcon"/>
        <input className='DtrDeptSearchInput' type="text" placeholder='Search Department'  value={searchInput}
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
              onChange={(e) => handleDepartmentChange(e, dept.deptId)}
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
                onChange={(e) => handleDoctorChange(e, dtr.doctorId)}
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

       {/* Doctor Slots Container */}
    <div className='AppointmentDateHeader'>
      SELECT SLOT
    </div>
    <div className="slots-container">
      {doctorSlots.map((slot, index) => (
        <div
          key={index}
          className={`slot ${index === selectedSlotId ? 'selected' : (slot.isBooked ? 'booked' : 'available')}`}
          onClick={() => !slot.isBooked && selectSlot(index)}
        >
          {formatSlotTime(slot.eventStartDateTime)} - {formatSlotTime(slot.eventEndDateTime)}
        </div>
      ))}
    </div>

       
      </div>

      <div className='newRegistrationButtonGroupRow'>
      {/* <button className='newRegistrationCancelButton'>Clear All</button> */}
      <button className='newRegistrationSaveButton' onClick={{handleSaveAppointment}} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save & Next'}</button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* <button onClick={() => {
              navigate('/');
            }} 
            className='NewRegistrationSkipButton'
            style={{height:'54px',width:'270px'}}>
              DON'T BOOK CONSULTATION<img src={rightIcon} alt="Right Icon" />
            </button> */}


    </div>
  )
}

export default NewRegisterBookConsultation