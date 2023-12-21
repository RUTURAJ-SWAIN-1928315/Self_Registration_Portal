//Author @Ruturaj Swain and @Bismit Pattnaik
import {React,useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import './RegisterPatientDetail.css'
import DefaultPatient from  "../../Assests/Images/defaultPatient.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPatientDetail() {
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_EMR_BACKEND_BASE_URL;
  const profileData = JSON.parse(localStorage.getItem('profileData'));
 
 const aadharData = JSON.parse(localStorage.getItem('aadharData'));

 //HardCoded aadharData for testing
// const aadharData = {
//   full_name: "Ruturaj Swain",
//   aadhaar_number: "537903394779",
//   dob: "2001-06-04",
//   gender: "M",
//   address: {
//       country: "India",
//       dist: "Khordha",
//       state: "Orissa",
//       po: "",
//       loc: "Nuasahi,Nayapalli",
//       vtc: "Bhubaneswar",
//       subdist: "",
//       street: "Keshari Enclave",
//       house: "Flat No-B-305",
//       landmark: ""
//   },
//   face_status: false,
//   face_score: -1.0,
//   zip: "751012",
//    profile_image: "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",
//   has_image: true,
//   care_of: "S/O Kruti Uchhwas Swain",
//   share_code: "3542",
//   mobile_verified: false,
//   referenceId: null,
//   status: "success_aadhaar",
//   uniqueness_id: "ede5d9acf30b8c308df44d040c54d7e02027df268a2cf8391d0bc5ef18e7b376"
// }
 
  const [disableInputFieldAadhar,setDisableInputFieldAadhar] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  //const siteId = localStorage.getItem('SiteId');



  // const [patientTypeList,setPatientTypeList] = useState([]);
  const [prefixMaster,setPrefixMaster] = useState([]);
    const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [genderList,setGenderList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [maskedAadharNumber, setMaskedAadharNumber] = useState('');


  const [patientImage,SetPatientImage] = useState('');
  // const [selectedGender, setSelectedGender] = useState('female');  
  const [formData, setFormData] = useState({
    firstName:'',
    middleName:'',
    lastName:'',
    selectedGender: '',
    selectedGenderId:'',
    selectedArea: 'Urban',
    selectedPrefix:'',
    selectedPrefixId:'',
    aadharNumber:'',
    mobileNumber:'',
    dob:'',
    age:'',
    emailId:'',
    pinCode: '',
    district: '',
    state: '',
    country: '',
    village: '',
    city:'',
    locality: '',
    postOffice: '',
    policeStation: '',
  });
 

   // Function to mask Aadhar number
   const maskAadharNumber = (number) => {
    return 'XXXX XXXX ' + number.slice(-4);
  };

  useEffect(() => {

    if(aadharData && aadharData.has_image){
      SetPatientImage(`data:image/jpeg;base64,${aadharData.profile_image}`);
    }

    if(aadharData !== null){
      setDisableInputFieldAadhar(true);
      // Call maskAadharNumber function and update the masked Aadhar number state
      if (aadharData && aadharData.aadhaar_number) {
        setMaskedAadharNumber(maskAadharNumber(aadharData.aadhaar_number));
      }
      const fullNameParts = aadharData.full_name.split(' ');
      const firstName = fullNameParts[0];
      const lastName = fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : '';
      const middleName = fullNameParts.slice(1, -1).join(' ');
      // Call calculateAge function and update the formData state
      const age = calculateAge(aadharData.dob);

      let gender;
      if (aadharData.gender === 'M') {
          gender = 'MALE';
      } else if (aadharData.gender === 'F') {
          gender = 'FEMALE';
      } else {
          gender = 'OTHERS';
      }
      // Set initial form data based on Aadhar data
      setFormData({
        ...formData,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        selectedGender: gender,
        aadharNumber: aadharData.aadhaar_number,
        pinCode:aadharData.zip,
        dob: aadharData.dob,
        age:age,
        district: aadharData.address.dist,
        state: aadharData.address.state,
        country: aadharData.address.country,
        city: aadharData.address.vtc,
        village:aadharData.address.vtc,
        locality: aadharData.address.loc,
        postOffice: aadharData.address.po,
      });
    }
  }, []);
 

   // Function to calculate age
   const calculateAge = (dob) => {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  //  //For getting Patient Type master
  //  useEffect(() => {
    
  //   axios
  //     .get(`${BACKEND_URL}/kiosk/patientTypeMaster?siteId=${profileData.siteId}`)
  //     .then((response) => {
  //       if (response.data && response.data.status === "sucess") {
  //         const types = response.data.data.map(item => item.registrationType);
  //         setPatientTypeList(types);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  //   }, [BACKEND_URL,profileData.siteId]);

       //For getting Prefix master
   useEffect(() => {
    axios
      .get(`${BACKEND_URL}/kiosk/getPrefixMaster?`)
      .then((response) => {
        if (response.data && response.data.status === "success") {
          const prefixes = response.data.data.map(item => ({
            prefix: item.prefix,
            prefixId: item.prefixId,
          }));
          setPrefixMaster(prefixes);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, [BACKEND_URL,profileData?.siteId]);



    const handleAddressChange = (event) => {
      // const pinCode = event.target.value;
      // setFormData({ ...formData, pinCode: pinCode });
      // const state = event.target.value;
      // setFormData({ ...formData, state: state });
      // const country = event.target.value;
      // const district = event.target.value;
      // setFormData({ ...formData, district: district });
      // //cityName and village will be suggestions
      // const village = event.target.value;
      // setFormData({ ...formData, village: village });

      // Update only the field that triggered the event
      const { name, value } = event.target;
      console.log("value",value);
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

     // Check if the name of the field is pinCode and its value is empty
  if (name === "pinCode" && value.trim() === "") {
    // Reset all lists
    setCountryList([]);
    setStateList([]);
    setDistrictList([]);
    setVillageList([]);
  }else if (name === "pinCode" && value.length === 6){

      if (value.length === 6) { // Assuming pin code length is 6
        axios.get(`${BACKEND_URL}/kiosk/getAddressMaster?pinCode=${value}`, {
        })
        .then((response) => {
          if (response.data.status === "success" && response.data.data.length > 0) {
            const data = response.data.data;
            const uniqueCountries = [...new Set(data.map(item => item.countryName))];
            const uniqueStates = [...new Set(data.map(item => item.stateName))];
            const uniqueDistricts = [...new Set(data.map(item => item.districtName))];
            // const uniqueCities = [...new Set(data.map(item => item.cityName).filter(name => name))];
            const uniqueVillages = [...new Set(data.map(item => item.villageName).filter(name => name))];
    
            setCountryList(uniqueCountries);
            setStateList(uniqueStates);
            setDistrictList(uniqueDistricts);
            // setCityList(uniqueCities);
            setVillageList(uniqueVillages);
          }
        })
        .catch((error) => {
          console.error('Error fetching address data:', error);
        });
      }
    }
    };
 
 
  // const handleGenderChange = (event) => {
  //   setSelectedGender(event.target.value);
  // };

  const handleInputChange = (event) =>{
    const { name, value } = event.target;
     // Ensure only numeric values are entered for mobileNumber
  if (name === 'mobileNumber' && !/^\d+$/.test(value)) {
    return; // Ignore non-numeric input
  }
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'mobileNumber' ? value.slice(0, 10) : value
    }));
  }

  const handlePrefixChange = (event) => {
    const selectedPrefix = event.target.value;
  
    // Find the corresponding prefixId based on the selected prefix
    const selectedPrefixId = prefixMaster.find(item => item.prefix === selectedPrefix)?.prefixId;
  
    // Update the formData state with the selectedPrefix and selectedPrefixId
    setFormData(prevState => ({
      ...prevState,
      selectedPrefix: selectedPrefix,
      selectedPrefixId: selectedPrefixId,
    }));
  };

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      selectedArea: value
    }));
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function formatDate(inputDate) {
    const dateParts = inputDate.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return formattedDate;
  }

  const isEmailValid = (email) => {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  const handleSaveNewRegistration = () =>{
    console.log("formData.selectedPrefix",formData.selectedPrefix,"formData.selectedPrefixId",formData.selectedPrefixId)
     // Validate mandatory fields
  const mandatoryFields = [
    'firstName',
    'selectedGender',
    'aadharNumber',
    'pinCode',
    'mobileNumber',
    'dob',
    'age',
    'district',
    'state',
    'country',
    'village',
  ];

  const missingFields = mandatoryFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    // Display toast error if any mandatory field is missing
    toast.error(`Please fill all mandatory fields: ${missingFields.join(', ')}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  // Validate email
  if (formData.emailId && !isEmailValid(formData.emailId)) {
    toast.error('Invalid email address', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }


    const formattedDOB = formatDate(aadharData.dob);
    
    const newRegistrationRequestBody = {
      genderId:formData.selectedGenderId,
      siteId:Number(profileData?.siteId),
      prefixId:Number(formData.selectedPrefixId),
      prefix:formData.selectedPrefix,
      firstName:formData.firstName,
      middleName:formData.middleName === '' ? 'NA': formData.middleName,
      lastName:formData.lastName,
      gender:formData.selectedGender,
      dobStr:formattedDOB,
      age:Number(formData.age),
      contactNo:Number(formData.mobileNumber),
      email:formData.emailId,
      userId:Number(profileData.userId),
      aadhaarNumber:formData.aadharNumber,
      addressList:[
        {
          active:true,
          isRural:formData.selectedArea === 'Rural'?true:false,
          isUrban:formData.selectedArea === 'Urban'?true:false,
          pin:Number(formData.pinCode),
          district:formData.district,
          state:formData.state,
          country:formData.country,
          village:formData.village,
          locality:formData.locality,
          postOffice:formData.postOffice,
          policeStation:formData.policeStation
        }
      ]
    }
    
    axios
    .post(`${BACKEND_URL}/kiosk/registerPatient`,newRegistrationRequestBody)
     .then(async (response) => {
      setIsLoading(false);
          if(response.data.status === true){
          toast.success("Registration Successfull", {
         position: "top-right",
        autoClose: 1000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
      });
      handleClearAllInputs();

      // Wait for 2 seconds
      await delay(2000);

      navigate('/NewRegisterBookConsultation');
     }
     })
    .catch((error) => {
      console.error('Error saving data:', error);
    });
    
  }

  
  const handleClearAllInputs = () =>{
    setFormData({
      ...formData,
      firstName:  '',
      middleName: '',
      lastName: '',
      selectedGender: '',
      aadharNumber:'',
      pinCode: '',
      mobileNumber:'',
      dob: '',
      emailId:'',
      age:'',
      district:'',
      state: '',
      country:'',
      city: '',
      village:'',
      locality:'',
      postOffice:'',
    });
  }

return (
  <>
    <Navbar pagename={'New Registration'}/>
     
     <div className='newRegisterPatientBody'>
      <div className='newRegisterPatientContent' style={{display:'flex', flexDirection:'row'}}>

         <div style={{border:'groove', borderColor:'#f0ffff34', width:'11%', height:'170px', display:'flex', alignItems:'center', justifyContent:'center',borderRadius:'20px'}}>
           <img className='patientImage' src={patientImage || DefaultPatient} alt="Patient" />
         </div>

         <div className='detailContainer1' style={{ borderColor:'#f0ffff34', width:'100%' }}>

          <div> 

                  {/* <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Patient Type<span className='mandatoryField'>*</span></div>
                    <div style={{width: "80%"}}>
                        <select className='patientTypeSelectDropdown' placeholder='Select' 
                          >
                            <option className='patientOptionDropdown' disabled>Select Patient Type</option>
                            {patientTypeList.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                    </div>
                  </div> */}

                  <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Prefix<span className='mandatoryField'>*</span></div>
                    <div style={{width: "80%"}}>
                    <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedPrefix} onChange={(e) => handlePrefixChange(e)}>
                      <option className='patientOptionDropdown' value="" disabled>Select Prefix</option>
                      {prefixMaster.map((type, index) => (
                        <option key={index} value={type.prefix}>{type.prefix}</option>
                      ))}
                    </select>
                    </div>
                  </div>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Gender<span className='mandatoryField'>*</span></div>
                    {disableInputFieldAadhar ? (
                      <div style={{width: "80%"}}>
                      <input style={{borderRadius: '6px',width:'237px'}} className='patientNameInput' placeholder='Gender' value={formData.selectedGender} disabled={disableInputFieldAadhar}></input>
                      </div>
                    ):(

                      <div style={{width: "80%"}}>
                      <select className='patientTypeSelectDropdown' placeholder='Select' value={formData.selectedGender} disabled={disableInputFieldAadhar}>
                            <option className='patientOptionDropdown' disabled>Select Gender</option>
                            {genderList.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                        </div>
                    )}
                       
                    
                 </div>
             </div>

             <div style={{paddingLeft:'30px',paddingRight:'30px', width:'100%'}}>

             <div className="patientTypeDetailBox">
                <div className='patientTypeDetailLabel'>Patient Name<span className='mandatoryField'>*</span></div>
                  <div style={{display:'flex'}}>
                  <input style={{borderRadius: '6px 0px 0px 6px'}} className='patientNameInput' placeholder='First Name' value={formData.firstName} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                  <input style={{borderRadius: '0px'}} className='patientNameInput' placeholder='Middle Name' value={formData.middleName} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                  <input style={{borderRadius: '0px 6px 6px 0px'}} className='patientNameInput' placeholder='Last Name' value={formData.lastName} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                </div>
              </div>
              <div style={{display:'flex', gap:'20px'}}>

                 <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Date of Birth</div>
                    <div style={{display:'flex'}}>
                    <input className='patientDatePicker' type='date' placeholder='dd-mm-yyyy' value={formData.dob} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                    </div>  
                 </div>

                 <div style={{display:'flex', flexDirection:'column',gap:'6px'}}>    
                  <div className='patientTypeDetailLabel'>Age<span className='mandatoryField'>*</span></div>
                  <div className='patientAgeContainer'> 
                  <input style={{ borderRadius: '6px 0px 0px 6px'}} className='patientAgeInput' value = {formData.age} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                  <select style={{
                    borderRadius: '0px 6px 6px 0px',
                    backgroundColor: disableInputFieldAadhar ? '#D9D9DE' : 'inherit',
                    }}
                    disabled={disableInputFieldAadhar}
                    >
                          <option value="Days">Days</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                        </select>
                  </div>
                </div>

                <div style={{display:'flex', flexDirection:'column',gap:'6px',width:'100%'}}>
                  <div className='patientTypeDetailLabel'>Mobile Number<span className='mandatoryField'>*</span></div>
                  <input name = 'mobileNumber' className='patientNumberInput' placeholder='0000000000' value={formData.mobileNumber} onChange={handleInputChange}></input>
                </div> 

              </div>

                                 
              </div>
         </div>
         
      </div>
      <div className='newRegisterPatientAdharContent' style={{display:'flex', gap:'20px', paddingTop:'0px', paddingBottom:'0px'}}>
                <div style={{ width:'50%'}}>
                  <div className="patientTypeDetailBox">
                    <div className='patientTypeDetailLabel'>Aadhar Number<span className='mandatoryField'>*</span></div>
                    <div style={{display:'flex'}}>
                    <input className='aadharNumberInput' placeholder='0000 0000 0000 0000' value={maskedAadharNumber} disabled={disableInputFieldAadhar} onChange={handleInputChange}></input>
                    </div>
                  </div>
  
                </div>
                <div style={{ width:'50%'}}>
                <div className="patientTypeDetailBox">
                  <div className='patientTypeDetailLabel'>Email</div>
                  <div style={{display:'flex'}}>
                  <input className='aadharNumberInput' placeholder='example@email.com' name='emailId' value={formData.emailId} onChange={handleInputChange}></input>
                  </div>
                    
                  </div>
                </div>

      </div>

      <div className='AddressContainer'>

      <div className='patientTypeDetailLabel'>ADDRESS DETAILS</div>
        <div className='areaSelectionBox'>
          <div className='patientTypeDetailLabel'>Area<span className='mandatoryField'>*</span></div>
           <div className="gender-selection">
            <input
              type="radio"
              id="Urban"
              name="Area"
              value="Urban"
              checked={formData.selectedArea === 'Urban'}
              onChange={handleAreaChange}
              className="gender-radio"
            />
            <label htmlFor="Urban" className={`gender-label ${formData.selectedArea === 'Urban' ? 'selected' : ''}`}>
              Urban
            </label>

              <input
                type="radio"
                id="Rural"
                name="Area"
                value="Rural"
                checked={formData.selectedArea === 'Rural'}
                onChange={handleAreaChange}
                className="gender-radio"
              />
              <label htmlFor="Rural" className={`gender-label ${formData.selectedArea === 'Rural' ? 'selected' : ''}`}>
                Rural
              </label>

            </div>
            </div>

     <div style={{ width:'100%', height:'133px'}}>
          <div className='addressDetailsContentRow'>
                <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>Pin Code<span className='mandatoryField'>*</span></div>
                <input
                  type="text"
                  name="pinCode"
                  className='addressInput'
                  placeholder='Pin Code'
                  value={formData.pinCode}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
                </div>

                <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>District<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='district'
                  className='addressInput'
                  placeholder='District'
                  value={formData.district}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>

              <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>State<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='state'
                  className='addressInput'
                  placeholder='State'
                  value={formData.state}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>

              <div className='addressInputRow'>
                <div className='patientTypeDetailLabel'>Country<span className='mandatoryField'>*</span></div>
                <input
                  type='text'
                  name='country'
                  className='addressInput'
                  placeholder='Country'
                  value={formData.country}
                  disabled={disableInputFieldAadhar}
                  onChange={handleAddressChange}
                />
              </div>
                </div>
            
           
            <div className='addressDetailsContentRow1'>
            {formData.selectedArea === 'Rural' ? (
            <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Village<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="village"
               className='addressInput'
              placeholder='Village'
               value={formData.village}
              onChange={handleAddressChange}
             />
            </div>
            ) : (
              <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>City<span className='mandatoryField'>*</span></div>
            <input
               type="text"
               name="city"
               className='addressInput'
              placeholder='City'
               value={formData.city}
              onChange={handleAddressChange}
             />
            </div>
            )}

            
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Locality</div>
                      <input style={{borderRadius: '6px',width:'320px'}} className='patientNameInput' placeholder='locality' value={formData.locality} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Locality</div>
              <select
                name='locality'
                className='patientTypeSelectDropdownAddress'
                value={formData.locality}
                disabled={disableInputFieldAadhar}
                onChange={handleAddressChange}
              >
                <option value=''>Select Locality</option>
                {/* Add options dynamically here */}
              </select>
              </div>
            )}
              
            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Post Office' value={formData.postOffice || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Post Office<span className='mandatoryField'>*</span></div>
              <select
                name='postOffice'
                className='patientTypeSelectDropdownAddress'
                value={formData.postOffice}
                disabled={disableInputFieldAadhar}
                onChange={handleAddressChange}
              >
                <option value=''>Select Post Office</option>
                {/* Add options dynamically here */}
              </select>
            </div>

            )}

            {disableInputFieldAadhar ? (
              <div className='addressInputRow'>
              <div className='patientTypeDetailLabel'>Police Station</div>
                      <input style={{borderRadius: '6px',width:'316px'}} className='patientNameInput' placeholder='Police Station' value={formData.policeStation || ' '} disabled={disableInputFieldAadhar}></input>
                      </div>
            ):(
              <div className='addressInputRow'>
            <div className='patientTypeDetailLabel'>Police Station<span className='mandatoryField'>*</span></div>
            <select
              name='policeStation'
              className='patientTypeSelectDropdownAddress'
              value={formData.policeStation}
              onChange={handleAddressChange}
            >
              <option value=''>Select Police Station</option>
              {/* Add options dynamically here */}
            </select>
          </div>
            )}

            </div>
         </div> 

      </div>

      <div className='newRegistrationButtonGroupRow'>
      {!disableInputFieldAadhar && (
        
      <button className='newRegistrationCancelButton' onClick={handleClearAllInputs} disabled={disableInputFieldAadhar}>Clear All</button>
      
      )}
      <button className='newRegistrationSaveButton' onClick={handleSaveNewRegistration} >{isLoading ? 'Saving...' : 'Save & Next'}</button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
     </div>
    
  </>
)
}

export default RegisterPatientDetail