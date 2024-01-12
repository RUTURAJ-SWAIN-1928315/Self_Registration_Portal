import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookConsultation.css'
import Navbar from '../../Navbar/Navbar';
import DateRightArrow from '../../../Assests/Images/dateArrowRight.svg';
import DateLeftArrow from '../../../Assests/Images/dateArrowLeft.svg';
import searchIcon from "../../../Assests/Images/searchIcon.svg";
import DatePicker from 'react-datepicker';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import slotMarks from "../../../Assests/Images/slotMarks.svg"
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';


function BookConsultation() {

  const alreadyRegisteredPatientDetails = JSON.parse(localStorage.getItem('AlreadyRegisteredPatientDetails'));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading,setIsLoading] = useState(false);
    const [department,setDepartment] = useState({
      selectedDepartmentId:'',
      selectedDepartment: ''
  });
  const profileData = JSON.parse(localStorage.getItem('profileData'));
  const selectedPatientMRNO = localStorage.getItem('selectedPatientMRNO');
  
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

  const [prevdoctorsData, setPrevDoctorsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/kiosk/getPreviousConsultants?mrno=${selectedPatientMRNO}`);
        setPrevDoctorsData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  
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
  //  const fetchDoctors = async (departmentName) => {
  //   try {
  //     const response = await axios.get(`${BACKEND_URL}/kiosk/getDoctorsMaster?siteId=${profileData.siteId}&departmentName=${departmentName}`);
  //     setDoctorsData(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching doctors:', error);
  //   }
  // };
  
  const fetchDoctors = async (departmentName) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getDoctorsMaster?siteId=${profileData.siteId}&departmentName=${departmentName}`);
      setDoctorsData(response.data.data);
      // If there's no doctor available for the selected department, reset the doctor selection and slots
      if (!response.data.data.length) {
        setDoctor({
          selectedDoctor: '',
          selectedDoctorId: ''
        });
        setDoctorSlots([]);
      }
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
  
  
  //To fetch doctor Slots depending upon the selected departmentId and doctorId
  const fetchDoctorSlots = async (doctorId,date) => {
    //Case - 1 -passing date to formatDateAsYYYYMMDD when user changes the date after selecting department and doctor
    //Case - 2 - And passing selectedDate formatDateAsYYYYMMDD when the user changes the date without selecting any doctor and department
    //Passing Date for case 1 as previously selected Date was getting passed when using selectedDate.
    let formattedDate;
    if(date === undefined){
      formattedDate = formatDateAsYYYYMMDD(selectedDate);
    }else{
      formattedDate = formatDateAsYYYYMMDD(date);
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/kiosk/getDoctorSlots?deptId=${department.selectedDepartmentId}&employeeId=${doctorId}&date=${formattedDate}`);
      if (response.data.status === "Success") {
        setDoctorSlots(response.data.data);
      } else {
        setDoctorSlots([]);
      }
    } catch (error) {
      console.error('Error fetching doctor slots:', error);
    }
  };

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

      //Calling doctorSlots here to update the slot details when user changes the date
      if(doctor.selectedDoctorId){
        fetchDoctorSlots(doctor.selectedDoctorId,newDate)
      }
    }else{
      setDisablePrevDayButton(true);
    }
  };
  
    const handleNextDay = () => {
      setDisablePrevDayButton(false);
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
      //Calling doctorSlots here to update the slot details when user changes the date
      if(doctor.selectedDoctorId){
        fetchDoctorSlots(doctor.selectedDoctorId,newDate)
      }
    }
  
    useEffect(() => {
      //fetching doctor Slots when department and doctor is selected.
      if (department.selectedDepartment && doctor.selectedDoctorId) {
        fetchDoctorSlots(doctor.selectedDoctorId);
      } else {
        setDoctorSlots([]);
      }
    }, [department.selectedDepartment, doctor.selectedDoctorId]);
    
    const handleDepartmentChange = (event, departmentId) => {
      const { value } = event.target;
      setDepartment(prevState => ({
        ...prevState,
        selectedDepartment: value,
        selectedDepartmentId: departmentId
      }));
      fetchDoctors(value);
      setDoctor({
        selectedDoctor: '',
        selectedDoctorId: ''
      });
      setDoctorSlots([]); // Reset slots on department change
    };
    
    const handleDoctorChange = async (event, doctorId) => {
      const { value } = event.target;
      setDoctor({
        selectedDoctor: value,
        selectedDoctorId: doctorId
      });
      await fetchDoctorSlots(doctorId);
      setDoctorSlots([]);
    };

    const handlePrevDoctorSelect = (Prevdtr) => {
      console.log("PrevDtr",Prevdtr)
      // Set the selected doctor's details

      // Clear current slots and doctor selection
      setDoctorSlots([]);
      setDoctor({ selectedDoctorId: '', selectedDoctor: '' });

      setDoctor({
          selectedDoctor: `${Prevdtr.firstName} ${Prevdtr.lastName}`,
          selectedDoctorId: Prevdtr.employeeId
      });

      fetchDoctorSlots(Prevdtr.employeeId);
  
      const matchingDepartment = departmentsData.find(dept =>
        dept.deptName.toLowerCase().includes(Prevdtr.departmentName.toLowerCase())
      );
    
      if (matchingDepartment) {
        setDepartment({
          selectedDepartment: matchingDepartment.deptName,
          selectedDepartmentId: matchingDepartment.deptId
        });
      } else {
        // If no department matches, reset the department selection
        setDepartment({ selectedDepartment: '', selectedDepartmentId: '' });
      }
  };
    
  
  
    const doctorRefs = useRef({});
    const handleSearchChange = (event) => {
      console.log("event",event.target)
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
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const handleBookConsultation = async () => {
    setIsLoading(true);
    let selectedEventDate;
    let selectedEventFromDateTime;
   let selectedEventToDateTime;
     // Check if a slot is selected
    if (selectedSlotId !== null) {
      // Get the selected slot
      const selectedSlot = doctorSlots[selectedSlotId];
      // Access the eventDate of the selected slot
      selectedEventDate = selectedSlot.eventDate;
      selectedEventFromDateTime = selectedSlot.eventStartDateTime;
      selectedEventToDateTime = selectedSlot.eventEndDateTime;
      console.log("Selected Event Date:", selectedEventDate);
    } else {
      setIsLoading(false);
      // No slot selected, handle accordingly
        toast.error("Please Select a Slot", {
            position: "top-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
    }
    const bookConsultationRequestBody = {
        mrno:  selectedPatientMRNO,
        eventDate: selectedEventDate,
        empno: profileData.empno,
        empId: Number(doctor.selectedDoctorId),
        departmentId: Number(department.selectedDepartmentId),
        siteId: Number(profileData.siteId),
        userId: Number(profileData.userId)
    }
    axios
    .post(`${BACKEND_URL}/kiosk/saveAppointment?isAlreadyRegistered=true`,bookConsultationRequestBody)
     .then(async (response) => {
      setIsLoading(false);
          if(response.data.status === true){
          toast.success("Consultation Booked Successfully", {
         position: "top-right",
        autoClose: 1000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
      });

      
      // Wait for 2 seconds
      await delay(2000);
      const prefix = (alreadyRegisteredPatientDetails.prefix === '' || alreadyRegisteredPatientDetails === 'NA') ? '':alreadyRegisteredPatientDetails.prefix;
      const middleName = alreadyRegisteredPatientDetails.middleName === 'NA' ? '':alreadyRegisteredPatientDetails.middleName;
      const alreadyRegisteredSuccessConfirmation = {
        mrno:alreadyRegisteredPatientDetails.mrno,
        patientName:prefix + " "+alreadyRegisteredPatientDetails.firstName+ " "+ middleName+" "+alreadyRegisteredPatientDetails.lastName,
        appointmentDate:selectedEventDate,
        doctorName:doctor.selectedDoctor,
        department:department.selectedDepartment,
        slotFromTime:selectedEventFromDateTime,
        slotToTime:selectedEventToDateTime
      };
  
      localStorage.setItem("alreadyRegisteredSuccessConfirmation",JSON.stringify(alreadyRegisteredSuccessConfirmation));

      navigate('/SuccessConfirmation');
      }
      })
      .catch((error) => {
      setIsLoading(false);
      toast.error("Something Went Wrong!!!!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error saving data:', error);
      });
  }
    
      
  return (
    <div className='BookConsultationPage'>
     <Navbar pagename={"Book Consultation"} bookConsultationIsCalled={true}/>
     <div className='AppointmentContent'>


         {/* Date Container  */}
      <div style={{display:'flex',width:'100%',paddingTop:'14px',paddingBottom:'14px',  borderBottom: '1px solid var(--scarpa-flow-200, #D9D9DE)'}}>
       <div className='DateContainer'>
         <div className='AppointmentDateHeader'>
            Appointment Date

            <div className="datepicker-container">
              <button className="datepicker-arrow" onClick={handlePrevDay} disabled={disablePrevDayButton}><img src={DateLeftArrow} alt="" className='datepicker-arrow-image'/></button>
              <DatePicker selected={selectedDate} 
              onChange={date => {
              setSelectedDate(date);
              if (doctor.selectedDoctorId) {
                  fetchDoctorSlots(doctor.selectedDoctorId,date);
              }
              }} 
              dateFormat="dd / MM / yyyy" 
              className="datepicker-input"/>
              <button className="datepicker-arrow" onClick={handleNextDay}><img src={DateRightArrow} alt=""  /></button>
            </div>

         </div>
       </div>

        <div className='DtrDeptSearchContainer'>
        <img style={{cursor:"pointer"}} src={searchIcon} alt="searchIcon"/>
          <input className='DtrDeptSearchInput' type="text" placeholder='Search Department'  value={searchInput}
          onChange={handleSearchChange} 
          />
        </div>
      </div>




       {/* Previous Doctor Container  */}
       {prevdoctorsData.length > 0 && (
      <>
        <div className='doctorStateHeader'>
        LAST CONSULTED DOCTORS
        </div>

       <div className='DoctorContainer' style={{paddingBottom:'14px',  borderBottom: '1px solid var(--scarpa-flow-200, #D9D9DE)'}}>
      {prevdoctorsData.map((Prevdtr, index) => (
        <div key={index} style={{ display: 'flex' }}>
          <input
            type='radio'
            id={`doctor_${index}`}
            value={`${Prevdtr.firstName} ${Prevdtr.lastName}`}
            className='doctor-radio'
            checked={doctor.selectedDoctor === Prevdtr.doctorName}
            onChange={() => handlePrevDoctorSelect(Prevdtr)}
          />
          <label htmlFor={`doctor_${index}`}  className={`doctor-label ${doctor.selectedDoctorId === Prevdtr.employeeId ? 'selected' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
              <div>{`${Prevdtr.firstName} ${Prevdtr.lastName}`}</div>
              <div className='doctorDeptSubtitle'>{Prevdtr.departmentName}</div>
            </div>
          </label>
        </div>
      ))}
    </div>
    </> 
    )}

       {/* Department Container  */}

       <div className='doctorStateHeader'>
        CONSULT OTHER DOCTORS
        </div>
        
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
            <div style={{ display: 'flex' }}>
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

      <div>
          {doctorSlots.length > 0 ? (
            <div>
              {/* Available Slots Header */}
              <div className='Availableslotheader'>
                <div style={{ display:'flex', gap: '30px', alignItems:'center'}}>
                  SELECT SLOT
                  <img src={slotMarks} alt=""  />
                </div>
              </div>

              <div className='doctorSlotContainer' >
                {/* Render slots */}
                {doctorSlots.map((slot, index) => (
                  <React.Fragment key={index}>
                    <input
                      type='radio'
                      id={`slot${index}`}
                      value={index}
                      className='doctorslot-radio'
                      checked={index === selectedSlotId}
                      onChange={() => !slot.isBooked && selectSlot(index)}
                    />
                    <label htmlFor={`slot${index}`} className={`doctorslot-label ${index === selectedSlotId ? 'selected' : (slot.isBooked ? 'booked' : 'available')}`}>
                      {formatSlotTime(slot.eventStartDateTime)} - {formatSlotTime(slot.eventEndDateTime)}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (doctor.selectedDoctorId && (
            <div className='NoSlotsMessage'>
              NO SLOTS AVAILABLE
            </div>
          ))}
        </div>




     </div>   
     
     <div className='newRegistrationButtonGroupRow'>
      {/* <button className='newRegistrationCancelButton'>Clear All</button> */}
      <button className='newRegistrationSaveButton' onClick={handleBookConsultation} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save & Next'}</button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />     

    </div>
  )
}

export default BookConsultation